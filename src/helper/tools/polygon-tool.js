import paper from '@nitro-bolt/paper';
import Modes from '../../lib/modes';
import {styleShape} from '../style-path';
import {clearSelection} from '../selection';
import {getSquareDimensions} from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

/**
 * Tool for drawing regular polygons within a dragged bounding box.
 */
class PolygonTool extends paper.Tool {
    static get TOLERANCE () {
        return 2;
    }
    /**
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {function} setCursor Callback to set the visible mouse cursor
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     */
    constructor (setSelectedItems, clearSelectedItems, setCursor, onUpdateImage) {
        super();
        this.setSelectedItems = setSelectedItems;
        this.clearSelectedItems = clearSelectedItems;
        this.onUpdateImage = onUpdateImage;
        this.boundingBoxTool = new BoundingBoxTool(
            Modes.POLYGON,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage
        );
        const nudgeTool = new NudgeTool(Modes.POLYGON, this.boundingBoxTool, onUpdateImage);

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        this.polygon = null;
        this.polygonRadius = 16;
        this.polygonSides = 4;
        this.colorState = null;
        this.isBoundingBoxMode = null;
        this.active = false;
    }
    getHitOptions () {
        return {
            segments: true,
            stroke: true,
            curves: true,
            fill: true,
            guide: false,
            match: hitResult =>
                (hitResult.item.data && (hitResult.item.data.isScaleHandle || hitResult.item.data.isRotHandle)) ||
                hitResult.item.selected, // Allow hits on bounding box and selected only
            tolerance: PolygonTool.TOLERANCE / paper.view.zoom
        };
    }
    setPolygonRadius (polygonRadius) {
        this.polygonRadius = polygonRadius;
    }
    setPolygonSides (polygonSides) {
        this.polygonSides = polygonSides;
    }
    createPolygon (rect) {
        const center = rect.center;
        const radiusX = rect.width / 2;
        const radiusY = rect.height / 2;
        const startAngle = this.polygonSides % 2 ?
            -Math.PI / 2 :
            (-Math.PI / 2) + (Math.PI / this.polygonSides);
        const angles = [];
        let maxCos = 0;
        let maxSin = 0;
        for (let i = 0; i < this.polygonSides; i++) {
            const angle = startAngle + (2 * Math.PI * i / this.polygonSides);
            angles.push(angle);
            maxCos = Math.max(maxCos, Math.abs(Math.cos(angle)));
            maxSin = Math.max(maxSin, Math.abs(Math.sin(angle)));
        }
        const vertices = [];
        for (let i = 0; i < angles.length; i++) {
            const angle = angles[i];
            vertices.push(new paper.Point(
                center.x + (radiusX * Math.cos(angle) / maxCos),
                center.y + (radiusY * Math.sin(angle) / maxSin)
            ));
        }

        const path = new paper.Path({closed: true});
        for (let i = 0; i < vertices.length; i++) {
            const previous = vertices[(i + vertices.length - 1) % vertices.length];
            const vertex = vertices[i];
            const next = vertices[(i + 1) % vertices.length];
            const cornerRadius = Math.min(
                this.polygonRadius,
                vertex.getDistance(previous) / 2,
                vertex.getDistance(next) / 2
            );
            if (cornerRadius <= 0) {
                path.add(vertex);
                continue;
            }
            const incoming = vertex.add(previous.subtract(vertex).normalize(cornerRadius));
            const outgoing = vertex.add(next.subtract(vertex).normalize(cornerRadius));
            if (i === 0) {
                path.moveTo(incoming);
            } else {
                path.lineTo(incoming);
            }
            path.quadraticCurveTo(vertex, outgoing);
        }
        path.closePath();
        return path;
    }
    /**
     * Should be called if the selection changes to update the bounds of the bounding box.
     * @param {Array<paper.Item>} selectedItems Array of selected items.
     */
    onSelectionChanged (selectedItems) {
        this.boundingBoxTool.onSelectionChanged(selectedItems);
    }
    setColorState (colorState) {
        this.colorState = colorState;
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        if (this.boundingBoxTool.onMouseDown(
            event, false /* clone */, false /* multiselect */, false /* doubleClicked */, this.getHitOptions())) {
            this.isBoundingBoxMode = true;
        } else {
            this.isBoundingBoxMode = false;
            clearSelection(this.clearSelectedItems);
        }
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }

        if (this.polygon) {
            this.polygon.remove();
        }

        const rect = new paper.Rectangle(event.downPoint, event.point);
        const squareDimensions = getSquareDimensions(event.downPoint, event.point);
        if (event.modifiers.shift) {
            rect.size = squareDimensions.size.abs();
        }

        this.polygon = this.createPolygon(rect);
        if (event.modifiers.alt) {
            this.polygon.position = event.downPoint;
        } else if (event.modifiers.shift) {
            this.polygon.position = squareDimensions.position;
        } else {
            const dimensions = event.point.subtract(event.downPoint);
            this.polygon.position = event.downPoint.add(dimensions.multiply(0.5));
        }

        styleShape(this.polygon, this.colorState);
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        if (this.polygon) {
            if (this.polygon.area < PolygonTool.TOLERANCE / paper.view.zoom) {
                // Tiny rectangle created unintentionally?
                this.polygon.remove();
                this.polygon = null;
            } else {
                this.polygon.selected = true;
                this.setSelectedItems();
                this.onUpdateImage();
                this.polygon = null;
            }
        }
        this.active = false;
    }
    handleMouseMove (event) {
        this.boundingBoxTool.onMouseMove(event, this.getHitOptions());
    }
    deactivateTool () {
        this.boundingBoxTool.deactivateTool();
    }
}

export default PolygonTool;

import paper from '@nitro-bolt/paper';
import PropTypes from 'prop-types';

import React from 'react';
import {connect} from 'react-redux';
import ScrollableCanvasComponent from '../components/scrollable-canvas/scrollable-canvas.jsx';

import {clampViewBounds, pan, zoomOnFixedPoint, getWorkspaceBounds} from '../helper/view';
import {updateViewBounds} from '../reducers/view-bounds';
import {redrawSelectionBox} from '../reducers/selected-items';

import {getEventXY} from '../lib/touch-utils';
import bindAll from 'lodash.bindall';

class ScrollableCanvas extends React.Component {
    static get ZOOM_INCREMENT () {
        return 0.5;
    }
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleMouseDown',
            'handleDragMove',
            'handleDragEnd',
            'handleHorizontalScrollbarMouseDown',
            'handleHorizontalScrollbarMouseMove',
            'handleHorizontalScrollbarMouseUp',
            'handleVerticalScrollbarMouseDown',
            'handleVerticalScrollbarMouseMove',
            'handleVerticalScrollbarMouseUp',
            'handleWheel'
        ]);
    }
    componentDidMount () {
        if (this.props.canvas) {
            this.props.canvas.addEventListener('wheel', this.handleWheel);
            this.props.canvas.addEventListener('mousedown', this.handleMouseDown);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.canvas) {
            if (this.props.canvas) {
                this.props.canvas.removeEventListener('wheel', this.handleWheel);
                this.props.canvas.removeEventListener('mousedown', this.handleMouseDown);
            }
            nextProps.canvas.addEventListener('wheel', this.handleWheel);
            nextProps.canvas.addEventListener('mousedown', this.handleMouseDown);
        }
    }
    handleMouseDown (event) {
        if (event.button === 1) {
            event.preventDefault();
            const {x, y} = getEventXY(event);
            this.initialMouseX = x;
            this.initialMouseY = y;
            this.initialScreenX = paper.view.matrix.tx;
            this.initialScreenY = paper.view.matrix.ty;
            this.initialCursor = this.props.canvas.style.cursor;
            this.props.canvas.style.cursor = 'move';
            window.addEventListener('mousemove', this.handleDragMove);
            window.addEventListener('mouseup', this.handleDragEnd);
        }
    }
    handleDragMove (event) {
        event.preventDefault();
        const {x, y} = getEventXY(event);
        paper.view.matrix.ty = this.initialScreenY - (this.initialMouseY - y);
        paper.view.matrix.tx = this.initialScreenX - (this.initialMouseX - x);
        clampViewBounds();
        this.props.updateViewBounds(paper.view.matrix);
        if (this.props.canvas) {
            this.props.canvas.style.cursor = 'move';
        }
    }
    handleDragEnd (event) {
        event.preventDefault();
        window.removeEventListener('mousemove', this.handleDragMove);
        window.removeEventListener('mouseup', this.handleDragEnd);
        if (this.props.canvas) {
            this.props.canvas.style.cursor = this.initialCursor;
        }
    }
    getScrollbarBounds () {
        if (this.scrollbarBounds) {
            return this.scrollbarBounds;
        }
        const bounds = paper.view.bounds;
        // Leave room to keep scrolling in every direction on the workspace.
        return getWorkspaceBounds().unite(bounds.expand(bounds.width, bounds.height));
    }
    handleHorizontalScrollbarMouseDown (event) {
        this.initialMouseX = getEventXY(event).x;
        this.initialScreenX = paper.view.matrix.tx;
        this.scrollbarBounds = this.getScrollbarBounds();
        const trackWidth = event.currentTarget.parentElement.getBoundingClientRect().width;
        this.horizontalScrollScale = this.scrollbarBounds.width * paper.view.zoom / trackWidth;
        window.addEventListener('mousemove', this.handleHorizontalScrollbarMouseMove);
        window.addEventListener('touchmove', this.handleHorizontalScrollbarMouseMove, {passive: false});
        window.addEventListener('mouseup', this.handleHorizontalScrollbarMouseUp);
        window.addEventListener('touchend', this.handleHorizontalScrollbarMouseUp);
        event.preventDefault();
    }
    handleHorizontalScrollbarMouseMove (event) {
        const dx = this.initialMouseX - getEventXY(event).x;
        const tx = this.initialScreenX + (dx * this.horizontalScrollScale);
        paper.view.matrix.tx = Math.max(
            paper.view.viewSize.width - (this.scrollbarBounds.right * paper.view.zoom),
            Math.min(-this.scrollbarBounds.left * paper.view.zoom, tx));
        clampViewBounds();
        this.props.updateViewBounds(paper.view.matrix);
        event.preventDefault();
    }
    handleHorizontalScrollbarMouseUp (event) {
        window.removeEventListener('mousemove', this.handleHorizontalScrollbarMouseMove);
        window.removeEventListener('touchmove', this.handleHorizontalScrollbarMouseMove, {passive: false});
        window.removeEventListener('mouseup', this.handleHorizontalScrollbarMouseUp);
        window.removeEventListener('touchend', this.handleHorizontalScrollbarMouseUp);
        this.initialMouseX = null;
        this.initialScreenX = null;
        this.scrollbarBounds = null;
        this.props.updateViewBounds(paper.view.matrix);
        event.preventDefault();
    }
    handleVerticalScrollbarMouseDown (event) {
        this.initialMouseY = getEventXY(event).y;
        this.initialScreenY = paper.view.matrix.ty;
        this.scrollbarBounds = this.getScrollbarBounds();
        const trackHeight = event.currentTarget.parentElement.getBoundingClientRect().height;
        this.verticalScrollScale = this.scrollbarBounds.height * paper.view.zoom / trackHeight;
        window.addEventListener('mousemove', this.handleVerticalScrollbarMouseMove);
        window.addEventListener('touchmove', this.handleVerticalScrollbarMouseMove, {passive: false});
        window.addEventListener('mouseup', this.handleVerticalScrollbarMouseUp);
        window.addEventListener('touchend', this.handleVerticalScrollbarMouseUp);
        event.preventDefault();
    }
    handleVerticalScrollbarMouseMove (event) {
        const dy = this.initialMouseY - getEventXY(event).y;
        const ty = this.initialScreenY + (dy * this.verticalScrollScale);
        paper.view.matrix.ty = Math.max(
            paper.view.viewSize.height - (this.scrollbarBounds.bottom * paper.view.zoom),
            Math.min(-this.scrollbarBounds.top * paper.view.zoom, ty));
        clampViewBounds();
        this.props.updateViewBounds(paper.view.matrix);
        event.preventDefault();
    }
    handleVerticalScrollbarMouseUp (event) {
        window.removeEventListener('mousemove', this.handleVerticalScrollbarMouseMove);
        window.removeEventListener('touchmove', this.handleVerticalScrollbarMouseMove, {passive: false});
        window.removeEventListener('mouseup', this.handleVerticalScrollbarMouseUp);
        window.removeEventListener('touchend', this.handleVerticalScrollbarMouseUp);
        this.initialMouseY = null;
        this.initialScreenY = null;
        this.scrollbarBounds = null;
        this.props.updateViewBounds(paper.view.matrix);
        event.preventDefault();
    }
    handleWheel (event) {
        // Multiplier variable, so that non-pixel-deltaModes are supported. Needed for Firefox.
        // See #529 (or LLK/scratch-blocks#1190).
        const multiplier = event.deltaMode === 0x1 ? 15 : 1;
        const deltaX = event.deltaX * multiplier;
        const deltaY = event.deltaY * multiplier;
        const canvasRect = this.props.canvas.getBoundingClientRect();
        const offsetX = event.clientX - canvasRect.left;
        const offsetY = event.clientY - canvasRect.top;
        const fixedPoint = paper.view.viewToProject(
            new paper.Point(offsetX, offsetY)
        );
        if (event.metaKey || event.ctrlKey) {
            // Zoom keeping mouse location fixed
            zoomOnFixedPoint(-deltaY / 500, fixedPoint);
            this.props.updateViewBounds(paper.view.matrix);
            this.props.redrawSelectionBox(); // Selection handles need to be resized after zoom
        } else if (event.shiftKey && event.deltaX === 0) {
            // Scroll horizontally (based on vertical scroll delta)
            // This is needed as for some browser/system combinations which do not set deltaX.
            // See #156.
            const dx = deltaY / paper.view.zoom;
            pan(dx, 0);
            this.props.updateViewBounds(paper.view.matrix);
        } else {
            const dx = deltaX / paper.view.zoom;
            const dy = deltaY / paper.view.zoom;
            pan(dx, dy);
            this.props.updateViewBounds(paper.view.matrix);
            if (paper.tool) {
                paper.tool.view._handleMouseEvent('mousemove', event, fixedPoint);
            }
        }
        event.preventDefault();
    }
    render () {
        let widthPercent = 0;
        let heightPercent = 0;
        let topPercent = 0;
        let leftPercent = 0;
        if (paper.project) {
            const bounds = this.getScrollbarBounds();
            const {x, y, width, height} = paper.view.bounds;
            widthPercent = 100 * width / bounds.width;
            heightPercent = 100 * height / bounds.height;
            topPercent = Math.max(0, Math.min(100 - heightPercent, 100 * (y - bounds.y) / bounds.height));
            leftPercent = Math.max(0, Math.min(100 - widthPercent, 100 * (x - bounds.x) / bounds.width));
        }
        return (
            <ScrollableCanvasComponent
                hideScrollbars={this.props.hideScrollbars}
                horizontalScrollLengthPercent={widthPercent}
                horizontalScrollStartPercent={leftPercent}
                style={this.props.style}
                verticalScrollLengthPercent={heightPercent}
                verticalScrollStartPercent={topPercent}
                onHorizontalScrollbarMouseDown={this.handleHorizontalScrollbarMouseDown}
                onVerticalScrollbarMouseDown={this.handleVerticalScrollbarMouseDown}
            >
                {this.props.children}
            </ScrollableCanvasComponent>
        );
    }
}

ScrollableCanvas.propTypes = {
    canvas: PropTypes.instanceOf(Element),
    children: PropTypes.node.isRequired,
    hideScrollbars: PropTypes.bool,
    redrawSelectionBox: PropTypes.func.isRequired,
    style: PropTypes.string,
    updateViewBounds: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    viewBounds: state.scratchPaint.viewBounds
});
const mapDispatchToProps = dispatch => ({
    redrawSelectionBox: () => {
        dispatch(redrawSelectionBox());
    },
    updateViewBounds: matrix => {
        dispatch(updateViewBounds(matrix));
    }
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScrollableCanvas);

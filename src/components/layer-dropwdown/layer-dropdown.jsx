import React from "react";
import paper from "@turbowarp/paper";
import classNames from "classnames";

import styles from "./layer-dropdown.css";
import InputGroup from "../input-group/input-group.jsx";
import Dropdown from "../dropdown/dropdown.jsx";

function getLayerSVGDataURL(layer) {
    const bounds = layer.drawnBounds;
    const svg = layer.exportSVG({
        asString: true,
        bounds: "content",
        matrix: new paper.Matrix().translate(bounds.x, bounds.y),
    });
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${bounds.x}" height="${bounds.y}" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}">${svg}</svg>`;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
}

const LayerDropDown = ({
    layers,
    onChoose,
    onOpenDropdown,
    onClickOutsideDropdown,
}) => (
    // const [selectedLayerIndex, setSelectedLayerIndex] = React.useState(0);
    <Dropdown
        className={styles.dropdown}
        enterExitTransitionDurationMs={60}
        popoverContent={
            <InputGroup className={styles.layerList}>
                {layers.length > 0 ? (
                    layers.map((layer, index) => (
                        <div
                            onClick={() => {
                                // onChoose(layer);
                                // setSelectedLayerIndex(layer.index);
                            }}
                            key={index}
                            // className={classNames(styles.layerOption, {
                            // [styles.layerOptionSelected]:
                            // layer.index === selectedLayerIndex,
                            // })}
                        >
                            <img
                                src={getLayerSVGDataURL(layer)}
                                width={60}
                                height={38}
                            />
                            <div>{layer.name || `Layer ${index + 1}`}</div>
                        </div>
                    ))
                ) : (
                    <span>No layers</span>
                )}
            </InputGroup>
        }
        tipSize={0.01}
        onOpen={onOpenDropdown}
        onOuterAction={onClickOutsideDropdown}
    >
        <span>Layers</span>
    </Dropdown>
);
export default LayerDropDown;

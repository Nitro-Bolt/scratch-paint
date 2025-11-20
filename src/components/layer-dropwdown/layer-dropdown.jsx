import React from "react";
import classNames from "classnames";

import styles from './layer-dropdown.css'
import Button from '../button/button.jsx';
import InputGroup from "../input-group/input-group.jsx";
import Dropdown from "../dropdown/dropdown.jsx";

const LayerDropDown = props => {
    return (
        <Dropdown
            className={classNames(styles.modUnselect, styles.dropdown)}
            enterExitTransitionDurationMs={60}
            popoverContent={
                <InputGroup className={styles.modContextMenu}>
                    {
                        props.layers.length > 0 
                        ? props.layers.map((layer, index) => (
                            <Button
                                key={index}
                                className={styles.modMenuItem}
                                onClick={() => props.onChoose(layer)}
                            >
                                {layer.name || `Layer ${index + 1}`}
                            </Button>
                        ))
                        : <span>No layers</span>
                    }
                </InputGroup>
            }
            tipSize={.01}
            onOpen={props.onOpenDropdown}
            onOuterAction={props.onClickOutsideDropdown}
        >
            <span>
                Layers
            </span>
        </Dropdown>
    )
}

export default LayerDropDown;
import React from "react";

import LayerDropdownComponent from '../components/layer-dropwdown/layer-dropdown.jsx'

function handleClickOutsideDropdown (e) {
    e.stopPropagation();
}

function handleOpenDropdown () {
    console.log('hello')
}

function handleChooseLayer (layer) {
    console.log(layer)
}

const PaintEditorLayersManager = (props) => {
    const layers = props.activeLayer.children.filter(item => !(
        (item.index === 0  && props.activeLayer.children.length > 2) 
        || item._guide
    ));

    return (
        <LayerDropdownComponent
            onClickOutsideDropdown={handleClickOutsideDropdown}
            onOpenDropdown={handleOpenDropdown}
            onChoose={handleChooseLayer}
            layers={layers}
        />
    )
}

export default PaintEditorLayersManager;
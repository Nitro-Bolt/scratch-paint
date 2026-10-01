import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import polygonIcon from './polygon.svg';

const PolygonModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.polygon}
        imgSrc={polygonIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
        keybinding="R"
    />
);

PolygonModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default PolygonModeComponent;

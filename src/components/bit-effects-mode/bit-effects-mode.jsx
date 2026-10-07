import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import effectsIcon from '../effects-mode/effects.svg';

const BitEffectsModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.effects}
        imgSrc={effectsIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
        keybinding="Z"
    />
);

BitEffectsModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitEffectsModeComponent;

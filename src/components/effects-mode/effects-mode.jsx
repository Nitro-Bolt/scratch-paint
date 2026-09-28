import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import effectsIcon from './effects.svg';

const EffectsModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.effects}
        imgSrc={effectsIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
        keybinding="Z"
    />
);

EffectsModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default EffectsModeComponent;

import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';

import ColorButton from './color-button/color-button.jsx';
import ColorPicker from '../containers/color-picker.jsx';
import InputGroup from './input-group/input-group.jsx';
import Label from './forms/label.jsx';

import GradientTypes from '../lib/gradient-types';

const ColorIndicatorComponent = props => (
    <InputGroup
        className={props.className}
        disabled={props.disabled}
    >
        <Popover
            body={
                <ColorPicker
                    color={props.color}
                    color2={props.color2}
                    gradientType={props.gradientType}
                    customGradient={props.customGradient}
                    shouldShowGradientTools={props.shouldShowGradientTools}
                    onChangeColor={props.onChangeColor}
                    onChangeGradientType={props.onChangeGradientType}
                    onChangeCustomGradient={props.onChangeCustomGradient}
                    onOpenCustomGradient={props.onOpenCustomGradient}
                    onSwap={props.onSwap}
                />
            }
            isOpen={props.colorModalVisible}
            preferPlace="below"
            onOuterAction={props.onCloseColor}
        >
            <Label text={props.label}>
                <ColorButton
                    color={props.color}
                    color2={props.color2}
                    gradientType={props.gradientType}
                    customGradient={props.customGradient}
                    onClick={props.onOpenColor}
                    outline={props.outline}
                />
            </Label>
        </Popover>
    </InputGroup>
);

ColorIndicatorComponent.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    color: PropTypes.string,
    color2: PropTypes.string,
    colorModalVisible: PropTypes.bool.isRequired,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    customGradient: PropTypes.object,
    label: PropTypes.string.isRequired,
    onChangeColor: PropTypes.func.isRequired,
    onChangeGradientType: PropTypes.func.isRequired,
    onChangeCustomGradient: PropTypes.func.isRequired,
    onOpenCustomGradient: PropTypes.func.isRequired,
    onCloseColor: PropTypes.func.isRequired,
    onOpenColor: PropTypes.func.isRequired,
    onSwap: PropTypes.func.isRequired,
    outline: PropTypes.bool.isRequired,
    shouldShowGradientTools: PropTypes.bool.isRequired
};

export default ColorIndicatorComponent;

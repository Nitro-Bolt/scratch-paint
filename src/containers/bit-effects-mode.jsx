import paper from '@nitro-bolt/paper';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';

import {clearFillGradient} from '../reducers/fill-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {setCursor} from '../reducers/cursor';

import {getSelectedLeafItems} from '../helper/selection';
import BitSelectTool from '../helper/bit-tools/select-tool';
import BitEffectsModeComponent from '../components/bit-effects-mode/bit-effects-mode.jsx';

class BitEffectsMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, ['activateTool', 'deactivateTool']);
    }
    componentDidMount () {
        if (this.props.isEffectsModeActive) this.activateTool();
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.selectedItems !== this.props.selectedItems) {
            this.tool.onSelectionChanged(nextProps.selectedItems);
        }
        if (nextProps.isEffectsModeActive && !this.props.isEffectsModeActive) {
            this.activateTool();
        } else if (!nextProps.isEffectsModeActive && this.props.isEffectsModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isEffectsModeActive !== this.props.isEffectsModeActive;
    }
    componentWillUnmount () {
        if (this.tool) this.deactivateTool();
    }
    activateTool () {
        this.props.clearGradient();
        this.tool = new BitSelectTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage,
            Modes.BIT_EFFECTS
        );
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <BitEffectsModeComponent
                isSelected={this.props.isEffectsModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

BitEffectsMode.propTypes = {
    clearGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isEffectsModeActive: PropTypes.bool.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setCursor: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isEffectsModeActive: state.scratchPaint.mode === Modes.BIT_EFFECTS,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    clearGradient: () => dispatch(clearFillGradient()),
    clearSelectedItems: () => dispatch(clearSelectedItems()),
    setCursor: cursorType => dispatch(setCursor(cursorType)),
    setSelectedItems: () => dispatch(setSelectedItems(getSelectedLeafItems())),
    handleMouseDown: () => dispatch(changeMode(Modes.BIT_EFFECTS))
});

export default connect(mapStateToProps, mapDispatchToProps)(BitEffectsMode);

import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash.omit';
import {connect} from 'react-redux';

import CopyPasteHOC from './copy-paste-hoc.jsx';

import {selectAllBitmap} from '../helper/bitmap';
import {clearSelection, deleteSelection, getSelectedLeafItems,
    selectAllItems, selectAllSegments, getSelectedRootItems} from '../helper/selection';
import {groupSelection, shouldShowGroup, ungroupSelection, shouldShowUngroup} from '../helper/group';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {changeMode} from '../reducers/modes';

import Formats, {isBitmap, isVector} from '../lib/format';
import Modes from '../lib/modes';

const VECTOR_KEYBINDINGS = {
    s: Modes.SELECT,
    a: Modes.RESHAPE,
    b: Modes.BRUSH,
    p: Modes.PEN,
    e: Modes.ERASER,
    f: Modes.FILL,
    t: Modes.TEXT,
    l: Modes.LINE,
    c: Modes.OVAL,
    z: Modes.EFFECTS,
    r: Modes.POLYGON
};

const BITMAP_KEYBINDINGS = {
    b: Modes.BIT_BRUSH,
    l: Modes.BIT_LINE,
    c: Modes.BIT_OVAL,
    r: Modes.BIT_RECT,
    t: Modes.BIT_TEXT,
    f: Modes.BIT_FILL,
    e: Modes.BIT_ERASER,
    s: Modes.BIT_SELECT,
    z: Modes.BIT_EFFECTS
};

const KeyboardShortcutsHOC = function (WrappedComponent) {
    const RegisterAllKeybinds = props => {
        const setMode = mode => {
            if (isVector(props.format)) {
                if (Object.prototype.hasOwnProperty.call(VECTOR_KEYBINDINGS, mode)) {
                    props.changeMode(VECTOR_KEYBINDINGS[mode]);
                }
            } else if (isBitmap(props.format)) {
                if (Object.prototype.hasOwnProperty.call(BITMAP_KEYBINDINGS, mode)) {
                    props.changeMode(BITMAP_KEYBINDINGS[mode]);
                }
            }
        }

        props.registerKeybind(props.preferences['keybind-paint-select'] ?? props.defaultKeybinds['paint-select'], () => setMode("s"));
        props.registerKeybind(props.preferences['keybind-paint-reshape'] ?? props.defaultKeybinds['paint-reshape'], () => setMode("a"));
        props.registerKeybind(props.preferences['keybind-paint-pen'] ?? props.defaultKeybinds['paint-pen'], () => setMode("p"));
        props.registerKeybind(props.preferences['keybind-paint-brush'] ?? props.defaultKeybinds['paint-brush'], () => setMode("b"));
        props.registerKeybind(props.preferences['keybind-paint-eraser'] ?? props.defaultKeybinds['paint-eraser'], () => setMode("e"));
        props.registerKeybind(props.preferences['keybind-paint-fill'] ?? props.defaultKeybinds['paint-fill'], () => setMode("f"));
        props.registerKeybind(props.preferences['keybind-paint-text'] ?? props.defaultKeybinds['paint-text'], () => setMode("t"));
        props.registerKeybind(props.preferences['keybind-paint-line'] ?? props.defaultKeybinds['paint-line'], () => setMode("l"));
        props.registerKeybind(props.preferences['keybind-paint-oval'] ?? props.defaultKeybinds['paint-oval'], () => setMode("c"));
        props.registerKeybind(props.preferences['keybind-paint-effect'] ?? props.defaultKeybinds['paint-effect'], () => setMode("z"));
        props.registerKeybind(props.preferences['keybind-paint-polygon'] ?? props.defaultKeybinds['paint-polygon'], () => setMode("r"));

        return props.children;
    };
    class KeyboardShortcutsWrapper extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleKeyPress',
                'selectAll'
            ]);
        }
        handleKeyPress (event) {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                // Ignore keyboard shortcuts if a text input field is focused
                return;
            }
            // Don't activate keyboard shortcuts during text editing
            if (this.props.textEditing) return;

            const lowercaseKey = event.key.toLowerCase();
            if (event.key === 'Escape') {
                event.preventDefault();
                clearSelection(this.props.clearSelectedItems);
            } else if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                if (deleteSelection(this.props.mode, this.props.onUpdateImage)) {
                    this.props.setSelectedItems(this.props.format);
                }
            }
            // else if (event.metaKey || event.ctrlKey) {
            //     if ((event.shiftKey && lowercaseKey === 'z') || lowercaseKey === 'y') {
            //         event.preventDefault();
            //         this.props.onRedo();
            //     } else if (lowercaseKey === 'z') {
            //         event.preventDefault();
            //         this.props.onUndo();
            //     } else if (event.shiftKey && lowercaseKey === 'g') {
            //         if (shouldShowUngroup()) {
            //             ungroupSelection(clearSelectedItems, setSelectedItems, this.props.onUpdateImage);
            //         }
            //         event.preventDefault();
            //     } else if (lowercaseKey === 'g') {
            //         if (shouldShowGroup()) {
            //             groupSelection(clearSelectedItems, setSelectedItems, this.props.onUpdateImage);
            //         }
            //         event.preventDefault();
            //     } else if (lowercaseKey === 'c') {
            //         this.props.onCopyToClipboard();
            //     } else if (lowercaseKey === 'v') {
            //         this.changeToASelectMode();
            //         this.props.onPasteFromClipboard();
            //     } else if (lowercaseKey === 'x') {
            //         const selectedItems = getSelectedRootItems();
            //         if (selectedItems.length > 0) {
            //             this.props.onCopyToClipboard();
            //             if (deleteSelection(this.props.mode, this.props.onUpdateImage)) {
            //                 this.props.setSelectedItems(this.props.format);
            //             }
            //         }
            //         event.preventDefault();
            //     } else if (lowercaseKey === 'a') {
            //         this.changeToASelectMode();
            //         event.preventDefault();
            //         this.selectAll();
            //     }
            // } else if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            //     if (isVector(this.props.format)) {
            //         if (Object.prototype.hasOwnProperty.call(VECTOR_KEYBINDINGS, lowercaseKey)) {
            //             this.props.changeMode(VECTOR_KEYBINDINGS[lowercaseKey]);
            //             event.preventDefault();
            //         }
            //     } else if (isBitmap(this.props.format)) {
            //         if (Object.prototype.hasOwnProperty.call(BITMAP_KEYBINDINGS, lowercaseKey)) {
            //             this.props.changeMode(BITMAP_KEYBINDINGS[lowercaseKey]);
            //             event.preventDefault();
            //         }
            //     }
            // }
        }
        selectAll () {
            if (isBitmap(this.props.format)) {
                selectAllBitmap(this.props.clearSelectedItems);
                this.props.setSelectedItems(this.props.format);
            } else if (this.props.mode === Modes.RESHAPE) {
                if (selectAllSegments()) this.props.setSelectedItems(this.props.format);
            } else if (selectAllItems()) {
                this.props.setSelectedItems(this.props.format);
            }
        }
        render () {
            const componentProps = omit(this.props, [
                'changeMode',
                'clearSelectedItems',
                'format',
                'mode',
                'onCopyToClipboard',
                'onPasteFromClipboard',
                'setSelectedItems',
                'textEditing']);
            return (
                <RegisterAllKeybinds
                    {...this.props}
                >
                    <WrappedComponent
                        onKeyPress={this.handleKeyPress}
                        {...componentProps}
                    />
                </RegisterAllKeybinds>
            );
        }
    }

    KeyboardShortcutsWrapper.propTypes = {
        changeMode: PropTypes.func.isRequired,
        clearSelectedItems: PropTypes.func.isRequired,
        format: PropTypes.oneOf(Object.keys(Formats)),
        mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
        onCopyToClipboard: PropTypes.func.isRequired,
        onPasteFromClipboard: PropTypes.func.isRequired,
        onRedo: PropTypes.func.isRequired,
        onUndo: PropTypes.func.isRequired,
        onUpdateImage: PropTypes.func.isRequired,
        setSelectedItems: PropTypes.func.isRequired,
        textEditing: PropTypes.bool.isRequired,
        defaultKeybinds: PropTypes.object.isRequired,
        preferences: PropTypes.object.isRequired,
        registerKeybind: PropTypes.func.isRequired
    };

    const mapStateToProps = state => ({
        mode: state.scratchPaint.mode,
        format: state.scratchPaint.format,
        textEditing: state.scratchPaint.textEditTarget !== null
    });

    const mapDispatchToProps = dispatch => ({
        changeMode: mode => {
            dispatch(changeMode(mode));
        },
        clearSelectedItems: () => {
            dispatch(clearSelectedItems());
        },
        setSelectedItems: format => {
            dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
        }
    });

    return CopyPasteHOC(connect(
        mapStateToProps,
        mapDispatchToProps
    )(KeyboardShortcutsWrapper));
};

export default KeyboardShortcutsHOC;

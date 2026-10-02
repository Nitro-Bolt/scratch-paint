import {getSelectedRootItems} from './selection';
import {MIXED_BLEND_MODE, isValidBlendMode} from '../lib/blend-modes';

const normalize = mode => (!mode || mode === 'source-over' ? 'normal' : mode);

/**
 * @return {string} the selection's blend mode, MIXED_BLEND_MODE if they differ, 'normal' if nothing selected
 */
const getBlendModeFromSelection = function () {
    const items = getSelectedRootItems();
    if (items.length === 0) return 'normal';
    const first = normalize(items[0].blendMode);
    for (const item of items) {
        if (normalize(item.blendMode) !== first) return MIXED_BLEND_MODE;
    }
    return first;
};

const applyBlendModeToSelection = function (mode) {
    if (!isValidBlendMode(mode)) return false;
    let changed = false;
    for (const item of getSelectedRootItems()) {
        if (normalize(item.blendMode) !== mode) {
            item.blendMode = mode;
            changed = true;
        }
    }
    return changed;
};

const writeBlendModeToSvgNode = function (item, node) {
    const mode = normalize(item.blendMode);
    if (mode !== 'normal' && isValidBlendMode(mode) && node && node.style) {
        node.style.setProperty('mix-blend-mode', mode);
    }
    return node;
};

const readBlendModeFromSvgNode = function (node, item) {
    if (!node || !node.style || !item) return item;
    const mode = (node.style.getPropertyValue('mix-blend-mode') || '').trim();
    if (isValidBlendMode(mode)) item.blendMode = mode;
    return item;
};

export {
    getBlendModeFromSelection,
    applyBlendModeToSelection,
    writeBlendModeToSvgNode,
    readBlendModeFromSvgNode
};

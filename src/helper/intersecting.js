import {getSelectedRootItems} from './selection';

const mask = function (onUpdateImage) {
    const [target, ...masks] = getSelectedRootItems();
    let result = target;

    for (let i = 0; i < masks.length; i++) {
        const maskItem = masks[i];
        const next = result.intersect(maskItem);
        maskItem.remove();
        if (i > 0) {
            result.remove();
        }
        result = next;
    }

    const lastMask = masks.at(-1);
    result.fillColor = lastMask.fillColor;
    result.strokeColor = lastMask.strokeColor;
    result.strokeWidth = lastMask.strokeWidth;

    onUpdateImage(result);
};

const subtract = function (onUpdateImage) {
    const [target, ...cutters] = getSelectedRootItems();
    let result = target;

    cutters.forEach(cutter => {
        const next = result.subtract(cutter);
        cutter.remove();
        result.remove();
        result = next;
    });
    target.remove();

    onUpdateImage(result);
};

const filter = function (onUpdateImage) {
    const [target, ...filters] = getSelectedRootItems();
    let result = target.clone();

    for (const filterItem of filters) {
        const next = result.intersect(filterItem);
        result.remove();
        result = next;
    }

    filters.forEach(filterItem => {
        filterItem.subtract(result);
        filterItem.remove();
        onUpdateImage(filterItem);
    });
    target.subtract(result);
    result.remove();
    target.remove();
    onUpdateImage(result);
};

const merge = function (onUpdateImage) {
    const [target, ...mergers] = getSelectedRootItems();
    let result = target;

    mergers.forEach(merger => {
        const next = result.unite(merger);
        merger.remove();
        result.remove();
        result = next;
    });

    const lastMerge = mergers.at(-1);
    result.fillColor = lastMerge.fillColor;
    result.strokeColor = lastMerge.strokeColor;
    result.strokeWidth = lastMerge.strokeWidth;

    onUpdateImage(result);
};

export {
    mask,
    subtract,
    filter,
    merge
};

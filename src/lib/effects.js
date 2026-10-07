import paper from '@nitro-bolt/paper';
import {hsbToRgb, rgbToHsb} from './tw-color-utils';

const colorToRGBA = color => {
    const rgb = color.components || color.rgb;
    return [
        Math.round(rgb[0] * 255),
        Math.round(rgb[1] * 255),
        Math.round(rgb[2] * 255),
        typeof color.alpha === 'undefined' ? 1 : color.alpha
    ];
};

export const applyToVector = (item, definition, values) => {
    if (!definition.process) return;

    if (item.fillColor) {
        const [r, g, b, a] = colorToRGBA(item.fillColor);
        const [nr, ng, nb, na] = definition.process(r, g, b, a, values);
        item.fillColor = new paper.Color(nr / 255, ng / 255, nb / 255, na);
    }
    if (item.strokeColor) {
        const [r, g, b, a] = colorToRGBA(item.strokeColor);
        const [nr, ng, nb, na] = definition.process(r, g, b, a, values);
        item.strokeColor = new paper.Color(nr / 255, ng / 255, nb / 255, na);
    }
};

export const applyToBitmap = (ctx, definition, values) => {
    if (!definition.process) return;

    const {width, height} = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const d = imageData.data;

    for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;

        const [nr, ng, nb, na] = definition.process(d[i], d[i + 1], d[i + 2], (d[i + 3] / 255), values);

        d[i] = nr;
        d[i + 1] = ng;
        d[i + 2] = nb;
        d[i + 3] = Math.round(na * 255);
    }
    ctx.putImageData(imageData, 0, 0);
};

const effectDefinitions = {
    hueShift: {
        id: 'hueShift',
        label: 'Hue Shift',
        params: [
            {id: 'angle', label: 'Angle', type: 'number', min: -360, max: 360, step: 1, default: 90}
        ],
        process: (r, g, b, a, values) => {
            const [h, s, v] = rgbToHsb(r, g, b);
            const [nr, ng, nb] = hsbToRgb(h + values.angle, s, v);
            return [nr, ng, nb, a];
        }
    },
    brightness: {
        id: 'brightness',
        label: 'Brightness',
        params: [
            {id: 'amount', label: 'Amount', type: 'number', min: -100, max: 100, step: 1, default: 20}
        ],
        process: (r, g, b, a, values) => {
            const [h, s, v] = rgbToHsb(r, g, b);
            const [nr, ng, nb] = hsbToRgb(h, s, v + (values.amount / 100));
            return [nr, ng, nb, a];
        }
    },
    saturate: {
        id: 'saturate',
        label: 'Saturate',
        params: [
            {id: 'amount', label: 'Amount', type: 'number', min: -100, max: 100, step: 1, default: 20}
        ],
        process: (r, g, b, a, values) => {
            const [h, s, v] = rgbToHsb(r, g, b);
            const [nr, ng, nb] = hsbToRgb(h, s + (values.amount / 100), v);
            return [nr, ng, nb, a];
        }
    },
    opacity: {
        id: 'opacity',
        label: 'Opacity',
        params: [
            {id: 'alpha', label: 'Alpha', type: 'number', min: 0, max: 100, step: 1, default: 50}
        ],
        process: (r, g, b, a, values) => [r, g, b, values.alpha / 100]
    },
    posterize: {
        id: 'posterize',
        label: 'Posterize',
        params: [
            {id: 'levels', label: 'Levels', type: 'number', min: 2, max: 20, step: 1, default: 4}
        ],
        process: (r, g, b, a, v) => {
            const step = 255 / (v.levels - 1);
            return [
                Math.round(Math.round(r / step) * step),
                Math.round(Math.round(g / step) * step),
                Math.round(Math.round(b / step) * step),
                a
            ];
        }
    }
};

export default effectDefinitions;

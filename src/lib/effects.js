import paper from '@nitro-bolt/paper';

const applyToColors = function (item, func, recursive = true) {
    const processColor = color => {
        if (!color) return null;
        if (color.type === 'gradient' || color.gradient) {
            color.gradient.stops.forEach(stop => {
                stop.color = func(stop.color);
            });
            return color;
        }
        return func(color);
    };

    if (item.fillColor) {
        item.fillColor = processColor(item.fillColor);
    }
    if (item.strokeColor) {
        item.strokeColor = processColor(item.strokeColor);
    }
    if (recursive === true && item.children) {
        item.children.forEach(c => applyToColors(c, func, true));
    }
};

const grayscale = function (item) {
    applyToColors(item, ({red, green, blue, alpha}) => {
        const gray = (0.299 * red) + (0.587 * green) + (0.114 * blue);
        return new paper.Color(gray, gray, gray, alpha);
    });
};

const hueShift = function (item, angle) {
    applyToColors(item, color => {
        let newHue = (color.hue + angle) % 360;
        if (newHue < 0) newHue += 360;

        return new paper.Color({
            hue: newHue,
            saturation: color.saturation,
            lightness: color.lightness,
            alpha: color.alpha
        });
    });
};

const brightness = function (item, amount) {
    applyToColors(item, color => {
        const newColor = color.clone();
        newColor.brightness += amount / 100;
        return newColor;
    });
};

const saturate = function (item, amount) {
    applyToColors(item, color => {
        const newColor = color.clone();
        newColor.saturation += amount / 100;
        return newColor;
    });
};

const opacity = function (item, alpha) {
    applyToColors(item, color => {
        const newColor = color.clone();
        newColor.alpha = alpha / 100;
        return newColor;
    });
};

const effectDefinitions = {
    grayscale: {
        id: 'grayscale',
        label: 'Grayscale',
        params: [],
        apply: item => grayscale(item)
    },
    hueShift: {
        id: 'hueShift',
        label: 'Hue Shift',
        params: [
            {id: 'angle', label: 'Angle (degrees)', type: 'number', min: -360, max: 360, step: 1, default: 90}
        ],
        apply: (item, values) => hueShift(item, values.angle)
    },
    brightness: {
        id: 'brightness',
        label: 'Brightness',
        params: [
            {id: 'amount', label: 'Amount', type: 'number', min: -1000, max: 1000, step: 1, default: 200}
        ],
        apply: (item, values) => brightness(item, values.amount)
    },
    saturate: {
        id: 'saturate',
        label: 'Saturate',
        params: [
            {id: 'amount', label: 'Amount', type: 'number', min: -1000, max: 1000, step: 1, default: 200}
        ],
        apply: (item, values) => saturate(item, values.amount)
    },
    opacity: {
        id: 'opacity',
        label: 'Opacity',
        params: [
            {id: 'alpha', label: 'Alpha', type: 'number', min: 0, max: 100, step: 1, default: 50}
        ],
        apply: (item, values) => opacity(item, values.alpha)
    }
};

export default effectDefinitions;

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

export {
    grayscale,
    hueShift
};

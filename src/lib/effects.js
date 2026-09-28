import paper from '@nitro-bolt/paper';

const grayscale = function (item, recursive = true) {
    if (item.fillColor) {
        const c = item.fillColor;
        const gray = (0.299 * c.red) + (0.587 * c.green) + (0.114 * c.blue);
        item.fillColor = new paper.Color(gray, gray, gray, c.alpha);
    }
    if (item.strokeColor) {
        const c = item.strokeColor;
        const gray = (0.299 * c.red) + (0.587 * c.green) + (0.114 * c.blue);
        item.strokeColor = new paper.Color(gray, gray, gray, c.alpha);
    }
    if (recursive && item.children) {
        item.children.forEach(grayscale);
    }
};

export {
    grayscale
};

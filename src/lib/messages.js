import {defineMessages} from 'react-intl';

const messages = defineMessages({
    brush: {
        defaultMessage: 'Brush',
        description: 'Label for the brush tool',
        id: 'paint.brushMode.brush'
    },
    eraser: {
        defaultMessage: 'Eraser',
        description: 'Label for the eraser tool',
        id: 'paint.eraserMode.eraser'
    },
    fill: {
        defaultMessage: 'Fill',
        description: 'Label for the fill tool',
        id: 'paint.fillMode.fill'
    },
    line: {
        defaultMessage: 'Line',
        description: 'Label for the line tool',
        id: 'paint.lineMode.line'
    },
    oval: {
        defaultMessage: 'Circle',
        description: 'Label for the oval-drawing tool',
        id: 'paint.ovalMode.oval'
    },
    rect: {
        defaultMessage: 'Rectangle',
        description: 'Label for the rectangle tool',
        id: 'paint.rectMode.rect'
    },
    polygon: {
        defaultMessage: 'Polygon',
        description: 'Label for the polygon tool',
        id: 'paint.polygonMode.polygon'
    },
    reshape: {
        defaultMessage: 'Reshape',
        description: 'Label for the reshape tool, which allows changing the points in the lines of the vectors',
        id: 'paint.reshapeMode.reshape'
    },
    select: {
        defaultMessage: 'Select',
        description: 'Label for the select tool, which allows selecting, moving, and resizing shapes',
        id: 'paint.selectMode.select'
    },
    text: {
        defaultMessage: 'Text',
        description: 'Label for the text tool',
        id: 'paint.textMode.text'
    },
    effects: {
        defaultMessage: 'Effects',
        description: 'Label for the effects tool',
        id: 'paint.fillMode.effects'
    }
});

export default messages;

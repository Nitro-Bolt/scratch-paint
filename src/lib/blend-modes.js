const BLEND_MODES = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn',
    'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
];

const MIXED_BLEND_MODE = 'scratch-paint/blend-mode/mixed';

const isValidBlendMode = mode => BLEND_MODES.includes(mode);
const getBlendModeName = mode => mode
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export {BLEND_MODES, MIXED_BLEND_MODE, isValidBlendMode, getBlendModeName};

import log from '../log/log';

const CHANGE_POLYGON_RADIUS = 'scratch-paint/polygon-mode/CHANGE_POLYGON_RADIUS';
const CHANGE_POLYGON_SIDES = 'scratch-paint/polygon-mode/CHANGE_POLYGON_SIDES';
const MIN_POLYGON_SIDES = 3;
const MAX_POLYGON_SIDES = 100;
const initialState = {polygonRadius: 0, polygonSides: 4};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_POLYGON_RADIUS:
        if (isNaN(action.polygonRadius)) {
            log.warn(`Invalid corner radius: ${action.polygonRadius}`);
            return state;
        }
        return Object.assign({}, state, {polygonRadius: Math.max(0, action.polygonRadius)});
    case CHANGE_POLYGON_SIDES: {
        const polygonSides = Math.round(Number(action.polygonSides));
        if (!Number.isFinite(polygonSides)) {
            log.warn(`Invalid polygon side count: ${action.polygonSides}`);
            return state;
        }
        return Object.assign({}, state, {
            polygonSides: Math.max(MIN_POLYGON_SIDES, Math.min(MAX_POLYGON_SIDES, polygonSides))
        });
    }
    default:
        return state;
    }
};

const changePolygonRadius = function (polygonRadius) {
    return {
        type: CHANGE_POLYGON_RADIUS,
        polygonRadius: polygonRadius
    };
};

const changePolygonSides = function (polygonSides) {
    return {
        type: CHANGE_POLYGON_SIDES,
        polygonSides: polygonSides
    };
};

export {
    reducer as default,
    changePolygonRadius,
    changePolygonSides,
    MIN_POLYGON_SIDES,
    MAX_POLYGON_SIDES
};

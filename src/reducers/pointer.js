const PRESSURE_CHANGED = 'scratch-paint/pointer/PRESSURE_CHANGED';
const POINTER_TYPE_CHANGED = 'scratch-paint/pointer/POINTER_TYPE_CHANGED';

const initialState = {
    pressure: 0,
    pointerType: 'mouse'
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case PRESSURE_CHANGED:
        return Object.assign(
            {},
            state,
            {
                pressure: action.pressure
            }
        );
    case POINTER_TYPE_CHANGED:
        return Object.assign(
            {},
            state,
            {
                pointerType: action.pointerType
            }
        );
    default:
        return state;
    }
};

const changePointerPressure = function (pressure) {
    return {
        type: PRESSURE_CHANGED,
        pressure: pressure
    };
};

const changePointerType = function (pointerType) {
    return {
        type: POINTER_TYPE_CHANGED,
        pointerType: pointerType
    };
};

export {
    reducer as default,

    changePointerPressure,
    changePointerType,

    PRESSURE_CHANGED,
    POINTER_TYPE_CHANGED
};

const PRESSURE_CHANGED = 'scratch-paint/pointer/PRESSURE_CHANGED';

const initialState = {
    pressure: 0,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case PRESSURE_CHANGED:
        return Object.assign(
            {},
            state,
            {
                pressure: action.pressure,
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

export {
    reducer as default,

    changePointerPressure,

    PRESSURE_CHANGED,
};

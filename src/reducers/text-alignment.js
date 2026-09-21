const CHANGE_TEXT_ALIGNMENT = 'scratch-paint/text-alignment/CHANGE_TEXT_ALIGNMENT';

const initialState = 'left';

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_TEXT_ALIGNMENT:
        return action.alignment;
    default:
        return state;
    }
};

const changeTextAlignment = alignment => ({
    type: CHANGE_TEXT_ALIGNMENT,
    alignment
});

export {
    reducer as default,
    changeTextAlignment
};

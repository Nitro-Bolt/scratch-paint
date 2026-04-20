const ADD_RECENT_COLORS = 'scratch-paint/recent-colors/ADD_RECENT_COLORS';
const MAX_RECENT_COLORS = 5;

const reducer = (state = ['#9966ff', '#668fff', '#66ebff', '#66ffb7', '#70ff66'], action) => {
    switch (action.type) {
    case ADD_RECENT_COLORS: {
        const colorsToAdd = action.colors.filter(c => typeof c === 'string' && c.length > 0);
        if (colorsToAdd.length === 0) return state;
        const uniqueColorsToAdd = [...new Set(colorsToAdd)];
        let newState = state;
        for (const color of uniqueColorsToAdd) {
            newState = newState.filter(c => c !== color);
            newState = [color, ...newState];
        }
        return newState.slice(0, MAX_RECENT_COLORS);
    }
    default:
        return state;
    }
};

const addRecentColors = colors => ({type: ADD_RECENT_COLORS, colors});

export {
    reducer as default,
    addRecentColors,
    ADD_RECENT_COLORS
};

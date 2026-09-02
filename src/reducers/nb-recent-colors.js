import GradientTypes from "../lib/gradient-types";

const ADD_RECENT_COLOR = "scratch-paint/recent-colors/ADD_RECENT_COLOR";
const MAX_RECENT_COLORS = 5;

const reducer = (
    state = [
        {
            primary: "#9966ff",
            secondary: null,
            gradientType: GradientTypes.SOLID,
        },
        {
            primary: "#668fff",
            secondary: null,
            gradientType: GradientTypes.SOLID,
        },
        {
            primary: "#66ebff",
            secondary: null,
            gradientType: GradientTypes.SOLID,
        },
        {
            primary: "#66ffb7",
            secondary: null,
            gradientType: GradientTypes.SOLID,
        },
        {
            primary: "#70ff66",
            secondary: null,
            gradientType: GradientTypes.SOLID,
        },
    ],
    action,
) => {
    switch (action.type) {
        case ADD_RECENT_COLOR: {
            if (!action.primary || typeof action.primary !== "string")
                return state;
            const entry = {
                primary: action.primary,
                secondary: action.secondary || null,
                gradientType: action.gradientType || GradientTypes.SOLID,
            };
            const isDuplicate = (c) =>
                c.primary === entry.primary &&
                c.gradientType === entry.gradientType;
            const noodles = state.filter((c) => !isDuplicate(c));
            return [entry, ...noodles].slice(0, MAX_RECENT_COLORS);
        }
        default:
            return state;
    }
};

const addRecentColor = (primary, secondary, gradientType) => ({
    type: ADD_RECENT_COLOR,
    primary,
    secondary,
    gradientType,
});

export { reducer as default, addRecentColor, ADD_RECENT_COLOR };

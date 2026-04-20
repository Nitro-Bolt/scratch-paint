import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import RecentColorsComponent from '../components/nb-recent-colors/nb-recent-colors.jsx';
import {changeFillColor} from '../reducers/fill-style';
import {changeStrokeColor} from '../reducers/stroke-style';

const mapStateToProps = state => ({
    recentColors: state.scratchPaint.color.recentColors,
    colorIndex: state.scratchPaint.fillMode.colorIndex
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSelectColor: (color, selectedColorIndex) => {
        const colorIndex = typeof selectedColorIndex !== 'undefined' ? 
            selectedColorIndex : ownProps.colorIndex;
            
        if (colorIndex === 0) {
            dispatch(changeFillColor(color));
        } else if (colorIndex === 1) {
            dispatch(changeStrokeColor(color));
        }

        if (ownProps.onUpdateImage) {
            ownProps.onUpdateImage();
        }
    }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    recentColors: stateProps.recentColors,
    colorIndex: ownProps.colorIndex ?? stateProps.colorIndex,
    onSelectColor: dispatchProps.onSelectColor
});

const RecentColorsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(RecentColorsComponent);

RecentColorsContainer.propTypes = {
    onUpdateImage: PropTypes.func.isRequired,
    colorIndex: PropTypes.number 
};

export default RecentColorsContainer;
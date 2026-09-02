import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import RecentColorsComponent from '../components/nb-recent-colors/nb-recent-colors.jsx';
import {changeFillColor, changeFillColor2, changeFillGradientType} from '../reducers/fill-style';
import {changeStrokeColor, changeStrokeColor2, changeStrokeGradientType} from '../reducers/stroke-style';
import GradientTypes from '../lib/gradient-types';

const mapStateToProps = state => ({
    recentColors: state.scratchPaint.color.recentColors,
    isFill: state.scratchPaint.modals.fillColor
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSelectColor: (entry, isFill) => {
        if (isFill) {
            dispatch(changeFillColor(entry.primary));
            dispatch(changeFillColor2(entry.secondary));
            dispatch(changeFillGradientType(entry.gradientType || GradientTypes.SOLID));
        } else {
            dispatch(changeStrokeColor(entry.primary));
            dispatch(changeStrokeColor2(entry.secondary));
            dispatch(changeStrokeGradientType(entry.gradientType || GradientTypes.SOLID));
        }
        if (ownProps.onUpdateImage) {
            ownProps.onUpdateImage();
        }
    }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    recentColors: stateProps.recentColors,
    onSelectColor: entry => dispatchProps.onSelectColor(entry, stateProps.isFill)
});

const RecentColorsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(RecentColorsComponent);

RecentColorsContainer.propTypes = {
    onUpdateImage: PropTypes.func.isRequired
};

export default RecentColorsContainer;

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import TWRenderRecoloredImage from '../../tw-recolor/render.jsx';

import styles from './labeled-icon.css';

const LabeledIcon = ({
    hideLabel,
    imgAlt,
    imgSrc,
    onClick,
    title,
    gray,
    ...props
}) => (
    <div className={styles.center} {...props}>
        <TWRenderRecoloredImage
            alt={imgAlt || title}
            className={classNames(styles.editFieldIcon, {[styles.gray]: gray})}
            draggable={false}
            src={imgSrc}
            title={title}
        />
        {!hideLabel && <span className={styles.editFieldTitle}>{title}</span>}
    </div>
);

LabeledIcon.propTypes = {
    className: PropTypes.string,
    hideLabel: PropTypes.bool,
    highlighted: PropTypes.bool,
    imgAlt: PropTypes.string,
    imgSrc: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    title: PropTypes.string.isRequired,
    gray: PropTypes.bool
};

export default LabeledIcon;

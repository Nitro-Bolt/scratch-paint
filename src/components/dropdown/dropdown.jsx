import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import Popover from 'react-popover';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '../button/button.jsx';

import styles from './dropdown.css';

import dropdownIcon from './dropdown-caret.svg';

class Dropdown extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'closePopover',
            'toggleOpenState'
        ]);
        this.state = {
            isOpen: false
        };
    }
    closePopover () {
        this.setState({
            isOpen: false
        });
    }
    toggleOpenState () {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render () {
        return (
            <Popover
                body={this.props.popoverContent}
                isOpen={this.state.isOpen}
                preferPlace="below"
                onOuterAction={this.closePopover}
                {...this.props}
            >
                <div
                    className={classNames(styles.dropdown, this.props.className, {
                        [styles.modOpen]: this.state.isOpen,
                        [styles.modClosed]: !this.state.isOpen
                    })}
                    onClick={this.toggleOpenState}
                >
                    {this.props.children}
                    <img
                        className={classNames(styles.dropdownIcon, {
                            [styles.modCaretUp]: this.state.isOpen
                        })}
                        src={dropdownIcon}
                    />
                </div>
            </Popover>
        );
    }
}

Dropdown.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    popoverContent: PropTypes.node.isRequired
};

export default Dropdown;

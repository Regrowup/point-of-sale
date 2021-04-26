import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PinButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  state = { pressed: false };

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  buttonPress = (event) => {
    this.setState({ pressed: true });

    this.timeoutId = setTimeout(() => {
      this.setState({ pressed: false });
    }, 500);
    this.props.onClick(event);
  }

  render() {
    const { disabled, children } = this.props;

    return  (
      <div
        className={`PinButton ${this.state.pressed ? 'animate' : ''}`}
        onClick={this.buttonPress}
        disabled={disabled}
      >
        {children}
      </div>
    );
  }
}

export default PinButton;

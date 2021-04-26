import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/Button';

class PinDisplay extends Component {
  static propTypes = {
    pin: PropTypes.number.isRequired,
  };

  state = {
    showPin: false,
  };

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  }

  showPin = () => {
    this.setState(({ showPin }) => ({ showPin: !showPin }));
    window.clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.setState({ showPin: false });
    }, 4000);
  };

  render() {
    const { pin, ...otherProps } = this.props;

    return (
      <Button
        raised
        onClick={this.showPin}
        icon="remove_red_eye"
        {...otherProps}
      >
        <div style={{ marginLeft: 'auto' }}>
          {this.state.showPin ? this.props.pin : '***'}
        </div>
      </Button>
    );
  }
}

export default PinDisplay;

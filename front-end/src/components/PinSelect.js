import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PinModal from '@/components/Tables/PinModal';
import Modal from '@/components/Modal';
import { connect } from 'react-redux';
import { PIN_LENGTH } from '@/config/constants';
import { find } from 'lodash';

class PinSelect extends Component {
  static propTypes = {
    servers: PropTypes.arrayOf(PropTypes.object).isRequired,
    closeModal: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    pinAction: PropTypes.func,
  };

  static defaultProps = {
    pinAction: null,
  };

  state = {
    pin: '',
    pinReset: false,
    pinStatus: 'Please enter your pin',
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.pin !== this.state.pin &&
      this.state.pin.length === PIN_LENGTH && !this.state.pinReset
    ) {
      this.handlePinAction();
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  handlePinAction = () => {
    const server = find(this.props.servers, { pin: this.state.pin });

    if (!server || server.is_disabled) {
      this.resetPin('Incorrect pin, please try again.');
      return;
    }

    this.props.pinAction({
      server,
      closeModal: this.closeModal,
      resetPin: this.resetPin.bind(this),
    });
  };

  closeModal = () => {
    this.setState({
      pin: '',
      pinStatus: 'Please enter your pin',
    });

    this.props.closeModal();
  }

  resetPin(message) {
    this.setState({ pinReset: true, pinStatus: message });
    this.timeout = window.setTimeout(() => {
      this.setState({ pin: '', pinReset: false });
    }, 500);
  }

  render() {
    return (
      <Modal
        onCancel={this.closeModal}
        open={this.props.open}
        title={this.state.pinStatus}
      >
        <PinModal
          invalidPin={this.state.pinReset}
          pin={this.state.pin}
          pinLength={PIN_LENGTH}
          pinUpdate={pin => this.setState({ pin })}
          pinClear={() => this.setState({ pin: '' })}
        />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  servers: state.servers,
});

export default connect(mapStateToProps)(PinSelect);

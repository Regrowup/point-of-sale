import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { addOrder, closeModal } from '@/store/actions';
import Textfield from './Textfield';
import Modal from './ModalPortal';
import Button from './Button';

const Container = styled(({ content, ...otherProps }) => <section {...otherProps} />)`
  .money-input {
    display: flex;
    align-items: baseline;

    > .icon {
      margin-right: 5px;
      font-size: 15px;
      font-weight: bold;
    }
  }
`;

class CustomItem extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    custom_id: PropTypes.number.isRequired,
    addOrder: PropTypes.func.isRequired,
  };

  state = {
    customName: '',
    customPrice: 0,
  };

  render() {
    return (
      <Modal title="Add Custom Item">
        <Container content>
          <Textfield
            id="name"
            label="Name"
            required
            maxLength={100}
            onChange={({ currentTarget }) => this.setState({ customName: currentTarget.value })}
          />
          <div className="money-input">
            <div className="icon">$</div>
            <Textfield
              id="price"
              label="Price"
              required
              maxLength={8}
              onChange={({ currentTarget }) => this.setState({ customPrice: currentTarget.value })}
            />
          </div>
        </Container>

        <Button cancelButton color="red" onClick={() => this.props.closeModal()}>CANCEL</Button>
        <Button
          okButton
          color="strongBlue"
          onClick={() => {
            this.props.addOrder({
              id: this.props.custom_id,
              price: (parseFloat(this.state.customPrice) || 0) * 100,
              name: this.state.customName || 'Custom Order',
            });
            this.props.closeModal();
          }}
        >
          OK
        </Button>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  custom_id: state.custom_id,
});

const mapDispatchToProps = {
  addOrder,
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomItem);

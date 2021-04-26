import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addOrder, closeModal } from '@/store/actions';
import Modal from './ModalPortal';
import Button from './Button';
import Textfield from './Textfield';

const Container = ({ content, ...otherProps }) => <section {...otherProps} />;

class KitchenMod extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    addOrder: PropTypes.func.isRequired,
    mod_id: PropTypes.number.isRequired,
  };

  state = {
    kitchenMod: '',
  };

  addKitchenMod = () => {
    this.props.addOrder({ id: this.props.mod_id }, {
      price: 0,
      name: this.state.kitchenMod,
    });
    this.props.closeModal();
  };

  render() {
    return (
      <Modal title="Add Kitchen Note">
        <Container content>
          <Textfield
            required
            maxLength={100}
            id="note"
            label="Note"
            onChange={({ currentTarget }) => this.setState({ kitchenMod: currentTarget.value })}
          />
        </Container>

        <Button cancelButton color="red" onClick={this.props.closeModal}>CANCEL</Button>
        <Button
          okButton
          color="strongBlue"
          onClick={this.addKitchenMod}
          disabled={this.state.kitchenMod.trim().length === 0}
        >
         OK
        </Button>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  mod_id: state.mod_id,
});

const mapDispatchToProps = { addOrder, closeModal };

export default connect(mapStateToProps, mapDispatchToProps)(KitchenMod);

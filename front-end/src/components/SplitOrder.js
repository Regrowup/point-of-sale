import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import SeatSelector from './SeatSelector';
import { removeSeat, setSelectedSeatIndex,  replaceItems, addOrder, updateItem, closeModal } from '../store/actions';
import Modal from './ModalPortal';
import Button from './Button';

const Container = styled(({ content, ...otherProps }) => <section {...otherProps} />)`
  .note {
    font-size: 11px;
    color: #909090;
    line-height: 15px;
    width: 350px;
  }
`;

class SplitOrder extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    selectedTableSeats: PropTypes.array.isRequired,
    selectedSeatNumber: PropTypes.number.isRequired,
    selectedSeatIndex: PropTypes.number.isRequired,
    addOrder: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    selectedOrder: PropTypes.object.isRequired,
  };

  state = {
    combineSeatIndexes: [],
  };

  splitOrder = () => {
    const numSeatsSelected = this.state.combineSeatIndexes.length;
    const splitPrice = this.props.selectedOrder.price / numSeatsSelected;

    this.props.updateItem({
      price: Math.ceil(splitPrice),
      splitNum: numSeatsSelected,
    });

    this.state.combineSeatIndexes
      .filter(index => index !== this.props.selectedSeatIndex)
      .forEach(seatIndex => this.props.addOrder(
        this.props.selectedOrder.item,
        {
          ...this.props.selectedOrder,
          price:  Math.floor(splitPrice),
          splitNum: numSeatsSelected,
          id: null,
        }, seatIndex));

    this.props.closeModal();
  };

  render() {
    return (
      <Modal title="Split Order">
        <Container content>
          <SeatSelector
            lockSelected
            seats={this.props.selectedTableSeats}
            onChange={combineSeatIndexes => this.setState({ combineSeatIndexes })}
          />

          <div className="note">
            Select the seats you would like to split the order across. The order
            is currently on seat {this.props.selectedSeatNumber}.
          </div>
        </Container>

        <Button cancelButton color="red" onClick={this.props.closeModal}>CANCEL</Button>
        <Button
          okButton
          color="strongBlue"
          onClick={this.splitOrder}
          disabled={this.state.combineSeatIndexes.length < 2}
        >
         OK
        </Button>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  selectedTableSeats: state.selectedTable.seats,
  selectedSeatNumber: state.selectedTable.seats[state.selectedSeatIndex].number,
  selectedSeatIndex: state.selectedSeatIndex,
  selectedOrder: state.selectedTable.seats[state.selectedSeatIndex].orders[state.selectedOrderIndex],
});

const mapDispatchToProps = {
  setSelectedSeatIndex,
  replaceItems,
  removeSeat,
  addOrder,
  updateItem,
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(SplitOrder);

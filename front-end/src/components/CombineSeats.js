import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import SeatSelector from './SeatSelector';
import { removeSeat, setSelectedSeatIndex,  replaceItems, closeModal } from '@/store/actions';
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

class CombineSeats extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    setSelectedSeatIndex: PropTypes.func.isRequired,
    replaceItems: PropTypes.func.isRequired,
    removeSeat: PropTypes.func.isRequired,
    selectedTableSeats: PropTypes.array.isRequired,
  };

  state = {
    combineSeatIndexes: [],
  };

  combineSeats = () => {
    const [firstSeatIndex, ...seatIndexesToRemove] = this.state.combineSeatIndexes;
    this.props.setSelectedSeatIndex(firstSeatIndex);

    const ordersToAdd = this.state.combineSeatIndexes.reduce((orders, seatIndex) => (
      orders.concat(this.props.selectedTableSeats[seatIndex].orders)
    ), []);

    this.props.replaceItems(ordersToAdd, firstSeatIndex);

    /* Sort descending so items are removed from back of array to avoid bugs. */
    seatIndexesToRemove.sort((a, b) => b - a).forEach(seatIndex => this.props.removeSeat(seatIndex));

    this.props.closeModal();
  };

  render() {
    return (
      <Modal title="Combine Seats">
        <Container content>
          <SeatSelector
            seats={this.props.selectedTableSeats}
            onChange={combineSeatIndexes => this.setState({ combineSeatIndexes })}
          />

          <div className="note">
            Select the seats you would like to combine and press OK.
          </div>
        </Container>

        <Button cancelButton color="red" onClick={this.props.closeModal}>CANCEL</Button>
        <Button
          okButton
          color="strongBlue"
          onClick={this.combineSeats}
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
  selectedTable: state.selectedTable,
});

const mapDispatchToProps = {
  setSelectedSeatIndex,
  replaceItems,
  removeSeat,
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(CombineSeats);

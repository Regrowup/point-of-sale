import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import SelectList from './SelectList';
import { addPayment, editPayment, getTable, removeSeat, closeModal, openModal } from '@/store/actions';
import { SeatPayments } from '@/components/modals';
import Textfield from './Textfield';
import { getSeatTotals, formatMoney } from '@/config/utils';
import Modal from './ModalPortal';
import Button from './Button';

const Container = styled(({ content, ...otherProps }) => <section {...otherProps} />)`
  .total {
    margin-top: 1rem;
    margin-bottom: 5px;

    > span { font-weight: bold; }
  }

  .note {
    font-size: 11px;
    color: #909090;
    line-height: 15px;
    width: 350px;
  }

  .money-inputs {
    display: flex;
  }

  .money-input {
    display: flex;
    align-items: baseline;

    &.disabled {
      opacity: 0.5;
    }

    &:last-child {
      margin-left: 1rem;
    }

    > .icon {
      margin-right: 5px;
      font-size: 15px;
      font-weight: bold;
    }
  }
`;

class PayTable extends Component {
  static propTypes = {
    paymentTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    addPayment: PropTypes.func.isRequired,
    editPayment: PropTypes.func.isRequired,
    selectedSeat: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    modalProps: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  isEditing = !!this.props.modalProps.payment;
  total = getSeatTotals(this.props.selectedSeat)['Balance'];

  constructor(props) {
    super(props);

    if (this.isEditing) {
      const { amount, tip, payment_type_id } = this.props.modalProps.payment;
      const paymentType = this.props.paymentTypes.find(({ id }) => id === payment_type_id);

      this.state = {
        paid: '000' + amount,
        tip: '000' + tip,
        paymentType,
      };
    } else {
      this.state = {
        paid: '000' + this.total,
        tip: '000',
        paymentType: this.props.paymentTypes[0],
      };
    }

    this.setPaid = this.setMoney.bind(this, 'paid');
    this.setTip = this.setMoney.bind(this, 'tip');
  }

  payTable = () => {
    const payment = {
      payment_type_id: this.state.paymentType.id,
      amount: Number(this.state.paid) || 0,
      tip: Number(this.state.tip) || 0,
    };

    if (this.isEditing) {
      this.props.editPayment(payment, this.props.modalProps.index);
    } else {
      this.props.addPayment(payment);
    }

    this.closeModal();
  };

  closeModal = () => {
    if (this.isEditing) {
      this.props.openModal(SeatPayments);
    } else {
      this.props.closeModal();
    }
  }

  setPaymentType = paymentType => {
    this.setState(state => ({
      paymentType,
      tip: paymentType.name === 'Cash'
        ? '000'
        : state.tip,
    }));
  }

  setPaymentOverflowAsTip = () => {
    const billBalance = this.getBillBalance();
    const tip = billBalance < 0
      ? -billBalance
      : 0;

    if (tip > 0) {
      this.setState(state => {
        /* When editing, update table balance ("total") to reflect new balance; and ensure you cannot go over this. */
        // const newState = { paid: '000' + this.total };
        const newState = { paid: '000' + (Number(this.state.paid) - tip) };

        if (!this.isEditing) {
          newState.tip = state.paymentType.name === 'Cash'
            ? '000'
            : '000' + tip;
        }

        return newState;
      });
    }
  }

  getBillBalance = () => {
    let billBalance = this.total - Number(this.state.paid);

    if (this.isEditing) {
      billBalance += this.props.modalProps.payment.amount;
    }

    return billBalance;
  }

  setMoney(type, { key }) {
    if (key === 'Backspace') {
      if (this.state[type].length > 3) {
        this.setState(state => ({
          [type]: state[type].substring(0, state[type].length - 1),
        }));
      }

      return;
    }

    if (!'0123456789'.includes(key)) {
      return;
    }

    if (this.state[type].length < 12) {
      this.setState(state => ({ [type]: state[type].concat(key) }));
    }
  }

  render() {
    const cashSelected = this.state.paymentType.name === 'Cash';

    return (
      <Modal title={this.isEditing ? 'Edit Payment' : 'Seat Payout'}>
        <Container content>
          <SelectList
            initialValue={this.state.paymentType}
            values={[
              this.props.paymentTypes[0],
              this.props.paymentTypes[3],
              this.props.paymentTypes[2],
              this.props.paymentTypes[1],
              this.props.paymentTypes[4],
            ]}
            onChange={this.setPaymentType}
          />

          <div className="total">
            <span>Bill Balance:</span> ${formatMoney(Math.max(0, this.getBillBalance()))}
          </div>
          <div className="note">
            {cashSelected
              ? 'Please ensure you recieved at least the above amount, in cash.'
              : 'Please enter the total amount paid, including tip.'
            }
          </div>

          <div className="money-inputs">
            <div className="money-input">
              <div className="icon">$</div>
              <Textfield
                label="Payment"
                required
                value={formatMoney(Number(this.state.paid))}
                onChange={noop}
                onKeyDown={this.setPaid}
                onBlur={this.setPaymentOverflowAsTip}
              />
            </div>

            <div className={`money-input ${cashSelected ? 'disabled' : ''}`}>
              <div className="icon">$</div>
              <Textfield
                label="Tip"
                required
                value={formatMoney(Number(this.state.tip))}
                onChange={noop}
                onKeyDown={this.setTip}
                disabled={cashSelected}
              />
            </div>
          </div>
        </Container>

        <Button
          cancelButton
          color="red"
          onClick={this.closeModal}
        >
          CANCEL
        </Button>

        <Button
          okButton
          color="strongBlue"
          onClick={this.payTable}
        >
          {this.isEditing ? 'UPDATE' : 'ADD'}
        </Button>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  paymentTypes: state.paymentTypes,
  selectedSeatIndex: state.selectedSeatIndex,
  selectedSeat: state.selectedTable.seats[state.selectedSeatIndex],
  modalProps: state.modalProps,
});

const mapDispatchToProps = {
  getTable,
  removeSeat,
  addPayment,
  editPayment,
  closeModal,
  openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(PayTable);

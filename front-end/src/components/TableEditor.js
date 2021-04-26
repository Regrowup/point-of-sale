import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import DropdownMenu from 'react-dd-menu';
import SortableOrders from './SortableOrders';
import './TableEditor.scss';
import {
  COMBINED, ALL_SEATS,
  getTable,
  setSelectedServer,
  printReceipt,
  orderFood,
  closeTable,
  addSeat,
  removeSeat,
  addOrder,
  setSelectedSeatIndex,
  replaceItems,
  openModal
} from '@/store/actions';
import NavBar from './NavBar';
import Button, { altColors } from './Button';
import PayTable from './PayTable';
import PayWarning from './PayWarning';
import CustomItem from './CustomItem';
import CombineSeats from './CombineSeats';
import KitchenMod from './KitchenMod';
import SplitOrder from './SplitOrder';
import CancelWarning from './CancelWarning';
import LockedSeatWarning from './LockedSeatWarning';
import CloseTableWarning from './CloseTableWarning';
import CloseTableBalanceWarning from './CloseTableBalanceWarning';
import Menu from './Menu';
import { formatMoney, getSeatTotals } from '@/config/utils';
import SeatPayments from '@/components/modals/SeatPayments';

function balancePaid(seat) {
  return getSeatTotals(seat)['Balance'] <= 0;
}

const NavDivider = styled.div`
  margin: 0 10px;
  border: 1px solid #e6e6e6;
  height: 20px;
  border-radius: 3px;
`;

const PrintDropdown = styled(DropdownMenu).attrs({ align: 'left' })`
  max-width: 78px;
  .print-button { min-width: 0; }
  .dropdown-button {
    width: 100%;
    justify-content: flex-start;
  }
  .dropdown-arrow {
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: -10px;
  }
`;

class TableEditor extends Component {
  static propTypes = {
    loading: PropTypes.number.isRequired,
    selectedServer: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
    selectedLocation: PropTypes.shape({
      number: PropTypes.number.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tableId: PropTypes.string,
      }),
    }).isRequired,
    selectedTable: PropTypes.shape({
      id: PropTypes.number,
      seats: PropTypes.array.isRequired,
      server: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
    }),
    removeSeat: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    setSelectedServer: PropTypes.func.isRequired,
    printReceipt: PropTypes.func.isRequired,
    orderFood: PropTypes.func.isRequired,
    closeTable: PropTypes.func.isRequired,
    addSeat: PropTypes.func.isRequired,
    selectedSeat: PropTypes.object.isRequired,
    setSelectedSeatIndex: PropTypes.func.isRequired,
    replaceItems: PropTypes.func.isRequired,
    multipleSeatOrders: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedTable: null,
  };

  state = {
    printDropdown: false,
  };

  cancel = () => {
    if (this.props.hasChanges) {
      this.props.openModal(CancelWarning, { goBack: this.goBack });
    } else {
      this.goBack();
    }
  };

  goBack = () => {
    this.props.history.push('/');
    this.props.setSelectedServer(null);
  }

  addSeat = () => {
    this.props.addSeat();
    /* Scroll the added seats list to the right */
    // this.seatsRef.scrollLeft = this.seatsRef.querySelector('.inner').clientWidth;
    // const addedSeats = document.querySelector('.seats');
    // setTimeout(() => {
    //   addedSeats.scrollLeft = addedSeats.querySelector('.inner').clientWidth;
    // }, 0);
  }

  orderFood = async () => {
    await this.props.orderFood();

    if (this.props.match.params.tableId === 'new') {
      this.props.history.replace(`/table/${this.props.selectedTable.id}`);
    }
  }

  closeTable = async () => {
    const balanceOnAnySeat = this.props.selectedTable.seats.some(seat => !balancePaid(seat));
    if (balanceOnAnySeat) {
      this.props.openModal(CloseTableBalanceWarning);
      return;
    }

    const unpaidOrdersOnAnySeat = this.props.selectedTable.seats.some(seat => seat.orders.some(order => !order.id));
    if (unpaidOrdersOnAnySeat) {
      this.props.openModal(CloseTableWarning);
      return;
    }

    await this.props.orderFood();
    await this.props.closeTable();
    this.goBack();
  }

  render() {
    if (!this.props.selectedTable) return null;

    return (
      <div className="TableEditor-container">
        <NavBar>
          <Button
            raised
            icon="chevron_left"
            color="red"
            onClick={this.cancel}
          >
            Back
          </Button>

          <Button
            raised
            icon="check"
            color="green"
            style={{ margin: '0 10px' }}
            disabled={!this.props.hasChanges}
            onClick={this.orderFood}
          >Send
          </Button>

          <Button
            raised
            icon="done_all"
            color="yellow"
            disabled={
              this.props.loading > 0 ||
              this.props.match.params.tableId === 'new'
            }
            onClick={this.closeTable}
          >
            Close Table
          </Button>

          <NavDivider />

          <Button
            raised
            onClick={() => {
              const modal = this.props.selectedSeat.payments.length > 0
                ? LockedSeatWarning
                : CustomItem;

              this.props.openModal(modal);
            }}
          >
            Add Custom Item
          </Button>

          <Button
            raised
            style={{ margin: '0 10px' }}
            onClick={() => {
              const modal = this.props.selectedSeat.payments.length > 0
                ? LockedSeatWarning
                : KitchenMod;

              this.props.openModal(modal);
            }}
          >
            Add Kitchen Mod
          </Button>

          <Button
            raised
            disabled={this.props.selectedTable.seats.filter(seat => seat.payments.length === 0).length <= 1}
            onClick={() => this.props.openModal(CombineSeats)}
          >
            Combine Seats
          </Button>

          <NavDivider />

          <PrintDropdown
            isOpen={this.state.printDropdown}
            close={() => this.setState({ printDropdown: false })}
            toggle={(
              <Button
                className="print-button"
                raised
                onClick={() => this.setState(({ printDropdown }) => ({ printDropdown: !printDropdown }))}
                color="blue"
              >
                <i className="material-icons" aria-hidden="true">print</i>
                <span className="dropdown-arrow" role="presentation">
                  {this.state.printDropdown
                    ? <i className="material-icons" aria-hidden="true">keyboard_arrow_up</i>
                    : <i className="material-icons" aria-hidden="true">keyboard_arrow_down</i>
                  }
                </span>
              </Button>
            )}
          >
            <Button
              className="dropdown-button"
              onClick={() => this.props.printReceipt(ALL_SEATS)}
              disabled={!this.props.multipleSeatOrders}
            >Print All Receipts
            </Button>
            <Button
              className="dropdown-button"
              onClick={() => this.props.printReceipt(COMBINED)}
              disabled={!this.props.multipleSeatOrders}
            >Print Combined Receipt
            </Button>
          </PrintDropdown>

          <div className="server-details">
            <div className="user-info">
              <i className="material-icons" aria-hidden="true">perm_identity</i>
              <span>{this.props.selectedServer.name}</span>
            </div>
            <div className="menu-divider" />
            <div className="table-number">{this.props.selectedLocation.number}</div>
          </div>
        </NavBar>

        <div className="rows">
          <Menu />

          <div className="seats" ref={ref => { this.seatsRef = ref; }}>
            <div className="inner" role="radiogroup">
              {this.props.selectedTable.seats.map((seat, index) => (
                <div
                  key={index}
                  role="radio"
                  aria-checked={seat === this.props.selectedSeat}
                  tabIndex="0"
                  className={`column seat ${seat === this.props.selectedSeat ? 'selected' : ''}`}
                  onFocus={() => this.props.setSelectedSeatIndex(index)}
                >
                  <div className="top-bar">
                    <Button
                      icon="print"
                      round
                      raised
                      color="blue"
                      disabled={!seat.orders.some(order => order.id)}
                      onClick={() => this.props.printReceipt()}
                      aria-label="Print receipt"
                    />

                    <span className="seat-title">
                      {seat.payments.length > 0 ? (
                        <i
                          className="material-icons"
                          style={{ color: altColors.yellow, marginRight: '0.25rem' }}
                          aria-hidden="true"
                        >lock
                        </i>
                      ) : null}
                      Seat {index + 1}
                    </span>

                    <Button
                      icon="delete"
                      round
                      raised
                      color="red"
                      disabled={
                        this.props.selectedTable.seats.length <= 1 ||
                        seat.orders.some(order => order.id)
                      }
                      onClick={event => {
                        event.stopPropagation();
                        this.props.removeSeat(index);
                      }}
                      aria-label="Remove seat"
                    />
                  </div>

                  <div className="added-items">
                    <div className="inner">
                      <SortableOrders
                        onReorder={orders => {
                          this.props.replaceItems(orders, index);
                        }}
                        splitMenuItem={() => this.props.openModal(SplitOrder)}
                        onlySeat={this.props.selectedTable.seats.length > 1}
                        hasPayments={seat.payments.length > 0}
                        orders={seat.orders}
                      />
                    </div>
                  </div>

                  <div className="bottom-bar">
                    <Button
                      icon="payment"
                      round
                      raised
                      color="blue"
                      disabled={seat.payments.length === 0}
                      onClick={() => this.props.openModal(SeatPayments)}
                    />

                    <Button
                      icon="attach_money"
                      round
                      raised
                      color="yellow"
                      disabled={!seat.orders.some(order => order.id)}
                      onClick={() => {
                        this.props.setSelectedSeatIndex(index);

                        /* Prevent paying seat if there are unpaid orders */
                        seat.orders.some(order => !order.id)
                          ? this.props.openModal(PayWarning)
                          : this.props.openModal(PayTable);
                      }}
                    />

                    <div className="total">
                      {Object.entries(getSeatTotals(seat)).map(([key, val]) => (
                        <div key={key}>
                          <b>{key}:</b>
                          <span>{formatMoney(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="add-seat">
              <Button
                icon="add"
                round
                large
                raised
                color="blue"
                aria-label="Add seat"
                onClick={this.addSeat}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.loading,
  menu: state.menu,
  selectedLocation: state.selectedLocation,
  selectedServer: state.selectedServer,
  selectedTable: state.selectedTable,
  selectedSeat: state.selectedTable.seats[state.selectedSeatIndex],
  multipleSeatOrders: state.selectedTable.seats.filter(seat => seat.orders.some(order => order.id)).length > 1,
  hasChanges: JSON.stringify(state.unmodifiedTable) !== JSON.stringify(state.selectedTable),
});

const mapDispatchToProps = {
  getTable,
  setSelectedServer,
  printReceipt,
  orderFood,
  closeTable,
  addSeat,
  removeSeat,
  addOrder,
  setSelectedSeatIndex,
  replaceItems,
  openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableEditor);

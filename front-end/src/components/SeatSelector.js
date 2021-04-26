import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button, { altColors } from './Button';

class SeatSelector extends Component {
  static propTypes = {
    seats: PropTypes.array.isRequired,
    selectedSeatIndex: PropTypes.number.isRequired,
    lockSelected: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lockSelected: false,
  };

  constructor(props) {
    super(props);

    const selectedSeatIndexes = props.seats.map((seat, i) => (
      seat.payments.length === 0 && i === props.selectedSeatIndex
    ));

    this.state = { selectedSeatIndexes };
  }

  onChange = selectedSeatIndexes => {
    this.setState({ selectedSeatIndexes });
    this.props.onChange(selectedSeatIndexes.reduce((selectedIndexes, seat, index) => seat
      ? [ ...selectedIndexes, index]
      : selectedIndexes, []));
  }

  selectSeats = selectAll => {
    const selectedSeatIndexes = this.props.seats.map((seat, i) => {
      if (seat.payments.length > 0) {
        return false;
      }

      return selectAll || (this.props.lockSelected && i === this.props.selectedSeatIndex);
    });

    this.onChange(selectedSeatIndexes);
  }

  handleClick = index => {
    const selectedSeatIndexes = [...this.state.selectedSeatIndexes];
    selectedSeatIndexes[index] = !selectedSeatIndexes[index];
    this.onChange(selectedSeatIndexes);
  }

  render() {
    const selectAll = this.state.selectedSeatIndexes
      .filter((selected, index) => this.props.seats[index].payments.length === 0)
      .some(val => val === false);

    const SeatButtons  = this.props.seats.map((seat, i) => {
      const isLocked = this.props.lockSelected && this.props.selectedSeatIndex === i;
      const hasPayments = seat.payments.length > 0;

      return (
        <Button
          disabled={isLocked || hasPayments}
          onClick={() => this.handleClick(i)}
          style={{ minWidth: 'initial' }}
          className={`seat-square ${isLocked ? 'locked' : ''} ${this.state.selectedSeatIndexes[i] ? 'selected' : ''}`}
          key={i}
        >
          {hasPayments ? (
            <i
              className="material-icons payment-lock"
              style={{
                color: altColors.yellow,
                position: 'absolute',
                right: 0,
                top: '0.5rem',
                fontSize: '1rem',
              }}
              aria-hidden="true"
            >lock
            </i>
          ) : null}

          {seat.number}
        </Button>
      );
    });

    return (
      <div className="SeatSelector-container">
        <div className="seat-boxes">
          {SeatButtons}
        </div>
        <Button
          onClick={() => this.selectSeats(selectAll)}
          className="seat-select"
        >
          {selectAll ? 'Select all seats' : 'Deselect all seats'}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ selectedSeatIndex }) => ({
  selectedSeatIndex,
});

export default connect(mapStateToProps)(SeatSelector);

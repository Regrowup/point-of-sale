import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Calendar } from 'react-date-range';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { noop } from 'lodash';
import Button from '@/components/Button';
import { editShift } from '@/store/actions';
import Textfield from '@/components/Textfield';
import Modal from '@/components/ModalPortal';
import { parseDate } from '@/config/utils';
import { DATE_QUERY_FORMAT } from '@/config/constants';

const TIME_FORMAT = 'h:mm a';

const ViewShiftContainer = styled.form`
  .date-time-fields {
    position: relative;
    display: flex;
    align-items: baseline;

    &:last-child {
      margin-top: 1rem;
      height: 4rem;
    }

    > p {
      flex: 1;
      margin: 0;
    }
  }

  .rdr-Calendar {
    position: absolute;
    left: 0;
    top: 3.7rem;
    z-index: 2;
    box-shadow: -2px -3px 3px 0px rgba(0,0,0,0.06);
  }
`;

class ViewShift extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    shift: PropTypes.object.isRequired,
    editShift: PropTypes.func.isRequired,
  };

  state = {
    clockedInDate: parseDate(this.props.shift.clocked_in_at),
    clockedInTime: parseDate(this.props.shift.clocked_in_at).format(TIME_FORMAT),
    clockedInOpen: false,
    clockedOutDate: this.props.shift.clocked_out_at
      ? parseDate(this.props.shift.clocked_out_at)
      : null,
    clockedOutTime: this.props.shift.clocked_out_at
      ? parseDate(this.props.shift.clocked_out_at).format(TIME_FORMAT)
      : null,
    clockedOutOpen: false,
  };

  formatInTime = () => {
    this.setState(({ clockedInTime }) => {
      const newTime = moment(clockedInTime, [TIME_FORMAT, 'hh:mm']);

      return {
        clockedInTime: newTime.isValid()
          ? newTime.format(TIME_FORMAT)
          : moment().format(TIME_FORMAT),
      };
    });
  }

  formatOutTime = () => {
    this.setState(({ clockedOutTime }) => {
      const newTime = moment(clockedOutTime, [TIME_FORMAT, 'hh:mm']);

      return {
        clockedOutTime: newTime.isValid()
          ? newTime.format(TIME_FORMAT)
          : moment().format(TIME_FORMAT),
      };
    });
  }

  editShift = async event => {
    event.preventDefault();

    const {
      clockedInDate,
      clockedInTime,
      clockedOutDate,
      clockedOutTime,
    } = this.state;

    const inTime = moment(clockedInTime, TIME_FORMAT);
    const clocked_in_at = clockedInDate.clone().set({
      hour: inTime.hours(),
      minute: inTime.minutes(),
      second: inTime.seconds(),
    }).tz('UTC').format(DATE_QUERY_FORMAT);

    const outTime = moment(clockedOutTime, TIME_FORMAT);
    const clocked_out_at = clockedOutDate.clone().set({
      hour: outTime.hours(),
      minute: outTime.minutes(),
      second: outTime.seconds(),
    }).tz('UTC').format(DATE_QUERY_FORMAT);

    await this.props.editShift({
      ...this.props.shift,
      clocked_in_at,
      clocked_out_at,
    });

    this.props.closeModal();
  }

  render() {
    return (
      <Modal title={`${this.props.shift.server.name}'s shift`}>
        <ViewShiftContainer
          content={1}
          onSubmit={this.editShift}
          id="edit-shift-form"
          autoComplete="off"
        >
          <div className="date-time-fields">
            <Textfield
              onChange={noop}
              label="Clock in date"
              value={this.state.clockedInDate.format('LL')}
              onClick={() => this.setState({ clockedInOpen: true })}
              onFocus={() => this.setState({ clockedInOpen: true })}
              onBlur={() => this.setState({ clockedInOpen: false })}
            />
            {this.state.clockedInOpen && (
              <Calendar
                date={this.state.clockedInDate}
                onChange={date => this.setState({ clockedInDate: date, clockedInOpen: false })}
              />
            )}

            <Textfield
              label="Clock in time"
              style={{ marginLeft: '1rem' }}
              value={this.state.clockedInTime}
              onChange={({ target }) => this.setState({ clockedInTime: target.value })}
              onBlur={this.formatInTime}
            />
          </div>

          {this.state.clockedOutDate && (
            <div className="date-time-fields">
              <Textfield
                onChange={noop}
                label="Clock out date"
                value={this.state.clockedOutDate && this.state.clockedOutDate.format('LL')}
                onClick={() => this.setState({ clockedOutOpen: true })}
                onFocus={() => this.setState({ clockedOutOpen: true })}
                onBlur={() => this.setState({ clockedOutOpen: false })}
              />
              {this.state.clockedOutOpen && (
                <Calendar
                  date={this.state.clockedOutDate}
                  onChange={date => this.setState({ clockedOutDate: date, clockedOutOpen: false })}
                />
              )}

              <Textfield
                label="Clock out time"
                style={{ marginLeft: '1rem' }}
                value={this.state.clockedOutTime}
                onChange={({ target }) => this.setState({ clockedOutTime: target.value })}
                onBlur={this.formatOutTime}
              />

              <Button
                round
                color="red"
                icon="backspace"
                onClick={() => this.setState({ clockedOutDate: null })}
              />
            </div>
          )}

          {!this.state.clockedOutDate && (
            <div className="date-time-fields">
              <p>This shift has not yet ended; click to add a clock out time.</p>
              <Button
                raised
                color="green"
                onClick={() => this.setState({
                  clockedOutDate: moment(),
                  clockedOutTime: moment().format(TIME_FORMAT),
                })}
              >Clock Out
              </Button>
            </div>
          )}
        </ViewShiftContainer>

        <Button
          cancelButton
          color="red"
          onClick={() => this.props.closeModal()}
        >CANCEL
        </Button>

        <Button
          okButton
          color="strongBlue"
          type="submit"
          form="edit-shift-form"
        >SAVE
        </Button>
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  editShift,
};

export default connect(null, mapDispatchToProps)(ViewShift);

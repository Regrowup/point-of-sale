import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button, { altColors } from '@/components/Button';
import styled from 'styled-components';
import moment from 'moment-timezone';
import {
  clockIn,
  clockOut
} from '@/store/actions';
import { connect } from 'react-redux';
import PinSelect from '@/components/PinSelect';

const ClockContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(circle at bottom right, ${altColors.blue}, #fff 100%);
`;

const LargeButton = styled(Button)`
  font-size: 4rem;
  margin: 1rem;
  min-width: 30rem;
  font-weight: 400;
`;

const TimeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 100;
  margin-bottom: 2rem;
  background: hsla(0, 0%, 100%, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 1rem;

  > icon {
    font-size: 2rem;
  }

  > time {
    margin-left: 1rem;
    font-family: monospace;
  }
`;

class Clock extends Component {
  static propTypes = {
    clockIn: PropTypes.func.isRequired,
    clockOut: PropTypes.func.isRequired,
  };

  state = {
    currentTime: moment(),
    pinAction: null,
  }

  intervalId = null;

  componentDidMount() {
    this.intervalId = window.setInterval(this.updateCurrentTime, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
  }

  updateCurrentTime = () => {
    this.setState({ currentTime: moment() });
  }

  clockIn = ({ server, closeModal }) => {
    this.props.clockIn(server);
    closeModal();
  }

  clockOut = ({ server, closeModal }) => {
    this.props.clockOut(server);
    closeModal();
  }

  render() {
    return (
      <ClockContainer>
        <PinSelect
          open={this.state.pinAction != null}
          closeModal={() => this.setState({ pinAction: null })}
          pinAction={this.state.pinAction}
        />

        <TimeContainer>
          <i className="icon material-icons" aria-hidden="true">access_time</i>
          <time>{this.state.currentTime.format('HH:mm:ss')}</time>
        </TimeContainer>

        <LargeButton
          raised
          onClick={() => this.setState({ pinAction: this.clockIn })}
        >Clock In
        </LargeButton>

        <LargeButton
          raised
          onClick={() => this.setState({ pinAction: this.clockOut })}
        >Clock Out
        </LargeButton>
      </ClockContainer>
    );
  }
}

const mapDispatchToProps = {
  clockIn,
  clockOut,
};

export default connect(null, mapDispatchToProps)(Clock);

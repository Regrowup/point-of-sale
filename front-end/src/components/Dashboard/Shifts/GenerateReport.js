import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { noop } from 'lodash';
import { Calendar } from 'react-date-range';
import moment from 'moment-timezone';
import Select from 'react-select';
import Button from '@/components/Button';
import { printReadout, generateReport } from '@/store/actions';
import Modal from '@/components/ModalPortal';
import Textfield from '@/components/Textfield';

const GenerateReportContainer = styled.div`
  .date-time-fields {
    position: relative;
    display: flex;
    align-items: baseline;
    margin-bottom: 1rem;

    &:last-child {
      margin-top: 1rem;
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

  .select-label {
    width: 100%;
  }

  .select-label-text {
    font-weight: 400;
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0.25rem;
    font-size: .75rem;
    transition: top 200ms;
    color: #585858;
  }

  .servers-select {
    margin-top: 1.75rem;
  }
`;

class GenerateReport extends Component {
  state = {
    fromDateOpen: false,
    toDateOpen: false,
    fromDate: moment().startOf('day'),
    toDate: moment().endOf('day'),
    selectedServers: [],
  }

  setSelectedServers = selectedServers => {
    this.setState({ selectedServers });
  }

  render() {
    return (
      <Modal title="Generate Shift Report">
        <GenerateReportContainer content={1}>
          <div className="date-time-fields">
            <Textfield
              onChange={noop}
              label="From date"
              value={this.state.fromDate.format('LL')}
              onClick={() => this.setState({ fromDateOpen: true })}
              onFocus={() => this.setState({ fromDateOpen: true })}
              // onBlur={() => this.setState({ fromDateOpen: false })}
            />
            {this.state.fromDateOpen && (
              <Calendar
                date={this.state.fromDate}
                onChange={date => this.setState({ fromDate: date.startOf('day'), fromDateOpen: false })}
              />
            )}
          </div>

          <div className="date-time-fields">
            <Textfield
              onChange={noop}
              label="To date"
              value={this.state.toDate.format('LL')}
              onClick={() => this.setState({ toDateOpen: true })}
              onFocus={() => this.setState({ toDateOpen: true })}
              // onBlur={() => this.setState({ toDateOpen: false })}
            />
            {this.state.toDateOpen && (
              <Calendar
                date={this.state.toDate}
                onChange={date => this.setState({ toDate: date.endOf('day'), toDateOpen: false })}
              />
            )}
          </div>

          <div className="date-time-fields">
            <label className="select-label">
              <span className="select-label-text">Select servers</span>
              <Select
                isMulti
                className="servers-select"
                value={this.state.selectedServers}
                onChange={this.setSelectedServers}
                options={this.props.servers}
                getOptionLabel={server => server.name}
                getOptionValue={server => server.id}
              />
            </label>
          </div>
        </GenerateReportContainer>

        <Button
          color="blue"
          cancelButton
          onClick={() => this.props.closeModal()}
        >GO BACK
        </Button>

        <Button
          disabled={this.state.selectedServers.length === 0}
          raised
          okButton
          color="blue"
          onClick={() => this.props.generateReport({
            servers: this.state.selectedServers,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
          })}
        >Generate
        </Button>
      </Modal>
    );
  }
}

GenerateReport.propTypes = {
  generateReport: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  servers: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  servers: state.servers,//.map(({ id:value, name:label }) => ({ value, label })),
});

const mapDispatchToProps = {
  printReadout,
  generateReport,
};

export default connect(mapStateToProps, mapDispatchToProps)(GenerateReport);

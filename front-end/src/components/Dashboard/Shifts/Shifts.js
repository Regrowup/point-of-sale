import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import styled from 'styled-components';
import moment from 'moment-timezone';
import Report from '../Sales/Report';
import { getShifts, printReadout, getReadout } from '@/store/actions';
import { formatDate } from '@/config/utils';
import { DATE_QUERY_FORMAT } from '@/config/constants';
import Button from '@/components/Button';
import EditShift from './EditShift';
import ViewShift from './ViewShift';
import GenerateReport from './GenerateReport';

const Container = styled.div`
  height: 100%;
  overflow-y: auto;

  .-clock-date {
    min-width: 195px;
  }

  .-first-date {
    margin-left: auto;
  }

  .-shift-length {
    min-width: 120px;
  }
`;

function getTimeDiff(clockedIn, clockedOut) {
  const inDate = moment(clockedIn, DATE_QUERY_FORMAT);
  const outDate = moment(clockedOut, DATE_QUERY_FORMAT);
  const duration = moment.duration(outDate.diff(inDate));

  return `${duration.hours()} hrs ${duration.minutes()} mins`;
}

class Shifts extends Component {
  static propTypes = {
    getShifts: PropTypes.func.isRequired,
    printReadout: PropTypes.func.isRequired,
    shifts: PropTypes.shape({
      page_data: PropTypes.shape({
        last_page: PropTypes.number,
        data: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number,
          splitNum: PropTypes.number,
          name: PropTypes.string,
        })),
      }),
    }),
    getReadout: PropTypes.func.isRequired,
  };

  static defaultProps = {
    shifts: null,
  };

  state = {
    modal: null,
    modalProps: {},
  };

  componentDidMount() {
    this.getShifts();
  }

  openModal = (modalComponent, modalProps = {}) => {
    this.setState({ modal: modalComponent, modalProps });
  }

  closeModal = () => {
    this.setState({ modal: null, modalProps: {} });
  }

  getShifts = page => {
    this.props.getShifts({ page });
  };

  render() {
    return (
      <Container>
        {this.state.modal && (
          <this.state.modal
            closeModal={this.closeModal}
            {...this.state.modalProps}
          />
        )}

        <Report
          getData={this.getShifts}
          pageData={get(this.props.shifts, 'page_data')}
          totals={[
            {
              label: 'Generate Shift Report',
              content: (
                <Button
                  raised
                  color="blue"
                  icon="list"
                  onClick={() => this.openModal(GenerateReport)}
                >Generate Shift Report
                </Button>
              ),
            },
          ]}
          columns={[
            {
              label: 'Name',
              value: shift => shift.server.name,
            },
            {
              label: 'Clocked In',
              className: '-clock-date -first-date',
              value: shift => shift.clocked_in_at
                ? formatDate(shift.clocked_in_at)
                : '--',
            },
            {
              label: 'Clocked Out',
              className: '-clock-date',
              value: shift => shift.clocked_out_at
                ? formatDate(shift.clocked_out_at)
                : '--',
            },
            {
              label: 'Shift Length',
              className: '-shift-length',
              value: shift => shift.clocked_out_at
                ? getTimeDiff(shift.clocked_in_at, shift.clocked_out_at)
                : '--',
            },
            {
              render: shift => (
                <Button
                  key={shift.id}
                  round
                  color="blue"
                  raised
                  style={{ marginRight: '1rem' }}
                  icon="edit"
                  aria-label="View shift"
                  onClick={() => this.openModal(EditShift, { shift })}
                />
              ),
            },
            {
              render: shift => (
                <Button
                  key={`${shift.id}-view-shift`}
                  round
                  raised
                  icon="arrow_forward"
                  aria-label="View shift"
                  onClick={async () => {
                    const readout = await this.props.getReadout({ shift });
                    this.openModal(ViewShift, { shift, readout });
                  }}
                />
              ),
            },
          ]}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  shifts: state.shifts,
});

const mapDispatchToProps = {
  getShifts,
  printReadout,
  getReadout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Shifts);

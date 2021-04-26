import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, sumBy } from 'lodash';
import Report from './Report';
import { getServerStats } from '@/store/actions';
import { formatMoney } from '@/config/utils';

function getTips(seats) {
  return seats.reduce((tips, seat) => tips + sumBy(seat.payments, 'tip'), 0);
}

class ServerStats extends Component {
  static propTypes = {
    startDate: PropTypes.shape({ isSame: PropTypes.func }).isRequired,
    endDate: PropTypes.shape({ isSame: PropTypes.func }).isRequired,
    serverStats: PropTypes.shape({
      page_data: PropTypes.shape({
        last_page: PropTypes.number,
        data: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number,
          payment_type: PropTypes.shape({ name: PropTypes.string }),
          amount: PropTypes.number,
          created_at: PropTypes.string,
        })),
      }),
      total: PropTypes.shape({ count: PropTypes.number, amount: PropTypes.number }),
    }),
    getServerStats: PropTypes.func.isRequired,
  };

  static defaultProps = {
    serverStats: null,
  };

  componentDidMount() {
    this.getServerStats();
  }

  componentDidUpdate({ startDate: prevStart, endDate: prevEnd }) {
    const { startDate, endDate } = this.props;

    if (!startDate.isSame(prevStart) || !endDate.isSame(prevEnd)) {
      this.getServerStats();
    }
  }

  getServerStats = page => {
    this.props.getServerStats({
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      page,
    });
  }

  render() {
    const { serverStats } = this.props;

    return (
      <div className="Payments-container">
        <Report
          pageData={get(serverStats, 'page_data')}
          columns={[
            { label: 'Server Name',
              value: server => server.name,
            },
            { className: '-first_date',
              label: 'Tables Closed',
              value: server => server.closed_tables,
            },
            { label: 'Tips Received',
              value: server => `$${formatMoney(getTips(server.seats))}`,
            },
          ]}
          getData={this.getServerStats}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  startDate: state.sales.startDate,
  endDate: state.sales.endDate,
  serverStats: state.sales.serverStats,
});

const mapDispatchToProps = {
  getServerStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerStats);

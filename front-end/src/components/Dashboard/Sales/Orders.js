import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isNumber, get } from 'lodash';
import { connect } from 'react-redux';
import Report from './Report';
import { formatMoney, formatDate } from '@/config/utils';
import { getOrders } from '@/store/actions';

class Orders extends Component {
  componentDidMount() {
    this.getOrders();
  }

  componentDidUpdate({ startDate: prevStart, endDate: prevEnd }) {
    const { startDate, endDate } = this.props;

    if (!startDate.isSame(prevStart) || !endDate.isSame(prevEnd)) {
      this.getOrders();
    }
  }

  getOrders = page => {
    this.props.getOrders({
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      page,
    });
  };

  getTotals = () => {
    const { total_not_voided, total_voided } = this.props.orders;

    return [
      { label: 'Non-voided orders',
        value: `${get(total_not_voided, 'count')}`,
      },
      { label: 'Voided orders',
        value: `${get(total_voided, 'count')}`,
      },
    ];
  }

  render() {
    return (
      <div className="Orders-container">
        <Report
          getData={this.getOrders}
          pageData={get(this.props.orders, 'page_data')}
          totals={this.getTotals()}
          columns={[
            { label: 'Name',
              value: order => (
                isNumber(order.splitNum)
                  ? `(1/${order.splitNum}) ${order.name}`
                  : order.name
              ),
            },
            { custom: true,
              render: (order, i) => (
                <div className="tag -price" key={i}>{formatMoney(order.price)}</div>
              ),
            },
            { custom: true,
              render: (order, i) => (
                !!order.voided && <div className="tag -voided" key={i}>Voided</div>
              ),
            },
            { label: 'Created',
              className: '-date -first_date',
              value: order => formatDate(order.updated_at),
            },
            { label: 'Updated',
              className: '-date',
              value: order => formatDate(order.updated_at),
            },
          ]}
        />
      </div>
    );
  }
}

Orders.propTypes = {
  startDate: PropTypes.shape({ isSame: PropTypes.func }).isRequired,
  endDate: PropTypes.shape({ isSame: PropTypes.func }).isRequired,
  getOrders: PropTypes.func.isRequired,
  orders: PropTypes.shape({
    page_data: PropTypes.shape({
      last_page: PropTypes.number,
      data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        splitNum: PropTypes.number,
        name: PropTypes.string,
      })),
    }),
    total_not_voided: PropTypes.shape({ count: PropTypes.number, price: PropTypes.number }),
    total_voided: PropTypes.shape({ count: PropTypes.number, price: PropTypes.number }),
  }),
};

Orders.defaultProps = {
  orders: null,
};

const mapStateToProps = ({ sales }) => ({
  startDate: sales.startDate,
  endDate: sales.endDate,
  orders: sales.orders,
});

const mapDispatchToProps = dispatch => ({
  getOrders: options => dispatch(getOrders(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);

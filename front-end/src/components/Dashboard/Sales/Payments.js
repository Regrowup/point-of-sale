import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Report from './Report';
import { formatMoney, formatDate } from '@/config/utils';
import { getPayments } from '@/store/actions';

class Payments extends Component {
  static propTypes = {
    startDate: PropTypes.shape({ isSame: PropTypes.func }).isRequired,
    endDate: PropTypes.shape({ isSame: PropTypes.func }).isRequired,
    payments: PropTypes.shape({
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
    getPayments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    payments: null,
  };

  componentDidMount() {
    this.getPayments();
  }

  componentDidUpdate({ startDate: prevStart, endDate: prevEnd }) {
    const { startDate, endDate } = this.props;

    if (!startDate.isSame(prevStart) || !endDate.isSame(prevEnd)) {
      this.getPayments();
    }
  }

  getPayments = page => {
    this.props.getPayments({
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      page,
    });
  }

  render() {
    const { payments } = this.props;
    const totalPayments = get(payments, 'total.count');
    const netSales = get(payments, 'total.amount');
    const tax = get(payments, 'total.tax');
    const tip = get(payments, 'total.tip');

    return (
      <div className="Payments-container">
        <Report
          totals={[
            {
              label: 'Payments',
              value: totalPayments,
            },
            {
              label: 'Gross sales',
              value: `$${formatMoney(netSales)}`,
            },
            {
              label: 'Net sales',
              value: `$${formatMoney(netSales - tax - tip)}`,
            },
            {
              label: 'Tax',
              value: `$${formatMoney(tax)}`,
            },
            {
              label: 'Tip',
              hint: 'Tip is not recorded for cash payments',
              value: `$${formatMoney(tip)}`,
            },
          ]}
          pageData={get(payments, 'page_data')}
          columns={[
            { label: 'Type',
              value: payment => payment.payment_type.name,
            },
            { label: 'Amount',
              value: payment => `$${formatMoney(payment.amount)}`,
            },
            { label: 'Received',
              className: '-date -first_date',
              value: payment => formatDate(payment.created_at),
            },
          ]}
          getData={this.getPayments}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  startDate: state.sales.startDate,
  endDate: state.sales.endDate,
  payments: state.sales.payments,
});

const mapDispatchToProps = {
  getPayments,
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);

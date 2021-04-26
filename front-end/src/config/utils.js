import moment from 'moment-timezone';
import { DATE_QUERY_FORMAT, HST_TAX_PERCENT } from './constants';

export function formatMoney(amount) {
  return (amount / 100).toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseDate(date) {
  return moment.tz(date, DATE_QUERY_FORMAT, 'UTC').tz('US/Eastern');
}

export function formatDate(date) {
  return parseDate(date).format('LLL');
}

export function getSeatTotals(seat) {
  const subtotal = seat.orders
    .filter(order => order.id)
    .reduce((sum, order) => sum + (order.price || 0), 0.0);
  const hst = subtotal * HST_TAX_PERCENT;
  const total = Math.round(subtotal + hst);
  const payments = seat.payments
    ? seat.payments.reduce((sum, { amount }) => sum + amount, 0)
    : 0;
  const balance = total - payments;

  return {
    Subtotal: subtotal,
    'HST @13%': hst,
    Total: total,
    Payments: payments,
    Balance: balance,
  };
}

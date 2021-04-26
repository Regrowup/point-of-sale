import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { debounce } from 'lodash';
import UserIcon from './icons/ic_perm_identity_black_24px.svg';
import ClockIcon from './icons/ic_access_time_black_24px.svg';
import './Table.scss';
import { DATE_QUERY_FORMAT } from '@/config/constants';

const TABLE_TYPES = {
  TABLE: 'table',
  BAR: 'bar',
};

const RESIZE_DEBOUNCE = 500;
const UPDATE_TIME_AGO_TIMEOUT = 5000;

class Table extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    location: PropTypes.shape({
      table: PropTypes.shape({
        created_at: PropTypes.string.isRequired,
        server: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
        seats: PropTypes.arrayOf(PropTypes.object).isRequired,
      }),
      type: PropTypes.string.isRequired,
      number: PropTypes.number,
      row: PropTypes.number,
      col: PropTypes.number,
    }).isRequired,
  };

  state = {
    timeAgo: null,
    style: {
      gridRow: this.props.location.row + 1,
      gridColumn: this.props.location.col + 1,
    },
  }

  makeTableSquare = debounce(() => {
    const { clientWidth, clientHeight } = this.tableContainer;

    if (clientWidth === clientHeight) {
      return;
    }

    if (clientHeight > clientWidth) {
      this.setState(({ style }) => ({
        style: { ...style, maxHeight: clientWidth, maxWidth: '100%', filter: 'none', opacity: 1 },
      }));
    } else {
      this.setState(({ style }) => ({
        style: { ...style, maxHeight: '100%', maxWidth: clientHeight, filter: 'none', opacity: 1 },
      }));
    }
  }, RESIZE_DEBOUNCE, { leading: true, trailing: true });

  componentDidMount() {
    if (this.props.location.table) {
      this.createdAt = moment.tz(this.props.location.table.created_at, DATE_QUERY_FORMAT, 'UTC').tz('US/Eastern');
      const timeAgo = this.createdAt.fromNow();

      this.interval = setInterval(() => {
        this.updateTimeAgo();
      }, UPDATE_TIME_AGO_TIMEOUT);

      this.setState({ timeAgo });
    }

    this.updateTableSize();

    window.addEventListener('resize', this.updateTableSize);
    window.addEventListener('orientationchange', this.updateTableSize);
  }

  componentWillUnmount() {
    this.makeTableSquare.cancel();
    clearInterval(this.interval);
    window.removeEventListener('resize', this.updateTableSize);
    window.removeEventListener('orientationchange', this.updateTableSize);
  }

  updateTableSize = () => {
    this.setState(({ style }) => ({
      style: { ...style, maxHeight: '100%', maxWidth: '100%', filter: 'blur(10px)', opacity: 0.2 },
    }));

    this.makeTableSquare();
  };

  updateTimeAgo() {
    this.setState({ timeAgo: this.createdAt.fromNow() });
  }

  render() {
    const { location, onClick } = this.props;
    const tableOpen = location.table != null;
    const UserImg = <img src={UserIcon} alt="User" />;

    return (
      <div
        ref={ref => this.tableContainer = ref}
        className="Table-container"
        style={this.state.style}
      >
        <button
          type="button"
          onClick={onClick}
          className={`
            table-content
            ${tableOpen ? 'active' : ''}
            ${location.type === TABLE_TYPES.BAR ? 'bar' : ''}`
          }
        >
          {tableOpen ? (
            <div className="clock">
              <img src={ClockIcon} alt="Updated at" />
              <span>{this.state.timeAgo}</span>
            </div>
          ) : null}

          <div className="details">
            <div className="table-number">{location.number}</div>
            {tableOpen && <div className="seats">Seats: {location.table.seats.length}</div>}
          </div>

          {tableOpen && <div className="user-info">{UserImg} {location.table.server.name}</div>}
        </button>
      </div>
    );
  }
}

export default Table;

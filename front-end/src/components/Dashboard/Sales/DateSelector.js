import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateRange } from 'react-date-range';
import { withRouter } from 'react-router-dom';
import './DateSelector.scss';
import { SEARCH_QUERY_FORMAT } from '@/store/reducer';
import { setDates } from '@/store/actions';

const DATE_DISPLAY_FORMAT = 'LLL';

class DateSelector extends Component {
  static propTypes = {
    history: PropTypes.shape({ replace: PropTypes.func }).isRequired,
    startDate: PropTypes.shape({ format: PropTypes.func }).isRequired,
    endDate: PropTypes.shape({ format: PropTypes.func }).isRequired,
    setDates: PropTypes.func.isRequired,
  };

  state = {
    pickerOpen: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.pickerOpen === false &&
      this.state.pickerOpen === true &&
      this.dateRange !== null &&
      this.display !== null
    ) {
      window.document.addEventListener('click', this.handleBlur);
    }
  }

  componentWillUnmount() {
    window.document.removeEventListener('click', this.handleBlur);
  }

  handleBlur = ({ target }) => {
    if (target !== this.dateRange && target !== this.display && !this.dateRange.contains(target)) {
      this.setState({ pickerOpen: false });
      window.document.removeEventListener('click', this.handleBlur);
    }
  };

  handleDateChange = ({ startDate, endDate }) => {
    this.props.history.replace({
      search: `?startDate=${startDate.format(SEARCH_QUERY_FORMAT)}&endDate=${endDate.format(SEARCH_QUERY_FORMAT)}`,
    });

    this.props.setDates(startDate, endDate);
    this.setState({ pickerOpen: false });
  };

  togglePicker = () => {
    this.setState(({ pickerOpen }) => ({ pickerOpen: !pickerOpen }));
  };

  render() {
    const { startDate, endDate } = this.props;

    return (
      <div className="date-selector">
        <div
          role="switch"
          aria-checked={this.state.pickerOpen}
          tabIndex={0}
          ref={c => { this.display = c; }}
          className="display"
          onKeyPress={({ key }) => {
            if (key === 'Enter') this.togglePicker();
          }}
          onClick={this.togglePicker}
        >
          {startDate.format(DATE_DISPLAY_FORMAT)}
          <i className="material-icons arrow">arrow_forward</i>
          {endDate.format(DATE_DISPLAY_FORMAT)}
          <i className="material-icons dropdown">
            {`keyboard_arrow_${this.state.pickerOpen ? 'up' : 'down'}`}
          </i>
        </div>

        <div
          ref={ref => { this.dateRange = ref; }}
          className={`date_range ${this.state.pickerOpen ? '' : '-hidden'}`}
        >
          <DateRange
            id="date-range"
            twoStepChange
            rangedCalendars
            onChange={this.handleDateChange}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  startDate: state.sales.startDate,
  endDate: state.sales.endDate,
});

const mapDispatchToProps = {
  setDates,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DateSelector));

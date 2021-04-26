import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactPaginate from 'react-paginate';
import './Report.scss';
import ReactTooltip from 'react-tooltip';

class Report extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    pageData: PropTypes.shape({
      data: PropTypes.array,
      total: PropTypes.number,
      per_page: PropTypes.number,
      last_page: PropTypes.number,
    }),
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    getData: PropTypes.func.isRequired,
    totals: PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOf[PropTypes.string, PropTypes.number],
      })),
    ]),
  };

  static defaultProps = {
    totals: null,
    pageData: null,
    data: null,
  };

  handlePageClick = ({ selected: page }) => {
    this.props.getData(page + 1);
  }

  renderTotals() {
    if (!this.props.totals) return null;

    const totals = Array.isArray(this.props.totals)
      ? this.props.totals
      : [this.props.totals];

    return totals.map(({ label, value, hint, content }) => {
      if (content) {
        return (
          <div className="total" key={label}>
            {content}
          </div>
        );
      }

      return (
        <div className="total" key={label}>
          {label}

          {hint ? (
            <i
              className="material-icons total-hint"
              aria-hidden="true"
              data-tip={hint}
            >help
            </i>
          ) : null}

          <span className="value">{value}</span>
        </div>
      );
    });
  }

  renderReportResults() {
    const data = this.props.data || this.props.pageData.data;

    return (
      <div className="Report-container">
        <ReactTooltip />
        <div className="totals">{this.renderTotals()}</div>

        <div className="rows">
          {data.map((datum, i) => (
            <div key={`id-${datum.id}` || i} className="row_wrapper">
              <div className="row">
                {this.props.columns.map((column, j) => {
                  if (column.render) {
                    return column.render(datum, j);
                  }

                  return (
                    <div className={`datum ${column.className ? column.className : ''}`} key={column.label || j}>
                      <span className="label">{column.label}</span>
                      {column.value(datum)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {this.props.pageData && this.props.pageData.total > this.props.pageData.per_page && (
          <ReactPaginate
            previousLabel={<i className="material-icons">arrow_back</i>}
            nextLabel={<i className="material-icons">arrow_forward</i>}
            breakLabel="..."
            pageLinkClassName="page_link"
            pageCount={this.props.pageData.last_page}
            marginPagesDisplayed={1}
            pageRangeDisplayed={9}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
        )}
      </div>
    );
  }

  render() {
    if (!get(this.props, 'data.length') && !get(this.props.pageData, 'data.length')) {
      return (
        <div className="Report-container">
          <h1 className="no_results">No results found</h1>
        </div>
      );
    }

    return this.renderReportResults();
  }
}

export default Report;

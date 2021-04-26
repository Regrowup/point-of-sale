import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isNumber, get } from 'lodash';
import DropdownMenu from 'react-dd-menu';
import 'react-dd-menu/src/scss/react-dd-menu.scss';
import Button from './Button';

class TableOrder extends Component {
  static propTypes = {
    setSorting: PropTypes.func.isRequired,
    removeMenuItem: PropTypes.func.isRequired,
    reorderItem: PropTypes.func.isRequired,
    splitMenuItem: PropTypes.func.isRequired,
    mod_id: PropTypes.number.isRequired,
    order: PropTypes.object.isRequired,
    selectedServer: PropTypes.object.isRequired,
    seats: PropTypes.array.isRequired,
    hasPayments: PropTypes.bool.isRequired,
  };

  state = { dropdownOpen: false };

  closeDropdown = () => {
    this.setState({ dropdownOpen: false });
    this.props.setSorting(false);
  };

  render() {
    const { order } = this.props;

    return (
      <div
        style={{ position: 'relative' }}
        data-id={JSON.stringify(order)}
        className={`item ${order.id || isNumber(order.splitNum) ? 'ordered' : ''} ${order.deleted ? 'removed' : ''}`}
      >
        <DropdownMenu
          align="left"
          toggle={(
            <Button
              icon="more_vert"
              onClick={() => {
                this.setState(({ dropdownOpen }) => {
                  this.props.setSorting(!dropdownOpen);
                  return { dropdownOpen: !dropdownOpen };
                });
              }}
              round
              aria-label="Show options"
            />
          )}
          close={this.closeDropdown}
          isOpen={this.state.dropdownOpen}
          closeOnInsideClick={false}
        >
          {order.id || isNumber(order.splitNum) ? (
            this.props.selectedServer.is_admin ? (
              <li>
                <Button
                  onClick={() => {
                    this.props.setSorting(false);
                    this.props.removeMenuItem();
                  }}
                >
                  Void
                </Button>
              </li>
            ) : null
          ) : (
            <li>
              <Button
                onClick={() => {
                  this.props.setSorting(false);
                  this.props.removeMenuItem();
                }}
              >
                Remove
              </Button>
            </li>
          )}

          {(order.id || isNumber(order.splitNum)) && (
            <li>
              <Button
                disabled={this.props.seats.filter(seat => seat.payments.length === 0).length <= 1 || this.props.hasPayments}
                onClick={() => {
                  this.closeDropdown();
                  this.props.splitMenuItem();
                }}
              >
                Split
              </Button>
            </li>
          )}

          <li>
            <Button
              onClick={() => {
                this.closeDropdown();
                this.props.reorderItem();
              }}
            >
              Re-order
            </Button>
          </li>
        </DropdownMenu>

        <span className="name">
          {isNumber(order.splitNum)
            ? `(1/${order.splitNum}) ${order.name}`
            : order.name
          }
        </span>

        {get(order, 'item.id') !== this.props.mod_id ? (
          <span className="right">{(order.price / 100).toFixed(2)}</span>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  mod_id: state.mod_id,
  selectedServer: state.selectedServer,
  seats: state.selectedTable.seats,
});

export default connect(mapStateToProps)(TableOrder);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Sortable from 'react-sortablejs';
import TableOrder from './TableOrder';
import { removeItem, reorderItem, setSelectedOrderIndex } from '../store/actions';

class SortableOrders extends Component {
  static propTypes = {
    onReorder: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    splitMenuItem: PropTypes.func.isRequired,
    reorderItem: PropTypes.func.isRequired,
    orders: PropTypes.arrayOf(PropTypes.object).isRequired,
    setSelectedOrderIndex: PropTypes.func.isRequired,
    hasPayments: PropTypes.bool.isRequired,
  };

  state = { disabled: false };

  setSorting = disabled => {
    if (this.sortable) {
      this.sortable.option('disabled', disabled);
      this.setState({ disabled });
    }
  }

  render() {
    return (
      <Sortable
        ref={ref => {
          if (ref) this.sortable = ref.sortable;
        }}
        options={{
          group: {
            name: 'shared',
            pull: () => !this.props.hasPayments,
            put: () => !this.props.hasPayments,
          },
          animation: 150,
          disabled: this.state.disabled,
        }}
        onChange={orders => this.props.onReorder(orders.map(JSON.parse))}
      >
        {this.props.orders.map((order, index) => (
          <TableOrder
            key={order.id || order.key}
            order={order}
            setSorting={this.setSorting}
            hasPayments={this.props.hasPayments}
            removeMenuItem={() => this.props.removeItem(index)}
            splitMenuItem={() => {
              this.props.setSelectedOrderIndex(index);
              this.props.splitMenuItem();
            }}
            reorderItem={() => this.props.reorderItem(index)}
          />
        ))}
      </Sortable>
    );
  }
}

const mapDispatchToProps = {
  removeItem,
  reorderItem,
  setSelectedOrderIndex,
};

export default connect(null, mapDispatchToProps)(SortableOrders);

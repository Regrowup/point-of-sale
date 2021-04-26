import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, noop } from 'lodash';
import Button from '../../Button';
import List from './List';
import MenuItemModal from './MenuItemModal';
import { getMenu, removeMenuItem, editMenuItem, addMenuItem } from '../../../store/actions';

class MenuItemsList extends Component {
  static propTypes = {
    getMenu: PropTypes.func.isRequired,
    removeMenuItem: PropTypes.func.isRequired,
    addMenuItem: PropTypes.func.isRequired,
    editMenuItem: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
    selectedSubcategory: PropTypes.object,
  };

  static defaultProps = {
    selectedSubcategory: null,
  };

  removeMenuItem = async menuItemId => {
    await this.props.removeMenuItem(menuItemId);
    await this.props.getMenu();
  }

  addMenuItem = () => {
    this.props.openDialog({
      title: 'Add Menu Item',
      content: setOkData => (
        <MenuItemModal setOkData={setOkData} />
      ),
    }).then(newVals => this.props.addMenuItem({
      ...newVals,
      category_id: this.props.selectedSubcategory.id,
    })).then(() => {
      this.props.getMenu();
    }).catch(noop).finally(() => {
      this.props.closeDialog();
    });
  }

  editMenuItem = menuItem => {
    this.props.openDialog({
      title: 'Edit Menu Item',
      content: setOkData => (
        <MenuItemModal menuItem={menuItem} setOkData={setOkData} />
      ),
    }).then(updatedVals => {
      if (updatedVals) {
        return this.props.editMenuItem(updatedVals, menuItem.id);
      }
    }).then(() => {
      this.props.getMenu();
    }).catch(noop).finally(() => {
      this.props.closeDialog();
    });
  }

  render() {
    let listItems;

    const menuItems = get(this.props.selectedSubcategory, 'items');
    if (menuItems) {
      listItems = menuItems.map(item => (
        <div className="list-item-wrapper" key={item.id}>
          <div className="menu-item">
            <div>{item.name}</div>
            <div className="price">{(item.price / 100).toFixed(2)}</div>
            <div className="buttons">
              <Button
                round
                raised
                icon="edit"
                color="blue"
                onClick={() => this.editMenuItem(item)}
              />

              <Button
                round
                raised
                icon="delete"
                color="red"
                onClick={() => this.removeMenuItem(item.id)}
              />
            </div>
          </div>
        </div>
      ));
    }

    return (
      <List
        categoryId={this.props.selectedSubcategory && this.props.selectedSubcategory.id}
        addAction={this.addMenuItem}
        disableAdd={!menuItems}
        title="Menu Items"
        emptyText="The selected subcategory contains no items."
        noneSelectedText="Select a subcategory to view menu items."
        listItems={listItems}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getMenu: () => dispatch(getMenu()),
  removeMenuItem: menuItemId => dispatch(removeMenuItem(menuItemId)),
  addMenuItem: menuItem => dispatch(addMenuItem(menuItem)),
  editMenuItem: (menuItem, id) => dispatch(editMenuItem(menuItem, id)),
});

export default connect(null, mapDispatchToProps)(MenuItemsList);

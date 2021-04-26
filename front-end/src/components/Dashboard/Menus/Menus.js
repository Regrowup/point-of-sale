import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from '../../Modal';
import MenuItemsList from './MenuItemsList';
import MenuItemsCategoryList from './MenuItemsCategoryList';
import AddCategory from './AddCategory';
import DeleteCategory from './DeleteCategory';

class Menus extends Component {
  static propTypes = {
    menu: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
  };

  state = {
    selectedTopCategory: null,
    selectedSubcategory: null,
    dialogOpen: false,
    modal: null,
    modalProps: {},
  };

  openDialog = options => new Promise((resolve, reject) => {
    this.promiseActions = { resolve, reject };

    this.setState({
      dialogOpen: true,
      dialogContent: options.content,
      dialogTitle: options.title,
    });
  })

  closeDialog = () => {
    this.setState({
      dialogOpen: false,
      dialogContent: null,
      dialogTitle: null,
    });
  }

  openModal = (modalComponent, modalProps = {}) => {
    this.setState({ modal: modalComponent, modalProps });
  }

  closeModal = () => {
    this.openModal();
  }

  render() {
    const { selectedTopCategory, selectedSubcategory } = this.state;

    return (
      <div className="Menus-container">
        <Modal
          open={this.state.dialogOpen}
          promiseActions={this.promiseActions}
          title={this.state.dialogTitle}
        >
          {this.state.dialogContent}
        </Modal>

        {this.state.modal && (
          <this.state.modal
            closeModal={this.closeModal}
            {...this.state.modalProps}
          />
        )}

        <div className="menu-lists">
          <MenuItemsCategoryList
            addCategory={() => this.openModal(AddCategory)}
            deleteCategory={category => this.openModal(DeleteCategory, { category })}
            editCategory={category => this.openModal(AddCategory, { category })}
            categories={this.props.menu}
            selectedCategory={selectedTopCategory}
            title="Top Categories"
            itemSelected={category => this.setState({ selectedTopCategory: category })}
          />

          <MenuItemsCategoryList
            addCategory={() => this.openModal(AddCategory, { category: { top_category_id: selectedTopCategory.id } })}
            deleteCategory={category => this.openModal(DeleteCategory, { category })}
            addDisabled={!this.state.selectedTopCategory}
            editCategory={category => this.openModal(AddCategory, { category })}
            categories={selectedTopCategory && selectedTopCategory.categories}
            selectedCategory={selectedSubcategory}
            title="Subcategories"
            itemSelected={category => this.setState({ selectedSubcategory: category })}
          />

          <MenuItemsList
            openDialog={this.openDialog}
            closeDialog={this.closeDialog}
            selectedSubcategory={selectedSubcategory}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  menu: state.menu,
});

export default connect(mapStateToProps)(Menus);


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { addCategory } from '../../../store/actions';
import Textfield from '../../Textfield';
import Modal from '../../ModalPortal';
import Button from '../../Button';

class AddCategory extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    addCategory: PropTypes.func.isRequired,
    category: PropTypes.object,
  };

  static defaultProps = {
    category: null,
  };

  state = {
    name: get(this.props.category, 'name', ''),
  };

  render() {
    const topCategoryId = get(this.props.category, 'top_category_id');
    const title = `${this.props.category ? 'Edit' : 'Add'} ${topCategoryId ? 'Subcategory' : 'Top Category'}`;

    return (
      <Modal title={title}>
        <div content={1}>
          <Textfield
            value={this.state.name}
            autoComplete="off"
            id="name"
            label="Name"
            required
            maxLength={100}
            onChange={({ currentTarget }) => this.setState({ name: currentTarget.value })}
          />
        </div>

        <Button cancelButton color="red" onClick={() => this.props.closeModal()}>CANCEL</Button>
        <Button
          okButton
          color="strongBlue"
          onClick={() => {
            this.props.addCategory({
              id: get(this.props.category, 'id'),
              top_category_id: topCategoryId,
              name: this.state.name,
            });
            this.props.closeModal();
          }}
        >
          OK
        </Button>
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  addCategory,
};

export default connect(null, mapDispatchToProps)(AddCategory);

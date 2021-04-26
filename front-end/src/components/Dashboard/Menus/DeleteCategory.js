import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteCategory } from '../../../store/actions';
import Modal from '../../ModalPortal';
import Button from '../../Button';

const DeleteCategory = props => (
  <Modal title={`Remove ${props.category.top_category_id ? 'Subcategory' : 'Top Category'}`}>
    <div content={1}>
      <p>
          Are you sure you want to delete "{ props.category.name }"?
      </p>

      <p>
        Removing this category will also remove
        { !props.category.top_category_id ? ' all subcategories and ' : ' ' }
        all menu items associated with it.
      </p>
    </div>

    <Button
      cancelButton
      color="strongBlue"
      onClick={() => props.closeModal()}
    >CANCEL
    </Button>

    <Button
      okButton
      color="red"
      onClick={() => {
        props.deleteCategory(props.category);
        props.closeModal();
      }}
    >DELETE
    </Button>
  </Modal>
);

DeleteCategory.propTypes = {
  closeModal: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  deleteCategory,
};

export default connect(null, mapDispatchToProps)(DeleteCategory);

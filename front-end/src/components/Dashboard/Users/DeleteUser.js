import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { deleteUser } from '../../../store/actions';
import Modal from '../../ModalPortal';
import Button, { altColors } from '../../Button';

const NoticeBlock = styled.div`
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  color: #fff;
  background: ${altColors.red};
  border-radius: 5px;
  font-weight: 300;
`;

const DeleteUser = props => (
  <Modal title="Remove User">
    <div content={1}>
      {props.user.open_tables > 0 && (
        <NoticeBlock>
          This user has {props.user.open_tables} open table{props.user.open_tables > 1 && 's'}.
          You cannot delete a user that has open tables.
        </NoticeBlock>
      )}

      <p>
        Are you sure you want to delete "{ props.user.name }"?
      </p>

      <p>
        Deleting a user dissociates all order and payment
        information from the user; the user will no longer
        show up on the <i>Sales > User Stats</i> page.
      </p>

      <p>
        If you wish to keep user data for historical or
        accounting purposes, disable the user instead.
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
      disabled={props.user.open_tables > 0}
      onClick={() => {
        props.deleteUser(props.user);
        props.closeModal();
      }}
    >DELETE
    </Button>
  </Modal>
);

DeleteUser.propTypes = {
  closeModal: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  deleteUser,
};

export default connect(null, mapDispatchToProps)(DeleteUser);

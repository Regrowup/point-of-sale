import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/actions';
import Modal from './ModalPortal';
import Button from './Button';

const CancelWarning = () => {
  const goBack = useSelector(state => state.modalProps.goBack);
  const dispatch = useDispatch();

  return (
    <Modal title="Discard Changes">
      <section content={1}>
      You have unsent changes on your table. Select <strong>DISCARD</strong> to discard
      your changes and go back. Select <strong>CANCEL</strong> to keep your changes and
      return to the table.
      </section>

      <Button cancelButton color="strongBlue" onClick={() => dispatch(closeModal())}>CANCEL</Button>
      <Button
        okButton
        color="red"
        onClick={() => {
          goBack();
          dispatch(closeModal());
        }}
      >DISCARD
      </Button>
    </Modal>
  );
};

export default CancelWarning;

import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/actions';
import Modal from './ModalPortal';
import Button from './Button';

const CloseTableWarning = () => {
  const dispatch = useDispatch();

  return (
    <Modal title="Close Table">
      <section content={1}>
      You have unpaid orders on some of your seats. Please either <strong>remove</strong> the
      orders <strong> or send</strong> them to the kitchen before closing the table.
      </section>

      <Button okButton color="strongBlue" onClick={() => dispatch(closeModal())}>OK</Button>
    </Modal>
  );
};

export default CloseTableWarning;

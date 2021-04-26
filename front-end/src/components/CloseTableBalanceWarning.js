import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/actions';
import Modal from './ModalPortal';
import Button from './Button';

const CloseTableBalanceWarning = () => {
  const dispatch = useDispatch();

  return (
    <Modal title="Close Table">
      <section content={1}>
      You have an unpaid balance on some of your seats. Ensure the balance
      is <strong>paid</strong> before closing the table.
      </section>

      <Button okButton color="strongBlue" onClick={() => dispatch(closeModal())}>OK</Button>
    </Modal>
  );
};

export default CloseTableBalanceWarning;

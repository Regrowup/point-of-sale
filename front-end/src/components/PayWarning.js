import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/actions';
import Modal from './ModalPortal';
import Button from './Button';

const PayWarning = () => {
  const dispatch = useDispatch();

  return (
    <Modal title="Seat Payout">
      <section content={1}>
      You have unpaid orders on the seat.
      Please either <strong>remove</strong> the orders from the seat
        <strong> or send</strong> them to the kitchen before paying.
      </section>

      <Button okButton color="strongBlue" onClick={() => dispatch(closeModal())}>OK</Button>
    </Modal>
  );
};

export default PayWarning;

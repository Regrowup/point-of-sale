import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/actions';
import Modal from './ModalPortal';
import Button from './Button';

const LockedSeatWarning = () => {
  const dispatch = useDispatch();

  return (
    <Modal title="Seat Locked">
      <section content={1}>
        Seats with payments are locked. If you need to order more items, create a new seat.
      </section>

      <Button okButton color="strongBlue" onClick={() => dispatch(closeModal())}>OK</Button>
    </Modal>
  );
};

export default LockedSeatWarning;

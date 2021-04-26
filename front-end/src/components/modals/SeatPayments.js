import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import PayTable from '@/components/PayTable';
import Modal from '../ModalPortal';
import Button from '../Button';
import { formatMoney } from '@/config/utils';
import { removePayment, closeModal, openModal } from '@/store/actions';

const PaymentsTable = styled.table`
  width: 100%;
  text-align: left;
`;

const SeatPayments = () => {
  const { seat, paymentTypesById } = useSelector(state => ({
    seat: state.selectedTable.seats[state.selectedSeatIndex],
    paymentTypesById: state.paymentTypes.reduce((typesById, paymentType) => {
      typesById[paymentType.id] = paymentType.name;

      return typesById;
    }, {}),
  }));
  const dispatch = useDispatch();

  return (
    <Modal title={`Seat ${seat.number} Payments`}>
      <section content={1}>
        {seat.payments.length > 0 ? (
          <PaymentsTable>
            <thead>
              <tr>
                <th>Payment type</th>
                <th>Amount</th>
                <th>Tip</th>
                <th><span className="sr-only">Row actions</span></th>
              </tr>
            </thead>

            <tbody>
              {seat.payments.map((payment, index) => (
                <tr key={index}>
                  <td>{paymentTypesById[payment.payment_type_id]}</td>
                  <td>${formatMoney(payment.amount)}</td>
                  <td>${formatMoney(payment.tip)}</td>
                  <td style={{ display: 'flex' }}>
                    <Button
                      style={{ marginLeft: 'auto' }}
                      icon="edit"
                      round
                      color="green"
                      onClick={() => dispatch(openModal(PayTable, { payment, index }))}
                      aria-label="Edit payment"
                    />

                    <Button
                      icon="delete"
                      round
                      color="red"
                      onClick={() => dispatch(removePayment(index))}
                      aria-label="Remove payment"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </PaymentsTable>
        ) : (
          <p>
          No payment on table.
          </p>
        )}

      </section>

      <Button okButton color="strongBlue" onClick={() => dispatch(closeModal())}>CLOSE</Button>
    </Modal>
  );
};

export default SeatPayments;

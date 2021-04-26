import React from 'react';
import PropTypes from 'prop-types';
import BackspaceIcon from '../icons/ic_backspace_red_24px.svg';
import PinButtons from './PinButtons';
import PinDisplay from './PinDisplay';
import './PinModal.scss';

function PinModal({ pin, pinLength, pinUpdate, pinClear, invalidPin }) {
  return (
    <div className="PinModal-container">
      <div className="pin">
        <PinDisplay pin={pin} length={pinLength} invalidPin={invalidPin} />

        {pin.length > 0 ? (
          <img
            alt="Clear PIN"
            onClick={pinClear}
            className="clear-pin"
            src={BackspaceIcon}
          />
        ) : null}
      </div>

      <PinButtons
        disabled={pin.length === 2}
        onClick={({ currentTarget }) => {
          if (pin.length < pinLength) pinUpdate(pin + currentTarget.textContent);
        }}
      />
    </div>
  );
}

PinModal.propTypes = {
  pin: PropTypes.string.isRequired,
  pinLength: PropTypes.number.isRequired,
  pinUpdate: PropTypes.func.isRequired,
  pinClear: PropTypes.func.isRequired,
  invalidPin: PropTypes.bool.isRequired,
};

export default PinModal;

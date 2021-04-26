import React from 'react';
import PropTypes from 'prop-types';

function PinDisplay({ pin, length, invalidPin }) {
  let pins = [];
  for (let i = 0; i < length; i++) {
    pins.push(<div key={i} className={`circle ${pin[i] ? 'filled' : ''}`} />);
  }

  return (
    <div className={`pin-display ${pin.length === length && invalidPin ? 'shake' : ''}`}>{pins}</div>
  );
}

PinDisplay.propTypes = {
  pin: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  invalidPin: PropTypes.bool.isRequired,
};

export default PinDisplay;

import React from 'react';
import PropTypes from 'prop-types';
import PinButton from './PinButton';

import './PinButtons.scss';

function PinButtons({ onClick, disabled }) {
  return (
    <div className="PinButtons">
      {[1,2,3,4,5,6,7,8,9,0].map((num, i) => (
        <PinButton
          disabled={disabled}
          key={i}
          onClick={onClick}
        >
          {num}
        </PinButton>
      ))}
    </div>
  );
}

PinButtons.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default PinButtons;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const InputContiner = styled.div`
  font-size: 1rem;
  position: relative;
  margin-top: 1.75rem;
  width: 100%;

  > label {
    font-weight: 400;
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0.25rem;
    font-size: .75rem;
    transition: top 200ms;
    color: #585858;
  }

  > input:focus + label,
  > input:active + label,
  > input:valid + label,
  > input:not(:placeholder-shown) + label {
    top: -1rem;
    pointer-events: initial;
  }

  > input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #585858;
    padding: .25rem 0;
  }
`;

const Textfield = ({ id, label, wrapperClass, style, ...otherProps }) => (
  <InputContiner className={wrapperClass} style={style}>
    <input id={label || id} placeholder=" " {...otherProps} />
    <label htmlFor={label || id}>{label}</label>
  </InputContiner>
);

Textfield.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
};

Textfield.defaultProps = {
  id: '',
};

export default Textfield;

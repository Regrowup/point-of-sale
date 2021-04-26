import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import { darken } from 'polished';
import hoistNonReactStatic from 'hoist-non-react-statics';

const baseColour = 'white';
const raisedColour = '#ececec';
export const altColors = {
  red: '#ff4081',
  green: '#a5d8a5',
  strongGreen: '',
  blue: '#00bcd4',
  strongBlue: '#9595ff',
  yellow: '#ffd700',
};

// old blueStrong #3f51b5

const clickFlash = props => keyframes`
  from {
    background-color: ${darken(0.2, props.raised ? raisedColour : baseColour)};
  }
`;

const StyledButton = styled.button.attrs({
  type: props => props.type || 'button',
})`
  font-family: 'Open Sans', sans-serif;
  position: relative;
  color: #444;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  padding: 0 15px;
  border: none;
  box-shadow: none;
  transition: background 200ms;
  min-height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  text-decoration: none;

  ${props => !props.iconOnly ? css`
    > .material-icons { margin-right: 0.25rem; }
  `: ''}

  ${props => props.active ? css`
    border-bottom: 2px solid ${altColors.blue};
  `: ''}

  &.active {
    border-bottom: 2px solid ${altColors.blue};
  }

  ${props => props.round ? css`
    border-radius: 100%;
    ${props.large ? css`
      width: 56px;
      height: 56px;
    ` : css`
      width: 42px;
    `}
  ` : css`
    min-width: 85px;
    border-radius: ${props.tab ? '0' : '3px'};
  `}

  &:hover {
    background-color: ${darken(0.1, baseColour)};
  }

  ${props => props.raised ? css`
    ${(props.color === 'red' || props.color === 'blue')
    ? css`color: #fff;`
    : ''
}

    background-color: ${altColors[props.color] || raisedColour};
    border-bottom: 2px solid ${darken(0.1, altColors[props.color] || raisedColour)};
    &:hover {
      background-color: ${darken(0.1, altColors[props.color] || raisedColour)};
    }
  ` : css`
    color: ${props.color ? altColors[props.color]: '#444'};
  `}

  ${props => (props.pressed ? css`
    animation: ${clickFlash(props)} 500ms;
  ` : '')}

  ${props => props.disabled ? css`
    opacity: 0.5;
    pointer-events: none;
  ` : ''}
`;

class Button extends Component {
  static propTypes = {
    tab: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    round: PropTypes.bool,
    raised: PropTypes.bool,
    large: PropTypes.bool,
    color: PropTypes.oneOf([
      'red',
      'green',
      'strongGreen',
      'blue',
      'strongBlue',
      'yellow',
    ]),
    icon: PropTypes.string,
    children: PropTypes.node,
    to: PropTypes.string,
    activeClassName: PropTypes.string,
  };

  static defaultProps = {
    active: false,
    disabled: false,
    round: false,
    raised: false,
    large: false,
    color: null,
    tab: false,
    icon: null,
    to: null,
    activeClassName: null,
    children: null,
    onClick: null,
  };

  state = { pressed: false };

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  buttonPress = event => {
    this.setState({ pressed: true });
    this.timeoutId = setTimeout(() => {
      this.setState({ pressed: false });
    }, 500);

    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    const {
      tab,
      icon,
      children,
      ...otherProps
    } = this.props;

    const tabProps = tab ? {
      tab: true,
      role: 'tab',
      tabIndex: otherProps.active ? 0 : -1,
      'aria-selected': otherProps.active,
    } : {};

    const iconOnly = icon && !children;

    return (
      <StyledButton
        {...tabProps}
        {...otherProps}
        icon={icon}
        iconOnly={iconOnly}
        pressed={this.state.pressed}
        onClick={this.props.disabled ? null : this.buttonPress}
      >
        {icon && (
          <i className="material-icons" aria-hidden="true">{icon}</i>
        )}
        {children}
      </StyledButton>
    );
  }
}

export default hoistNonReactStatic(Button, StyledButton);

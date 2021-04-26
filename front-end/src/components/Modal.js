import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import Button from './Button';
import './Modal.scss';

class Modal extends Component {
  static propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool,
    promiseActions: PropTypes.shape({
      resolve: PropTypes.func,
      reject: PropTypes.func,
    }),
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    okLabel: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),
  };

  static defaultProps = {
    open: null,
    promiseActions: null,
    onCancel: null,
    onOk: null,
    okLabel: 'OK',
    title: '',
    children: null,
  };

  state = {
    actionOk: null,
    actionCancel: null,
  };

  componentDidMount() {
    this.setCallbacks(this.props);
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.promiseActions !== this.props.promiseActions ||
      nextProps.onOk !== this.props.onOk ||
      nextProps.onCancel !== this.props.onCancel ||
      nextProps.open !== this.props.open
    ) {
      this.setCallbacks(nextProps);
    }
  }

  setCallbacks({ promiseActions, onOk, onCancel }) {
    const actionCancel = promiseActions
      ? promiseActions.reject
      : onCancel;

    const actionOk = promiseActions
      ? promiseActions.resolve
      : onOk;

    this.setState({ actionOk, actionCancel });
  }

  render() {
    const { actionOk, actionCancel } = this.state;
    const content = this.props.children;

    if (this.props.open) {
      return (
        <div className="Modal-container">
          <div
            className="backdrop"
            role="presentation"
            onKeyPress={(event) => {
              if (event.key === 'Escape') actionCancel(event);
            }}
            onClick={actionCancel}
          />

          <div className="modal" >
            <h1 className="title">{this.props.title}</h1>

            <div className="content">
              {isFunction(content)
                ? content((data) => { this.okData = data; })
                : content
              }
            </div>

            <div className="buttons-container">
              <div className="buttons">
                {actionCancel ? (
                  <Button color="red" onClick={actionCancel}>CANCEL</Button>
                ) : null}

                {actionOk ? (
                  <Button
                    color="strongBlue"
                    onClick={() => actionOk(this.okData)}
                  >
                    {this.props.okLabel}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default Modal;

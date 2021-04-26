import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import seapig, { OPTIONAL, REQUIRED } from 'seapig';
import Button from './Button';
import './Modal.scss';

class ModalPortal extends Component {
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
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    open: null,
    promiseActions: null,
    onCancel: null,
    onOk: null,
    okLabel: 'OK',
    title: '',
  };

  modalRoot = document.getElementById('modal_container');

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

    const {
      contentChildren,
      cancelButtonChildren,
      okButtonChildren,
    } = seapig(this.props.children, {
      content: REQUIRED,
      cancelButton: OPTIONAL,
      okButton: OPTIONAL,
    });

    return ReactDom.createPortal((
      <div className="Modal-container">
        <div
          className="backdrop"
          role="presentation"
          onKeyPress={event => {
            if (event.key === 'Escape') actionCancel(event);
          }}
          onClick={actionCancel}
        />

        <section className="modal">
          <h1 className="title">{this.props.title}</h1>

          {/* <div className="content">
            {isFunction(content)
              ? content((data) => { this.okData = data; })
              : content
            }
          </div> */}
          <div className="content">
            {contentChildren}
          </div>

          <div className="buttons-container">
            <div className="buttons">
              <div className="cancel-button">{cancelButtonChildren}</div>
              <div className="ok-button">{okButtonChildren}</div>
              {/* {actionCancel ? (
                <Button color="red" onClick={actionCancel}>CANCEL</Button>
              ) : null}

              {actionOk ? (
                <Button
                  color="strongBlue"
                  onClick={() => actionOk(this.okData)}
                >
                  {this.props.okLabel}
                </Button>
              ) : null} */}
            </div>
          </div>
        </section>
      </div>
    ), this.modalRoot);
  }
}

export default ModalPortal;

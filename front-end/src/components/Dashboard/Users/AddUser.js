import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Toggle from 'react-toggle';
import styled from 'styled-components';
import Textfield from '../../Textfield';
import Modal from '../../ModalPortal';
import Button from '../../Button';
import { PIN_LENGTH } from '../../../config/constants';
import { addUser } from '../../../store/actions';

function containsOnlyIntegers(string) {
  return [...string].every(letter => '0123456789'.includes(letter));
}

const AddUserForm = styled.form`
  .toggle-group {
    display: flex;
    justify-content: space-around;
  }

  .toggle-input {
    display: flex;
    align-items: center;
    margin-top: 1.75rem;
    color: #585858;

    .toggle {
      margin-left: 1rem;
    }
  }
`;

class AddUser extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    addUser: PropTypes.func.isRequired,
    user: PropTypes.object,
    servers: PropTypes.array.isRequired,
  };

  static defaultProps = {
    user: null,
  };

  state = {
    name: get(this.props.user, 'name', ''),
    pin: get(this.props.user, 'pin', ''),
    is_admin: get(this.props.user, 'is_admin', false),
    is_disabled: get(this.props.user, 'is_disabled', false),
  };

  addUser = () => {
    this.props.addUser({
      id: get(this.props.user, 'id'),
      name: this.state.name.trim(),
      is_admin: this.state.is_admin,
      is_disabled: this.state.is_disabled,
      pin: this.state.pin,
    });
    this.props.closeModal();
  }

  setName = ({ target }) => {
    if (!this.isPropUnique('name', target.value)) {
      target.setCustomValidity('Please enter a unique name');
    } else {
      target.setCustomValidity('');
    }

    this.setState({ name: target.value });
  }

  setPin = ({ target }) => {
    if (!containsOnlyIntegers(target.value)) {
      target.setCustomValidity('Please enter a numeric value');
      return;
    }

    if (!this.isPropUnique('pin', target.value)) {
      target.setCustomValidity('Please enter a unique PIN');
    } else {
      target.setCustomValidity('');
    }

    this.setState({ pin: target.value });
  }

  isPropUnique(prop, value) {
    return this.props.servers.every(server =>
      value.toLowerCase().trim() !== server[prop].toLowerCase().trim());
  }

  render() {
    const title = `${this.props.user ? 'Edit' : 'Add'} User`;

    return (
      <Modal title={title}>
        <AddUserForm
          content={1}
          onSubmit={this.addUser}
          id="add-user-form"
          autoComplete="off"
        >
          <Textfield
            value={this.state.name}
            autoComplete="off"
            id="name"
            label="Name"
            required
            maxLength={100}
            onChange={this.setName}
          />

          <Textfield
            value={this.state.pin}
            autoComplete="off"
            id="pin"
            label="PIN"
            required
            minLength={PIN_LENGTH}
            maxLength={PIN_LENGTH}
            onChange={this.setPin}
          />

          <div className="toggle-group">
            <label className="toggle-input">
              Admin
              <Toggle
                className="toggle"
                icons={false}
                defaultChecked={!!this.state.is_admin}
                onChange={event => this.setState({ is_admin: event.target.checked })}
              />
            </label>

            <label className="toggle-input">
              Disabled
              <Toggle
                className="toggle"
                icons={false}
                defaultChecked={!!this.state.is_disabled}
                onChange={event => this.setState({ is_disabled: event.target.checked })}
              />
            </label>
          </div>
        </AddUserForm>

        <Button
          cancelButton
          color="red"
          onClick={() => this.props.closeModal()}
        >CANCEL
        </Button>

        <Button
          okButton
          color="strongBlue"
          type="submit"
          form="add-user-form"
        >OK
        </Button>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  servers: state.servers,
});

const mapDispatchToProps = {
  addUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);

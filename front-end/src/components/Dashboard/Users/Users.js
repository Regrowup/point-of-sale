import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import styled from 'styled-components';
import Report from '../Sales/Report';
import PinDisplay from './PinDisplay';
import { getServers } from '../../../store/actions';
import Button from '../../Button';
import AddUser from './AddUser';
import DeleteUser from './DeleteUser';

const UsersContainer = styled.div`
height: 100%;
  overflow: auto;

  .toggle-filter {
    display: flex;

    > .react-toggle {
      margin-left: 1rem;
    }
  }

  .totals > .total:last-child {
    margin-left: auto;
  }
`;

class Users extends Component {
  static propTypes = {
    servers: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
    getServers: PropTypes.func.isRequired,
  };

  state = {
    modal: null,
    modalProps: {},
    showDisabledUsers: true,
  };

  componentDidMount() {
    this.props.getServers();
  }

  openModal = (modalComponent, modalProps = {}) => {
    this.setState({ modal: modalComponent, modalProps });
  }

  closeModal = () => {
    this.openModal();
  }

  isActiveServer = server => !server.is_disabled

  render() {
    return (
      <UsersContainer>
        {this.state.modal && (
          <this.state.modal
            closeModal={this.closeModal}
            {...this.state.modalProps}
          />
        )}

        <Report
          data={this.state.showDisabledUsers ? this.props.servers : this.props.servers.filter(this.isActiveServer)}
          getData={this.props.getServers}
          totals={[
            {
              label: 'Total users',
              value: this.props.servers.length,
            },
            {
              label: 'Filter disabled users',
              content: (
                <label className="toggle-filter">
                  Show disabled servers
                  <Toggle
                    className="toggle"
                    icons={false}
                    checked={!!this.state.showDisabledUsers}
                    onChange={event => this.setState({ showDisabledUsers: event.target.checked })}
                  />
                </label>
              ),
            },
            {
              label: 'Add User',
              content: (
                <Button
                  raised
                  color="green"
                  icon="add"
                  onClick={() => this.openModal(AddUser)}
                >Add User
                </Button>
              ),
            },
          ]}
          columns={[
            { label: 'Name',
              value: ({ name }) => name,
            },
            {
              render: user => (
                !!user.is_disabled && <div className="tag -voided" key={`${user.id}-disabled`}>Disabled</div>
              ),
            },
            {
              render: user => (
                <Button
                  key={`${user.id}-edit`}
                  style={{ marginLeft: 'auto' }}
                  round
                  raised
                  icon="edit"
                  color="blue"
                  onClick={() => this.openModal(AddUser, { user })}
                />
              ),
            },
            {
              render: user => (
                <Button
                  key={`${user.id}-delete`}
                  style={{ marginLeft: '1rem' }}
                  round
                  raised
                  icon="delete"
                  color="red"
                  onClick={() => this.openModal(DeleteUser, { user })}
                />
              ),
            },
            {
              render: ({ pin }) => (
                <PinDisplay
                  key={pin}
                  pin={Number(pin)}
                  style={{ marginLeft: '1rem' }}
                />
              ),
            },
          ]}
        />
      </UsersContainer>
    );
  }
}

const mapStateToProps = state => ({
  servers: state.servers,
});

const mapDispatchToProps = {
  getServers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);

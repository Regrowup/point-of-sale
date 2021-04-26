import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { hot } from 'react-hot-loader';
import Tables from './Tables/Tables';
import Dashboard from './Dashboard/Dashboard';
import TableEditor from './TableEditor';
import { getServers, getMenu, setGlobalMessage, closeModal } from '@/store/actions';
import Modal from '@/components/ModalPortal';
import Button from '@/components/Button';
import Clock from '@/Clock';

const loadingSpinner = require('./loader.svg');

const LoaderBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: wait;
  z-index: 5000;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainContainer = styled.div`
  height: 100vh;
`;

class Main extends Component {
  static propTypes = {
    getMenu: PropTypes.func.isRequired,
    getServers: PropTypes.func.isRequired,
    loading: PropTypes.number.isRequired,
    menu: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedServer: PropTypes.shape({
      created_at: PropTypes.string,
      updated_at: PropTypes.string,
      name: PropTypes.string.isRequired,
      pin: PropTypes.string.isRequired,
      is_admin: PropTypes.oneOf([1, 0, true, false]),
      id: PropTypes.number.isRequired,
    }),
    servers: PropTypes.arrayOf(PropTypes.object).isRequired,
    globalMessage: PropTypes.object,
    setGlobalMessage: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    modal: PropTypes.any,
  };

  static defaultProps = {
    selectedServer: null,
    globalMessage: null,
    modal: null,
  };

  componentDidMount() {
    if (this.props.servers.length === 0) {
      this.props.getServers();
    }

    if (this.props.menu.length === 0) {
      this.props.getMenu();
    }
  }

  requireServer(props, RouteComponent) {
    return this.props.selectedServer
      ? <RouteComponent {...props} />
      : <Redirect to="/" />;
  }

  render() {
    return (
      <MainContainer>
        {this.props.modal && <this.props.modal />}

        {this.props.globalMessage && (
          <Modal title={this.props.globalMessage.title}>
            <section content={1}>{this.props.globalMessage.message}</section>
            <Button okButton color="strongBlue" onClick={() => this.props.setGlobalMessage(null)}>OK</Button>
          </Modal>
        )}

        {this.props.loading > 0
          ? <LoaderBackdrop><img src={loadingSpinner} alt="Loading content" /></LoaderBackdrop>
          : null
        }

        <Switch>
          <Route path="/" exact component={Tables} />
          <Route path="/clock" component={Clock} />
          <Route path="/table/:tableId" render={props => this.requireServer(props, TableEditor)} />
          <Route path="/dashboard" render={props => this.requireServer(props, Dashboard)} />
        </Switch>
      </MainContainer>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.loading,
  menu: state.menu,
  selectedServer: state.selectedServer,
  servers: state.servers,
  globalMessage: state.globalMessage,
  modal: state.modal,
});

const mapDispatchToProps = {
  getServers,
  getMenu,
  setGlobalMessage,
  closeModal,
};

export default hot(module)(withRouter(connect(mapStateToProps, mapDispatchToProps)(Main)));

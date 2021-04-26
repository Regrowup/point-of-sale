import React from 'react';
import PropTypes from 'prop-types';
import { Switch, NavLink, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../Button';
import Sales from './Sales/Sales';
import Menus from './Menus/Menus';
import Users from './Users/Users';
import Admin from './Admin/Admin';
import Shifts from './Shifts/Shifts';
import NavBar, { navBarHeight } from '../NavBar';
import './Dashboard.scss';

const Link = Button.withComponent(NavLink).extend.attrs({ type: null })`
  width: 8rem;
  border-radius: 0;
  height: ${navBarHeight};
`;

const Dashboard = ({ history, selectedServer, match }) => (
  /* Show some charts with http://gionkunz.github.io/chartist-js */
  <div className="Dashboard-container">
    <NavBar>
      <Button raised icon="chevron_left" onClick={() => history.push('/')}>
        Back
      </Button>

      <Link to="/dashboard/sales" style={{ marginLeft: 'auto' }}>Sales</Link>
      <Link to="/dashboard/menus">Menus</Link>
      <Link to="/dashboard/users">Users</Link>
      <Link to="/dashboard/shifts">Shifts</Link>
      <Link to="/dashboard/admin" style={{ marginRight: 'auto' }}>Admin</Link>

      <div className="server-details">
        <div className="user-info">
          <i className="material-icons" aria-hidden="true">perm_identity</i>
          <span>{selectedServer.name}</span>
        </div>
      </div>
    </NavBar>

    <div className="content-container">
      <Switch>
        <Route path={`${match.path}/menus`} component={Menus} />
        <Route path={`${match.path}/sales`} component={Sales} />
        <Route path={`${match.path}/users`} component={Users} />
        <Route path={`${match.path}/shifts`} component={Shifts} />
        <Route path={`${match.path}/admin`} component={Admin} />
        <Redirect from={match.path} to={`${match.path}/menus`} />
      </Switch>
    </div>
  </div>
);

Dashboard.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  selectedServer: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

const mapStateToProps = state => ({
  selectedServer: state.selectedServer,
});

export default connect(mapStateToProps)(Dashboard);

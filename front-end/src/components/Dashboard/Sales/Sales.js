import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Switch, Redirect, Route } from 'react-router-dom';
import Orders from './Orders';
import Payments from './Payments';
// import Inventory from './Inventory';
import ServerStats from './ServerStats';
import DateSelector from './DateSelector';
import './Sales.scss';

const Sales = ({ location, match }) => (
  <div className="Sales-container">
    <div className="submenu">
      <NavLink
        to={{
          pathname: '/dashboard/sales/orders',
          search: location.search,
        }}
        activeClassName="-selected"
        className="button"
      >
        Orders
      </NavLink>

      <NavLink
        to={{
          pathname: '/dashboard/sales/payments',
          search: location.search,
        }}
        activeClassName="-selected"
        className="button"
      >
        Payments
      </NavLink>

      {/* <NavLink
        to={{
          pathname: '/dashboard/sales/inventory',
          search: location.search,
        }}
        activeClassName="-selected"
        className="button"
      >
        Inventory
      </NavLink> */}

      <NavLink
        to={{
          pathname: '/dashboard/sales/server-stats',
          search: location.search,
        }}
        activeClassName="-selected"
        className="button"
      >
        Server Stats
      </NavLink>
    </div>

    <div className="content">
      <DateSelector />

      <Switch>
        <Route path={`${match.path}/orders`} component={Orders} />
        <Route path={`${match.path}/payments`} component={Payments} />
        <Route path={`${match.path}/server-stats`} component={ServerStats} />
        {/* <Route path={`${match.path}/inventory`} component={Inventory} /> */}
        <Redirect from={match.path} to={`${match.path}/orders`} />
      </Switch>
    </div>
  </div>
);

Sales.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  match: PropTypes.shape({ path: PropTypes.string }).isRequired,
};

export default Sales;

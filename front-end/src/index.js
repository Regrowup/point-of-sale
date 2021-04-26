import React from 'react';
import { render } from 'react-dom';
import moment from 'moment-timezone';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import './normalize.css';
import 'material-design-icons-iconfont';
import './config/global-styles';
import store from '@/store';
import axiosInit from './config/axios_config';
import Main from './components/Main';

/* Allow the use of `.finally` for promises. */
require('promise.prototype.finally').shim();

axiosInit();

moment.tz.setDefault('US/Eastern');

render(
  <Provider store={store}>
    <Router>
      <Main />
    </Router>
  </Provider>,
  document.getElementById('app')
);

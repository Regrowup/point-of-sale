import axios from 'axios';
import { saveAs } from 'file-saver';
import moment from 'moment-timezone';
import { DATE_QUERY_FORMAT } from '../config/constants';
import { formatDate } from '@/config/utils';

export const SINGLE_SEAT = Symbol('SINGLE_SEAT');
export const COMBINED = Symbol('COMBINED');
export const ALL_SEATS = Symbol('ALL_SEATS');

export const START_LOADING = 'START_LOADING';
export const startLoading = () => ({ type: START_LOADING });

export const STOP_LOADING = 'STOP_LOADING';
export const stopLoading = () => ({ type: STOP_LOADING });

export const SET_MENU_DATA = 'SET_MENU_DATA';
export const setMenuData = menuData => ({
  type: SET_MENU_DATA,
  payload: menuData,
});

export const SET_SELECTED_ITEM_INDEX = 'SET_SELECTED_ITEM_INDEX';
export const setSelectedOrderIndex = index => ({
  type: SET_SELECTED_ITEM_INDEX,
  payload: index,
});

export const SET_SELECTED_SEAT_INDEX = 'SET_SELECTED_SEAT_INDEX';
export const setSelectedSeatIndex = index => ({
  type: SET_SELECTED_SEAT_INDEX,
  payload: index,
});

export const SET_PAYMENT_TYPES_DATA = 'SET_PAYMENT_TYPES_DATA';
export const setPaymentTypesData = paymentTypesData => ({
  type: SET_PAYMENT_TYPES_DATA,
  payload: paymentTypesData,
});

export const SET_LAYOUTS = 'SET_LAYOUTS';
export const setLayouts = layouts => ({
  type: SET_LAYOUTS,
  payload: layouts,
});

export const SET_DATES = 'SET_DATES';
export const setDates = (startDate, endDate) => ({
  type: SET_DATES,
  payload: { startDate, endDate },
});

export const SET_SELECTED_LOCATION = 'SET_SELECTED_LOCATION';
export const setSelectedLocation = server => ({
  type: SET_SELECTED_LOCATION,
  payload: server,
});

export const SET_SERVERS = 'SET_SERVERS';
export const setServers = servers => ({
  type: SET_SERVERS,
  payload: servers,
});

export const SET_SHIFTS = 'SET_SHIFTS';
export const setShifts = shifts => ({
  type: SET_SHIFTS,
  payload: shifts,
});

export const SET_SELECTED_TABLE = 'SET_SELECTED_TABLE';
export const setSelectedTable = selectedTable => ({
  type: SET_SELECTED_TABLE,
  payload: selectedTable,
});

export const SET_ORDERS = 'SET_ORDERS';
export const setOrders = orders => ({
  type: SET_ORDERS,
  payload: orders,
});

export const SET_PAYMENTS = 'SET_PAYMENTS';
export const setPayments = payments => ({
  type: SET_PAYMENTS,
  payload: payments,
});


export const SET_SERVER_STATS = 'SET_SERVER_STATS';
export const setServerStats = payments => ({
  type: SET_SERVER_STATS,
  payload: payments,
});

export const SET_GLOBAL_MESSAGE = 'SET_GLOBAL_MESSAGE';
export const setGlobalMessage = options => ({
  type: SET_GLOBAL_MESSAGE,
  payload: options,
});

export const OPEN_MODAL = 'OPEN_MODAL';
export const openModal = (modal, modalProps = {}) => ({
  type: OPEN_MODAL,
  payload: { modal, modalProps },
});

export const CLOSE_MODAL = 'CLOSE_MODAL';
export const closeModal = () => ({
  type: CLOSE_MODAL,
});

export const getServers = () => async dispatch => {
  dispatch(startLoading());
  const { data: servers } = await axios.get('/servers');
  dispatch(setServers(servers));
  dispatch(stopLoading());
};

export const getMenu = () => async dispatch => {
  dispatch(startLoading());
  const [{ data: menuData }, { data: paymentTypes }] = await Promise.all([
    axios.get('/menu'),
    axios.get('/payment-types'),
  ]);
  dispatch(setMenuData(menuData));
  dispatch(setPaymentTypesData(paymentTypes));
  dispatch(stopLoading());
};

export const getLayouts = () => async dispatch => {
  dispatch(startLoading());
  const { data: layouts } = await axios.get('/layouts');
  dispatch(setLayouts(layouts));
  dispatch(stopLoading());
};

export const SET_SELECTED_SERVER = 'SET_SELECTED_SERVER';
export const setSelectedServer = server => ({
  type: SET_SELECTED_SERVER,
  payload: server,
});

export const ADD_SEAT = 'ADD_SEAT';
export const addSeat = () => ({ type: ADD_SEAT });

export const ADD_ORDER = 'ADD_ORDER';
export const addOrder = (item, order, seatIndex) => ({
  type: ADD_ORDER,
  payload: { item, order, seatIndex },
});

export const UPDATED_ITEM = 'UPDATED_ITEM';
export const updateItem = item => ({
  type: UPDATED_ITEM,
  payload: item,
});

export const REORDER_ITEM = 'REORDER_ITEM';
export const reorderItem = index => ({
  type: REORDER_ITEM,
  payload: { index },
});

export const REMOVE_ITEM = 'REMOVE_ITEM';
export const removeItem = index => ({
  type: REMOVE_ITEM,
  payload: { index },
});

export const REPLACE_ITEMS = 'REPLACE_ITEMS';
export const replaceItems = (orders, seatIndex) => ({
  type: REPLACE_ITEMS,
  payload: { orders, seatIndex },
});

export const REMOVE_SEAT = 'REMOVE_SEAT';
export const removeSeat = seatIndex => ({
  type: REMOVE_SEAT,
  payload: seatIndex,
});

export const printReadout = ({ server, shift }) => async dispatch => {
  dispatch(startLoading());
  await axios.post('/servers/print-readout', { server, shift });
  dispatch(stopLoading());
};

export const getReadout = ({ shift }) => async dispatch => {
  dispatch(startLoading());
  const { data: readout } = await axios.get(`/shifts/${shift.id}/readout`);
  dispatch(stopLoading());

  return readout;
};

export const getTable = table_id => async (dispatch, getState) => {
  dispatch(startLoading());

  let selectedTable;
  if (table_id) {
    const { data } = await axios.get(`/tables/${table_id}`);
    selectedTable = data;
  } else {
    const { selectedServer, selectedLocation } = getState();
    selectedTable = {
      seats: [{ orders: [], number: 1, payments: [] }],
      location: selectedLocation,
      server: selectedServer,
    };
  }

  dispatch(setSelectedTable(selectedTable));
  dispatch(stopLoading());
};

export const ADD_PAYMENT = 'ADD_PAYMENT';
export const addPayment = payment => ({
  type: ADD_PAYMENT,
  payload: payment,
});

export const EDIT_PAYMENT = 'EDIT_PAYMENT';
export const editPayment = (payment, index) => ({
  type: EDIT_PAYMENT,
  payload: { payment, index },
});

export const REMOVE_PAYMENT = 'REMOVE_PAYMENT';
export const removePayment = paymentIndex => ({
  type: REMOVE_PAYMENT,
  payload: paymentIndex,
});

export const orderFood = () => async (dispatch, getState) => {
  dispatch(startLoading());

  const { selectedTable } = getState();
  const { data } = await axios.post('/tables/order', { table: selectedTable });
  dispatch(setSelectedTable(data));

  dispatch(stopLoading());
};

export const closeTable = table_id => async (dispatch, getState) => {
  dispatch(startLoading());

  const { selectedTable } = getState();
  await axios.post(`/tables/${table_id || selectedTable.id}/close`);

  dispatch(stopLoading());
};

export const printReceipt = (printType = SINGLE_SEAT) => async (dispatch, getState) => {
  dispatch(startLoading());

  const { selectedTable, selectedSeatIndex } = getState();

  const seatData = {
    [SINGLE_SEAT]: selectedTable.seats[selectedSeatIndex],
    [COMBINED]: null,
    [ALL_SEATS]: selectedTable.seats,
  }[printType];

  await axios.post('/tables/seat/print', {
    table: selectedTable,
    seat: seatData,
  });
  dispatch(stopLoading());
};

export const getOrders = ({ startDate, endDate, page = 1 }) => async dispatch => {
  dispatch(startLoading());

  /* Convert dates to UTC and format to DB format for the API to consume */
  const startDateApi = startDate.clone().tz('UTC').format(DATE_QUERY_FORMAT);
  const endDateApi = endDate.clone().tz('UTC').format(DATE_QUERY_FORMAT);

  const { data: orders } = await axios.get('/orders', {
    params: { startDate: startDateApi, endDate: endDateApi, page },
  });

  dispatch(setOrders(orders));
  dispatch(stopLoading());
};

export const getPayments = ({ startDate, endDate, page = 1 }) => async dispatch => {
  dispatch(startLoading());

  /* Convert dates to UTC and format to DB format for the API to consume */
  const startDateString = startDate.clone().tz('UTC').format(DATE_QUERY_FORMAT);
  const endDateString = endDate.clone().tz('UTC').format(DATE_QUERY_FORMAT);

  const { data: payments } = await axios.get('/payments', {
    params: { startDate: startDateString, endDate: endDateString, page },
  });

  dispatch(setPayments(payments));
  dispatch(stopLoading());
};

export const getServerStats = ({ startDate, endDate, page = 1 }) => async dispatch => {
  dispatch(startLoading());

  /* Convert dates to UTC and format to DB format for the API to consume */
  const startDateString = startDate.clone().tz('UTC').format(DATE_QUERY_FORMAT);
  const endDateString = endDate.clone().tz('UTC').format(DATE_QUERY_FORMAT);

  const { data: serverStats } = await axios.get('/servers/stats', {
    params: { startDate: startDateString, endDate: endDateString, page },
  });

  dispatch(setServerStats(serverStats));
  dispatch(stopLoading());
};

export const removeMenuItem = menuItemId => async dispatch => {
  dispatch(startLoading());
  await axios.delete(`/menu/item/${menuItemId}/delete`);
  dispatch(stopLoading());
};

export const editMenuItem = (menuItem, id) => async dispatch => {
  dispatch(startLoading());
  await axios.patch(`/menu/item/${id}/edit`, menuItem);
  dispatch(stopLoading());
};

export const addMenuItem = menuItem => async dispatch => {
  dispatch(startLoading());
  await axios.post('/menu/item/add', menuItem);
  dispatch(stopLoading());
};

export const downloadDatabaseBackup = () => async dispatch => {
  dispatch(startLoading());
  const { data: backupFile } = await axios.get('/mysql_dump');

  const file = new File([backupFile], `kpos_backup_${moment().toISOString()}.sql`, { type: 'application/sql;charset=utf-8' });
  saveAs(file);

  dispatch(stopLoading());
};

export const restoreFromDatabaseBackup = file => async dispatch => {
  dispatch(startLoading());

  const formData = new FormData();
  formData.append('backup', file);

  await axios.post('/mysql_restore', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  window.location.reload(true);
};

export const addCategory = category => async dispatch => {
  dispatch(startLoading());
  await axios.post('/menu/category/add', category);
  dispatch(getMenu());
  dispatch(stopLoading());
};

export const deleteCategory = category => async dispatch => {
  dispatch(startLoading());
  await axios.delete(`/menu/${category.top_category_id ? 'sub' : 'top'}category/${category.id}`);
  dispatch(getMenu());
  dispatch(stopLoading());
};

export const deleteUser = user => async dispatch => {
  dispatch(startLoading());
  await axios.delete(`/servers/${user.id}`);
  dispatch(getServers());
  dispatch(stopLoading());
};

export const addUser = user => async dispatch => {
  dispatch(startLoading());
  await axios.post('/servers/add', user);
  dispatch(getServers());
  dispatch(stopLoading());
};

export const clockIn = server => async dispatch => {
  dispatch(startLoading());

  try {
    const { data: shift } = await axios.post('/shifts/clock-in', server);
    dispatch(setGlobalMessage({
      message: `${server.name} clocked in on ${formatDate(shift.clocked_in_at)}`,
      title: 'Clocked In',
    }));
  } catch {}

  dispatch(stopLoading());
};

export const clockOut = server => async dispatch => {
  dispatch(startLoading());

  try {
    const { data: shift } = await axios.post('/shifts/clock-out', server);
    dispatch(setGlobalMessage({
      message: `${server.name} clocked out on ${formatDate(shift.clocked_out_at)}`,
      title: 'Clocked Out',
    }));
  } catch {}

  dispatch(stopLoading());
};

export const getShifts = ({ page = 1 }) => async dispatch => {
  dispatch(startLoading());
  const { data: shifts } = await axios.get('/shifts', {
    params: { page },
  });
  dispatch(setShifts(shifts));
  dispatch(stopLoading());
};

export const editShift = shift => async dispatch => {
  dispatch(startLoading());
  const { data: shifts } = await axios.patch(`/shifts/${shift.id}`, shift);
  dispatch(setShifts(shifts));
  dispatch(stopLoading());
};

export const generateReport = ({ servers, fromDate, toDate }) => async dispatch => {
  dispatch(startLoading());

  const { data: shiftsReport } = await axios.post('/shifts/report', {
    server_ids: servers.map(server => server.id),
    from_date: fromDate.clone().tz('UTC').format(DATE_QUERY_FORMAT),
    to_date: toDate.clone().tz('UTC').format(DATE_QUERY_FORMAT),
  });
  const file = new File([shiftsReport], `shifts_report_${moment().format('LL')}.csv`, { type: 'text/csv;charset=utf-8' });
  saveAs(file);

  dispatch(stopLoading());
};

import { isString, get, uniqueId, cloneDeep } from 'lodash';
import moment from 'moment-timezone';
import update from 'immutability-helper';
import produce from 'immer';
import {
  SET_MENU_DATA,
  SET_PAYMENT_TYPES_DATA,
  SET_LAYOUTS,
  SET_SELECTED_SERVER,
  SET_SELECTED_LOCATION,
  SET_SERVERS,
  SET_SELECTED_TABLE,
  START_LOADING,
  STOP_LOADING,
  SET_ORDERS,
  SET_DATES,
  SET_PAYMENTS,
  ADD_SEAT,
  ADD_ORDER,
  REORDER_ITEM,
  REMOVE_ITEM,
  REMOVE_SEAT,
  SET_SELECTED_SEAT_INDEX,
  SET_SELECTED_ITEM_INDEX,
  REPLACE_ITEMS,
  UPDATED_ITEM,
  ADD_PAYMENT,
  EDIT_PAYMENT,
  SET_SERVER_STATS,
  SET_GLOBAL_MESSAGE,
  SET_SHIFTS,
  REMOVE_PAYMENT,
  OPEN_MODAL,
  CLOSE_MODAL
} from './actions';

const disableAuth = isString(process.env.DISABLE_AUTH) &&
  JSON.parse(process.env.DISABLE_AUTH.toLowerCase()) === true;

let selectedServer = null;
if (disableAuth) {
  selectedServer = {
    created_at: '1993-02-24 22:10:28',
    updated_at: '2017-07-23 22:10:28',
    name: 'TestUser',
    pin: '12',
    is_admin: 1,
    id: 2,
  };
}

export const SEARCH_QUERY_FORMAT = 'Y-MM-D';

const searchParams = new URLSearchParams(window.location.search);

const startDate = searchParams.get('startDate')
  ? moment(searchParams.get('startDate'), SEARCH_QUERY_FORMAT)
  : moment();
const endDate = searchParams.get('endDate')
  ? moment(searchParams.get('endDate'), SEARCH_QUERY_FORMAT)
  : moment();

const initialState = {
  loading: 0,
  servers: [],
  selectedServer,
  selectedLocation: null,
  layouts: [],
  selectedLayoutIndex: 0,
  selectedSeatIndex: 0,
  selectedOrderIndex: null,
  menu: [],
  custom_id: null,
  mod_id: null,
  paymentTypes: [],
  selectedTable: null,
  unmodifiedTable: null,
  sales: {
    startDate: startDate.startOf('day'),
    endDate: endDate.endOf('day'),
    inventory: [],
    orders: {},
    payments: {},
    serverStats: {},
  },
  shifts: {},
  globalMessage: null,
  modal: null,
  modalProps: {},
};

export default function reducer(state = initialState, { type, payload }) {
  function newSeat(seat) {
    return {
      orders: [],
      payments: [],
      number: get(state.selectedTable, 'seats.length', 0) + 1,
      ...seat,
    };
  }

  switch (type) {
    case START_LOADING: {
      return { ...state, loading: state.loading + 1 };
    }

    case STOP_LOADING: {
      return { ...state, loading: Math.max(state.loading - 1, 0) };
    }

    case SET_MENU_DATA: {
      return {
        ...state,
        menu: payload.menu,
        custom_id: payload.custom_id,
        mod_id: payload.mod_id,
      };
    }

    case SET_PAYMENT_TYPES_DATA: {
      return { ...state, paymentTypes: payload };
    }

    case SET_LAYOUTS: {
      return { ...state, layouts: payload };
    }

    case SET_SELECTED_SERVER: {
      return { ...state, selectedServer: payload };
    }

    case SET_SELECTED_LOCATION: {
      return { ...state, selectedLocation: payload };
    }

    case SET_SERVERS: {
      return { ...state, servers: payload };
    }

    case SET_SHIFTS: {
      return { ...state, shifts: payload };
    }

    case SET_SELECTED_TABLE: {
      return {
        ...state,
        selectedTable: payload,
        unmodifiedTable: payload,
      };
    }

    case SET_DATES: {
      return {
        ...state,
        sales: {
          ...state.sales,
          startDate: payload.startDate,
          endDate: payload.endDate,
        },
      };
    }

    case SET_ORDERS: {
      return {
        ...state,
        sales: {
          ...state.sales,
          orders: payload,
        },
      };
    }

    case SET_PAYMENTS: {
      return {
        ...state,
        sales: {
          ...state.sales,
          payments: payload,
        },
      };
    }

    case SET_SERVER_STATS: {
      return {
        ...state,
        sales: {
          ...state.sales,
          serverStats: payload,
        },
      };
    }

    case ADD_SEAT: {
      return update(state, {
        selectedTable: { seats: { $push: [newSeat()] } },
        selectedSeatIndex: { $set: state.selectedTable.seats.length },
      });
    }

    case ADD_ORDER: {
      /* Prevent adding orders to seats with payments */
      if (state.selectedTable.seats[state.selectedSeatIndex].payments.length > 0) {
        return state;
      }

      const { item, order, seatIndex } = payload;
      const newItem = {
        item,
        price: item.price,
        name: item.name,
        key: uniqueId('new_'),
        ...order,
      };

      return update(state, {
        selectedTable: { seats: { [seatIndex != null ? seatIndex : state.selectedSeatIndex]: { orders: { $push: [newItem] } } } },
      });
    }

    case REMOVE_ITEM: {
      const { index } = payload;
      return update(state, {
        selectedTable: { seats: { [state.selectedSeatIndex]: { orders: { $splice: [[index, 1]] } } } },
      });
    }

    case REORDER_ITEM: {
      const { index } = payload;
      const newOrder = cloneDeep(state.selectedTable.seats[state.selectedSeatIndex].orders[index]);
      newOrder.key = uniqueId('new_');
      newOrder.id = null;

      return update(state, {
        selectedTable: { seats: { [state.selectedSeatIndex]: { orders: { $push: [newOrder] } } } },
      });
    }

    case REPLACE_ITEMS: {
      const { orders, seatIndex } = payload;

      return update(state, {
        selectedTable: { seats: { [seatIndex]: { orders: { $set: orders } } } },
      });
    }

    case REMOVE_SEAT: {
      /**
       * If the seat we are removing is the currently selected one, select the
       * next available seat. If there is only one seat, create a new empty seat
       * after removing the current one.
       */
      let newSeatIndex;
      const seatToRemove = payload || state.selectedSeatIndex;
      if (seatToRemove === state.selectedSeatIndex) {
        newSeatIndex = Math.max(state.selectedSeatIndex - 1, 0);
      } else {
        newSeatIndex = payload < state.selectedSeatIndex
          ? payload
          : state.selectedSeatIndex;
      }

      return update(state, {
        selectedTable: { seats: {
          $splice: [
            state.selectedTable.seats.length === 1
              ? [seatToRemove, 1, newSeat({ number: 1 })]
              : [seatToRemove, 1],
          ],
        } },
        selectedSeatIndex: { $set: newSeatIndex },
      });
    }

    case SET_SELECTED_SEAT_INDEX: {
      return { ...state, selectedSeatIndex: payload };
    }

    case SET_SELECTED_ITEM_INDEX: {
      return { ...state, selectedOrderIndex: payload };
    }

    case UPDATED_ITEM: {
      return update(state, {
        selectedTable: { seats: { [state.selectedSeatIndex]: { orders: {
          [state.selectedOrderIndex]: { $merge: payload },
        } } } },
      });
    }

    case ADD_PAYMENT: {
      return produce(state, draft => {
        const seat = draft.selectedTable.seats[state.selectedSeatIndex];

        if (seat.payments) {
          seat.payments.push(payload);
        } else {
          seat.payments = [payload];
        }
      });
    }

    case EDIT_PAYMENT: {
      return produce(state, draft => {
        const seat = draft.selectedTable.seats[state.selectedSeatIndex];
        const { payment, index } = payload;

        seat.payments[index] = payment;
      });
    }

    case SET_GLOBAL_MESSAGE: {
      return { ...state, globalMessage: payload };
    }

    case REMOVE_PAYMENT: {
      return produce(state, draft => {
        const seat = draft.selectedTable.seats[state.selectedSeatIndex];
        seat.payments.splice(payload, 1);
      });
    }

    case OPEN_MODAL: {
      return {
        ...state,
        modal: payload.modal,
        modalProps: payload.modalProps,
      };
    }

    case CLOSE_MODAL: {
      return { ...state, modal: null, modalProps: {} };
    }

    default: {
      return state;
    }
  }
}

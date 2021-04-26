import axios from 'axios';
import { get } from 'lodash';
import store from '@/store';
import { setGlobalMessage, stopLoading } from '@/store/actions';

export default function axiosInit() {
  axios.defaults.baseURL = process.env.API_URL;

  axios.interceptors.response.use(response => response, error => {
    const defaultErrorMessage = 'An unknown error has occured.';
    const errorMessage = get(error, 'response.data.message', defaultErrorMessage);

    store.dispatch(stopLoading());
    store.dispatch(setGlobalMessage({ message: errorMessage, title: 'Oops...' }));
  });
}

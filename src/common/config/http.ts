import axios, { AxiosResponse } from 'axios';
import { AppDispatch } from '../store';
import { apiError } from '../../modules/application/Slice';

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

httpClient.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const token = window.localStorage.getItem('user_token');
      config.withCredentials = !!token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error),
);

export const ConfigureGlobalError = (dispatch: AppDispatch): void => {
  httpClient.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors: string[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const prop of Object.keys(error.response.data.errors)) {
          // eslint-disable-next-line no-loop-func
          error.response.data.errors[prop].forEach((element: string) => {
            apiErrors.push(element);
          });
        }
        dispatch(apiError(apiErrors));
      } else {
        throw error;
      }
    },
  );
};

export const IsValidResponse = (response: AxiosResponse): boolean => {
  return response && (response.status === 200 || response.status === 201);
};

export const HasErrorName = (
  response: AxiosResponse,
  name: string,
): boolean => {
  return (
    response &&
    response.data &&
    response.data.errors &&
    response.data.errors[name]
  );
};

export const GetErrorStr = (response: AxiosResponse, name: string): string => {
  return response.data.errors[name].join(', ');
};

export default httpClient;

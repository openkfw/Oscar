import axios from 'axios';

export const axiosMiddlewareOptions = {
  interceptors: {},
  returnRejectedPromiseOnError: true,
};

export const axiosClient = () => {
  return axios.create({});
};

import axios from 'axios';
import { getToken } from '@/helpers/token';

const domain = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:80';

const getURL = (path) => {
  return `${domain}${path}`;
};

export const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
};

export const post = (url, data = {}) => {
  return axios.post(getURL(url), data, {
    headers: getHeaders(),
  });
};

export const del = (url) => {
  return axios.delete(getURL(url), {
    headers: getHeaders(),
  });
};

export const get = (url, data = {}) => {
  return axios.get(getURL(url), {
    params: data,
    headers: getHeaders(),
  })
};

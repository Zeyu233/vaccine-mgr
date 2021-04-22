import {
  del, post, get
} from '@/helpers/request';

export const add = (form) => {
  return post(
    '/vaccine/add',
    form,
  );
};

export const list = (data) => {
  return get(
    '/vaccine/list',
    data
  );
};
export const listOrd = (data) => {
  return get(
    '/vaccine/listOrd',
    data
  );
};

export const remove = (id) => {
  return del(
    `/vaccine/${id}`,
  );
};

export const updateCount = (data = {}) => {
  return post(
    `/vaccine/update/count`,
    data,
  );
};

export const update = (data = {}) => {
  return post(
    `/vaccine/update`,
    data,
  );
};

export const detail = (id) => {
  return get(
    `/vaccine/detail/${id}`,
  );
};

export const addMany = (key) => {
  return post('/vaccine/addMany', {
    key,
  });
};

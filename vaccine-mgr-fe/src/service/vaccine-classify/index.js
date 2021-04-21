import {
  del, post, get
} from '@/helpers/request';

export const add = (title) => {
  return post('/vaccine-classify/add', {
    title,
  });
};

export const list = () => {
  return get('/vaccine-classify/list');
};

export const remove = (id) => {
  return del(`/vaccine-classify/${id}`);
};

export const updateTitle = (id, title) => {
  return post('/vaccine-classify/update/title', {
    id,
    title,
  });
};

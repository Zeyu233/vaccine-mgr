import { defineComponent, reactive, watch } from 'vue';
import { vaccine } from '@/service';
import { message } from 'ant-design-vue';
import { result, clone } from '@/helpers/utils';
import moment from 'moment';
import store from '@/store';

export default defineComponent({
  props: {
    show: Boolean,
    vaccine: Object,
  },
  setup(props, context) {
    const editForm = reactive({
      name: '',
      price: 0,
      producedDate: '',
      expirationDate: 0,
      classify: '',
    });

    const close = () => {
      context.emit('update:show', false);
    };

    watch(() => props.vaccine, (current) => {
      Object.assign(editForm, current);
      editForm.producedDate = moment(Number(editForm.producedDate));
    });

    const submit = async () => {
      const res = await vaccine.update({
        id: props.vaccine._id,
        name: editForm.name,
        price: editForm.price,
        expirationDate: editForm.expirationDate,
        producedDate: editForm.producedDate.valueOf(),
        classify: editForm.classify,
      });

      result(res)
        .success(({ data, msg }) => {
          context.emit('update', data);
          message.success(msg);
          close();
        });
    };

    return {
      editForm,
      submit,
      props,
      close,
      store: store.state,
    };
  },
});

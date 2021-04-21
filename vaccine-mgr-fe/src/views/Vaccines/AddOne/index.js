import { defineComponent, reactive } from 'vue';
import { vaccine } from '@/service';
import { message } from 'ant-design-vue';
import store from '@/store';
import { result, clone } from '@/helpers/utils';

const defaultFormData = {
  name: '',
  price: 0,
  producedDate: 0,
  expirationDate: 0,
  classify: '',
  count: '',
};

export default defineComponent({
  props: {
    show: Boolean,
  },
  setup(props, context) {
    const addForm = reactive(clone(defaultFormData));

    if (store.state.vaccineClassify.length) {
      addForm.classify = store.state.vaccineClassify[0]._id;
    }

    const close = () => {
      context.emit('update:show', false);
    };

    const submit = async () => {
      const form = clone(addForm);
      form.producedDate = addForm.producedDate.valueOf();
      const res = await vaccine.add(form);

      result(res)
        .success((d, { data }) => {
          Object.assign(addForm, defaultFormData);
          message.success(data.msg);

          context.emit('getList');

          close();
        });
    };

    return {
      addForm,
      submit,
      props,
      close,
      store: store.state,
    };
  },
});

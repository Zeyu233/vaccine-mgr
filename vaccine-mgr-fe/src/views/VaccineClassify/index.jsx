import { defineComponent, ref, onMounted } from 'vue';
import { vaccineClassify } from '@/service';
import { result } from '@/helpers/utils';
import { message, Modal, Input } from 'ant-design-vue';

const columns = [
  {
    title: '分类',
    dataIndex: 'title',
  },
  {
    title: '操作',
    slots: {
      customRender: 'actions',
    },
  },
];

export default defineComponent({
  setup() {
    const title = ref('');
    const list = ref([]);

    const getList = async () => {
      const res = await vaccineClassify.list();

      result(res)
        .success(({ data }) => {
          list.value = data;
        });
    };

    const add = async () => {
      const res = await vaccineClassify.add(title.value);

      result(res)
        .success(() => {
          getList();
          title.value = '';
        });
    };

    onMounted(() => {
      getList();
    });

    const remove = async ({ _id }) => {
      const res = await vaccineClassify.remove(_id);

      result(res)
        .success(({ msg }) => {
          message.success(msg);

          getList();
        });
    };

    const updateTitle = async ({ _id }) => {
      Modal.confirm({
        title: '请输入新的分类名称',
        content: (
          <div>
            <Input class="__vaccine_classify_new_title" />
          </div>
        ),
        onOk: async () => {
          const title = document.querySelector('.__vaccine_classify_new_title').value;

          const res = await vaccineClassify.updateTitle(_id, title);

          result(res)
            .success(({ msg }) => {
              message.success(msg);

              list.value.forEach((item) => {
                if (item._id === _id) {
                  item.title = title;
                }
              });
            });
        },
      });
    };

    return {
      add,
      title,
      list,
      columns,
      remove,
      updateTitle,
    };
  },
});

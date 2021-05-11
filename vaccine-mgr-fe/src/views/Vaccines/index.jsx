import { defineComponent, ref, onMounted } from 'vue';
import { vaccine, vaccineClassify } from '@/service';
import { useRouter } from 'vue-router';
import { message, Modal, Input } from 'ant-design-vue';
import { result, formatTimestamp } from '@/helpers/utils';
import { getHeaders } from '@/helpers/request';
import { getClassifyTitleById } from '@/helpers/vaccine-classify';
import AddOne from './AddOne/index.vue';
import _ from '@/config/common';
import Update from './Update/index.vue';

export default defineComponent({
  components: {
    AddOne,
    Update,
  },
  props: {
    simple: Boolean,
  },
  setup(props) {
    const router = useRouter();

    const columns = [
      {
        title: `${_.KEYWORD}名`,
        dataIndex: 'name',
      },
      {
        title: '保质期',
        dataIndex: 'expirationDate',
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        title: '库存',
        slots: {
          customRender: 'count',
        },
      },
      {
        title: '生产日期',
        dataIndex: 'producedDate',
        slots: {
          customRender: 'producedDate',
        },
      },
      {
        title: '分类',
        slots: {
          customRender: 'classify',
        },
      },
    ];

    if (!props.simple) {
      columns.push({
        title: '操作',
        slots: {
          customRender: 'actions',
        },
      });
    }

    const show = ref(false);
    const showUpdateModal = ref(false);
    const list = ref([]);
    const total = ref(0);
    const curPage = ref(1);
    const keyword = ref('');
    const isSearch = ref(false);
    const editVaccine = ref({});

    // 获取疫苗列表
    const getList = async () => {
      const res = await vaccine.list({
        page: curPage.value,
        size: 10,
        keyword: keyword.value,
      });

      result(res)
        .success(({ data }) => {
          const { list: l, total: t } = data;
          list.value = l;
          total.value = t;
        });
    };

    onMounted(async () => {
      getList();
    });

    // 设置页码
    // 切页
    const setPage = (page) => {
      curPage.value = page;

      getList();
    };

    // 触发搜索
    const onSearch = () => {
      getList();

      // 字符串非空的时候 -> true
      // 字符串为空的时候 -> false
      isSearch.value = Boolean(keyword.value);
    };

    // 回到全部列表
    const backAll = () => {
      keyword.value = '';
      isSearch.value = false;

      getList();
    };

    // 删除
    const remove = async ({ text: record }) => {
      const { _id } = record;

      const res = await vaccine.remove(_id);

      result(res)
        .success(({ msg }) => {
          message.success(msg);

          getList();
        });
    };

    const updateCount = (type, record) => {
      let word = '增加';

      if (type === 'OUT_COUNT') {
        word = '减少';
      }

      Modal.confirm({
        title: `要${word}多少库存`,
        content: (
          <div>
            <Input class="__vaccine_input_count" />
          </div>
        ),
        onOk: async () => {
          const el = document.querySelector('.__vaccine_input_count');
          let num = el.value;
  　　　　if (!(/(^[1-9]\d*$)/.test(num))) { 
              message.error("输入的不是正整数"); 
              return; 
    　　　}

          const res = await vaccine.updateCount({
            id: record._id,
            num,
            type,
          });

          result(res)
            .success((data) => {
              if (type === 'IN_COUNT') {
                // 入库操作
                num = Math.abs(num);
              } else {
                // 出库操作
                num = -Math.abs(num);
              }

              const one = list.value.find((item) => {
                return item._id === record._id;
              });

              if (one) {
                // console.log(num);
                one.count = one.count + num;

                message.success(`成功${word} ${Math.abs(num)} 件`);
              }
            });
        },
      });
    };

    // 显示更新弹框
    const update = ({ record }) => {
      showUpdateModal.value = true;
      editVaccine.value = record;
    };

    // 更新列表的某一行数据
    const updateCurVaccine = (newData) => {
      Object.assign(editVaccine.value, newData);
    };

    // 进入详情页
    const toDetail = ({ record }) => {
      router.push(`/vaccines/${record._id}`);
    };

    const onUploadChange = ({ file }) => {
      if (file.response) {
        result(file.response)
          .success(async (key) => {
            const res = await vaccine.addMany(key);

            result(res)
              .success(({ data: { addCount } }) => {
                message.success(`成功添加 ${addCount} 件`);

                getList();
              });
          });
      }
    };

    return {
      columns,
      show,
      list,
      formatTimestamp,
      curPage,
      total,
      setPage,
      keyword,
      onSearch,
      backAll,
      isSearch,
      remove,
      updateCount,
      showUpdateModal,
      update,
      editVaccine,
      updateCurVaccine,
      toDetail,
      getList,
      getClassifyTitleById,
      simple: props.simple,
      onUploadChange,
      headers: getHeaders(),
    };
  },
});

import { defineComponent, reactive } from 'vue';
import { profile } from '@/service';
import { message } from 'ant-design-vue';
import { result } from '@/helpers/utils';

export default defineComponent({
  setup() {
    const form = reactive({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });

    const resetPassword = async () => {
      const {
        confirmNewPassword,
        newPassword,
        oldPassword,
      } = form;

      if (confirmNewPassword !== newPassword) {
        message.error('两次输入密码不同');
        return;
      }
      var reg = /^[\w]{6,12}$/
      if(!newPassword.match(reg)){
          message.error("密码只能为6-12位，只能是字母、数字和下划线");
          return;
      } 

      const res = await profile.resetPassword(
        newPassword,
        oldPassword,
      );

      result(res)
        .success(({ msg }) => {
          message.success(msg);

          form.oldPassword = '';
          form.confirmNewPassword = '';
          form.newPassword = '';
        });
    };

    return {
      form,
      resetPassword,
    };
  },
});

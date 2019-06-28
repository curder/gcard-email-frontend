<template>
  <transition name="fade">
    <div class="flex justify-center items-center min-h-screen" v-show="open">
      <div class="absolute inset-0 bg-black opacity-25"></div>
      <div class="w-1/2 border px-8 pt-16 pb-8 rounded-lg bg-white z-10">
        <div class="text-gray-700">请留下您的邮箱地址，商城将为您发送，获取LUMO商城购买Gcard充值卡，具体操作流程的，指导说明文档。</div>
        <form class="mt-8" @submit.prevent="submitHandle">
          <label class="block flex items-center">
            <span class="text-gray-700 font-bold">邮箱地址：</span>
            <input v-model="form.email" class="form-input block ml-2 flex-1" placeholder="请输入您的接收邮箱">
          </label>
          <div class="border-t border-gray-200 pt-6 mt-12 flex items-center justify-between">
            <button type="button"
                    @click="open = false"
                    class="px-4 py-1 border border-gray-400 rounded text-gray-700 hover:bg-gray-200 focus:outline-none">
              撤销操作
            </button>

            <progress-button
              class="border-blue-600 bg-blue-500 px-4 py-1 rounded text-white hover:bg-blue-600 hover:border-blue-700 focus:outline-none"
              :disable="processing"
              type="submit"
              :processing="processing">
              提交邮箱
            </progress-button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>
<script>
import Form from "form-backend-validation";
import ProgressButton from './commons/ProgressButton.vue';

export default {

  components: {
    ProgressButton,
  },

  props: {
    action: {
      type: String,
      required: true,
    },

  },

  data() {
    return {
      form: new Form({
        request_name: '提交邮箱获取引导邮件',
        request_url: window.location.href,
        email: ''
      }),

      processing: false,
      open: true,
    };
  },

  methods: {
    async submitHandle() {
      try {
        this.processing = true;
        this.showProcessingDialog();
        let response = await this.form.post(this.action);
        this.showSuccessDialog();
        this.processing = false;
        this.open = false; // 关闭自己
      } catch (error) {
        let errors = error.response.data;
        this.showFailDialog(errors, errors.code);
        this.processing = false;
      }
    },

    showFailDialog(errors, error_code) { // 提交失败
      return this.$swal({
        toast: false,
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: '关闭',
        type: 'error',
        titleText: '提交失败！',
        html: error_code ? `错误代码：${error_code}，请联系在线客服。` : errors.errors.email[0],
        allowOutsideClick: false,
      });
    },

    showProcessingDialog() { // 提交中
      return this.$swal({
        toast: false,
        position: 'center',
        showConfirmButton: false,
        type: 'info', // warning, error, success, info, and question
        html: '处理中，请等待......',
        allowOutsideClick: false,
      });
    },

    showSuccessDialog() { // 提交成功
      return this.$swal({
        toast: false,
        position: 'center',
        showConfirmButton: false,
        timer: 5000,
        type: 'warning', // warning, error, success, info, and question
        titleText: '提交成功',
        html: '请您稍后查收邮件，如没有收到请联系在线客服。',
        allowOutsideClick: false,
      });
    }

  },
};
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

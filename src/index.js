import './assets/css/main.css';
import SweetAlert2 from 'vue-sweetalert2';
import SendEmailForm from './components/SendEmailForm.vue';
import EmailManager from './components/EmailManager.vue';

const Plugin = {
  install(Vue, params = {}) {
    Vue.use(SweetAlert2);

    Vue.component('gcard-email-form', SendEmailForm);
    Vue.component('gcard-email-manager', EmailManager);
  }
};

export default Plugin;

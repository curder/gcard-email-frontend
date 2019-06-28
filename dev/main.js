import Vue from 'vue';
import App from './App.vue'

import SendEmailForm from '../src/index.js';
Vue.use(SendEmailForm);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

import Vue from 'vue'
import App from './App.vue'
import router from './router';
import BootstrapVue from 'bootstrap-vue'
import VueAxios from "vue-axios";
import axios from "axios";
import VueSocketIO from 'vue-socket.io'
import VueSvgGauge from 'vue-svg-gauge'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from '@/plugins/vuetify'
import HighchartsVue from 'highcharts-vue'
import Vuex from 'vuex'
import VueApexCharts from 'vue-apexcharts'


Vue.use(vuetify, {
  iconfont: 'mdi'
})

Vue.use(new VueSocketIO({
  connection: 'http://10.0.1.67:5000/',
}))

Vue.use(VueApexCharts)
Vue.use(HighchartsVue)
Vue.use(VueSvgGauge)
Vue.use(BootstrapVue)
Vue.use(Vuex)


Vue.component('apexchart', VueApexCharts)


const store = new Vuex.Store({
  state: {
    menu: false,
    alert: {type: "", text: ""},
  },
  mutations: {
    showMenu: state => state.menu = !state.menu,
    hideMenu: state => state.menu = false,
    set_alert: (state, alert ) => {
      state.alert.type = alert.type
      state.alert.text = alert.text
    }
  },
  actions:{
    showAlert(context, alert ) {
      return new Promise((resolve) => {
        context.commit('set_alert', alert)
        resolve(true)
      })
    }
  }
});

Vue.config.productionTip = false

Vue.router = router;
App.router = Vue.router;

const instance = axios.create({
  baseURL: "http://localhost:5000/",
  params: {}
});
Vue.use(VueAxios, instance);

new Vue({
  render: h => h(App),
  vuetify,
  router,
  store,
}).$mount('#app')

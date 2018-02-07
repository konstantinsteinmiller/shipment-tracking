import Vue from 'vue'
import App from './Apps'
import router from './router'
import icons from './icons/index.styl'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

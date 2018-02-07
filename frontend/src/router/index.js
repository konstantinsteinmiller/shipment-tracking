import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import ShippingStatus from '@/components/ShippingStatus'
import Admin from '@/components/Admin'
// import ShippingHistory from '@/components/ShippingHistory'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/shipping-status',
      name: 'ShippingStatus',
      component: ShippingStatus
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }/*,
    {
      path: '/history',
      name: 'ShippingHistory',
      component: ShippingHistory
    }*/
  ]
})

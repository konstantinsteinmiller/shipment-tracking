import Vue from 'vue'
import Router from 'vue-router'
import Tracking from '@/components/Tracking'
import UpdateStatus from '@/components/UpdateStatus'
import Admin from '@/components/Admin'
// import ShippingHistory from '@/components/ShippingHistory'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/tracking',
      name: 'Tracking',
      component: Tracking
    },
    {
      path: '/update-status',
      name: 'UpdateStatus',
      component: UpdateStatus
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})

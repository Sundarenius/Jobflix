import Vue from 'vue'
import Router from 'vue-router'
import Notifikationer from '@/components/notifikationer'
import Business from '@/components/business'
import Applicants from '@/components/applicants'
import Payments from '@/components/payments'
import Meetings from '@/components/meetings'
import Presentations from '@/components/presentations'
import Forsaljning from '@/components/forsaljning'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Notifikationer },
    { path: '/business', component: Business, beforeEnter: AuthGuard },
    { path: '/applicants', component: Applicants, beforeEnter: AuthGuard },
    { path: '/payments', component: Payments, beforeEnter: AuthGuard },
    { path: '/meetings', component: Meetings, beforeEnter: AuthGuard },
    { path: '/presentations', component: Presentations, beforeEnter: AuthGuard },
    { path: '/salj', component: Forsaljning, beforeEnter: AuthGuard }
  ]
})

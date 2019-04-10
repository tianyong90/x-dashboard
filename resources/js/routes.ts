import dashboard from './pages/dashboard.vue'
import error from './pages/error404.vue'

const routes = [
  {
    path: '/',
    component: dashboard,
    meta: {
      title: '主页',
    },
  },
  {
    path: '*',
    component: error,
    meta: {
      title: '404',
    },
  },
]

export default routes

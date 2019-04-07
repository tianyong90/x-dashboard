import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI, { Loading } from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index'
import routes from './routes.js'
import config from './config' // 配置
import { mapState } from 'vuex'
import Topmenu from './components/topmenu.vue'
import Sidebar from './components/sidebar.vue'

Vue.config.productionTip = false

axios.defaults.baseURL = config.apiRoot
axios.defaults.timeout = config.timeout

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
})

router.beforeEach((to, from, next) => {
  store.commit('UPDATE_LOADING', true)

  next()
})

router.afterEach(() => {
  store.commit('UPDATE_LOADING', false)
})

// axios 请求发送前处理
axios.interceptors.request.use(
  axiosConfig => {
    store.commit('UPDATE_LOADING', true)

    const token = window.localStorage.getItem(config.authTokenKey)
    axiosConfig.headers.Authorization = 'Bearer ' + token

    return axiosConfig
  },
  error => {
    return Promise.reject(error)
  }
)

// axios 得到响应后处理
axios.interceptors.response.use(
  response => {
    store.commit('UPDATE_LOADING', false)

    const newToken = response.headers.authorization
    if (newToken) {
      window.localStorage.setItem(config.authTokenKey, newToken.replace('Bearer ', ''))
    }

    return response
  },
  error => {
    store.commit('UPDATE_LOADING', false)

    // TODO
    // if (error.response) {
    //   const newToken = error.response.headers.authorization
    //   if (newToken) {
    //     window.localStorage.setItem(config.userKey, newToken.replace('bearer ', ''))
    //   }
    //
    //   if (error.response.status === 401) {
    //     window.localStorage.removeItem(config.userKey)
    //
    //     router.push('/login')
    //   } else if (error.response.status === 403) {
    //     // 无权限时统一提示
    //     app.error('无操作权限')
    //     return
    //   }
    // } else {
    //   // 请求超时提示
    //   if (error.code === 'ECONNABORTED') {
    //     app.error('网络超时，请重试')
    //   }
    // }

    return Promise.reject(error)
  }
)

const app = new Vue({
  el: '#app',

  router,

  // vuex store
  store,

  computed: {
    ...mapState({
      topmenuVisible: state => state.topmenuVisible,
      sidebarVisible: state => state.sidebarVisible,
      isLoading: state => state.isLoading,
    }),
  },

  data: {
    loadingInstance: null,
  },

  components: {
    topmenu: Topmenu,
    sidebar: Sidebar,
  },

  created () {
    //
  },

  methods: {
    success (msg) {
      this.$message({
        message: msg,
        type: 'success',
        duration: 1000,
      })
    },

    warning (msg) {
      this.$message({
        message: msg,
        type: 'warning',
        duration: 1000,
      })
    },

    info (msg) {
      this.$message({
        message: msg,
        type: 'info',
        duration: 1000,
      })
    },

    error (msg) {
      this.$message({
        message: msg,
        type: 'error',
        duration: 2000,
      })
    },

    confirm (msg, title) {
      return this.$confirm(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    },
  },

  watch: {
    isLoading: function (value) {
      if (value) {
        this.loadingInstance = Loading.service({
          text: 'Loading',
          customClass: 'my-loading-mask',
        })
      } else {
        this.loadingInstance && this.loadingInstance.close()
      }
    },
  },

  destroy () {
    this.loadingInstance = null
  },
})

import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index'
import routes from './routes'
import config from './config' // 配置
import { mapState } from 'vuex'
import Topmenu from './components/topmenu.vue'
import ElementUI from 'element-ui'

Vue.config.productionTip = false

axios.defaults.baseURL = config.apiRoot
axios.defaults.timeout = config.timeout

Vue.use(ElementUI)
Vue.use(VueRouter)
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
      window.localStorage.setItem(
        config.authTokenKey,
        newToken.replace('Bearer ', '')
      )
    }

    return response
  },
  error => {
    store.commit('UPDATE_LOADING', false)

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
  },

  created () {
    //
  },

  methods: {},

  watch: {},

  destroy () {
    this.loadingInstance = null
  },
})

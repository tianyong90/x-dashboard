import axios from 'axios'
import config from './config' // 配置
import '../sass/app.scss'
import 'antd/dist/antd.css'
import React from 'react'
import { render } from 'react-dom'

import App from './app'

axios.defaults.baseURL = config.apiRoot
axios.defaults.timeout = config.timeout

// axios 请求发送前处理
axios.interceptors.request.use(
  axiosConfig => {
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
    return Promise.reject(error)
  }
)

render(<App/>, document.getElementById('root'))

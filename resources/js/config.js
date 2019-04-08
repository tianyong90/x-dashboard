const debug = process.env.NODE_ENV !== 'production'

const APP_NAME = 'gh_dashboard'

const Config = {
  apiRoot: '/api',
  timeout: debug ? 15000 : 15000,
  authTokenKey: `${APP_NAME}_admin_token`,
}

export default Config

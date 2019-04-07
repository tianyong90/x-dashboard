const debug = process.env.NODE_ENV !== 'production'

const APP_NAME = 'vision_network'

const Config = {
  apiRoot: '/api/admin',
  timeout: debug ? 5000 : 15000,
  authTokenKey: `${APP_NAME}_admin_token`,
  userKey: `${APP_NAME}_admin_user`,
  rolesKey: `${APP_NAME}_admin_user_roles`,
}

export default Config

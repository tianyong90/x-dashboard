import config from '../config'

const getters = {
  user: state => {
    let userInSession = window.sessionStorage.getItem(config.userKey)

    return userInSession ? JSON.parse(userInSession) : null
  },
}

export default getters

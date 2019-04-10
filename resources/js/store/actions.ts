import config from '../config'

const actions = {
  // TODO
  storeUserToSession: ({ commit }, user) => {
    window.sessionStorage.setItem(config.userKey, JSON.stringify(user))
    commit('UPDATE_USER', user)
  },
}

export default actions

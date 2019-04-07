import config from '../config'

const actions = {
  storeUserToSession: ({ commit }, user) => {
    window.sessionStorage.setItem(config.userKey, JSON.stringify(user))
    commit('UPDATE_USER', user)
  },

  clearUserInSessionStorage: ({ commit }) => {
    window.sessionStorage.removeItem(config.userKey)
    commit('UPDATE_USER', null)
  },
}

export default actions

const mutations = {
  UPDATE_LOADING (state, status) {
    state.isLoading = status
  },

  UPDATE_TOPMENU_VISIBLE (state, value) {
    state.topmenuVisible = value
  },

  UPDATE_SIDEBAR_VISIBLE (state, value) {
    state.sidebarVisible = value
  },

  UPDATE_IS_LOGIN (state, value) {
    state.isLogin = value
  },
}

export default mutations

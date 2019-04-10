const mutations = {
  UPDATE_REPOSITORIES (state, repos:Array<any>) {
    state.isLoading = repos
  },
}

export default mutations

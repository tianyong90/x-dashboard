import { State } from './state'

const mutations = {
  UPDATE_REPOSITORIES (state: State, repos:Array<any>) {
    state.repositories = repos
  },
}

export default mutations

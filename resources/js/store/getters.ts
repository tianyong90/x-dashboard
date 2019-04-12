// import config from '../config'
import { State } from './state'

const getters = {
  totalStars: (state: State) => {
    // TODO
    return 516
  },
  // user: state => {
  //   let userInSession = window.sessionStorage.getItem(config.userKey)
  //
  //   return userInSession ? JSON.parse(userInSession) : null
  // },
}

export default getters

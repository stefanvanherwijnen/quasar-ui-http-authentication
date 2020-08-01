import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import { useState } from './state'
const state = useState()

const getters = {
  user: () => {
    return state.user
  },

  loggedIn: () => {
    return state.user !== null
  },

  check: (roles: Array<string>) => {
    const user = state.user
    if (user) {
      const userRoles = user.roles
      for (const role in roles) {
        if (!userRoles.includes(role)) {
          return false
        }
      }

      return true
    }
    return false
  }

}

export { getters }

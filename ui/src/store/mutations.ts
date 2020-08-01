import { ParsedUserInterface, UserDataInterface, useState } from './state'

const state = useState()

const mutations = {
  setUser: (user: UserDataInterface) => {
    if (user) {
      state.user = state.userDataFunction(user)
    } else {
      state.user = null
    }
  },

  setUserToNull: () => {
    state.user = null
  },

  addLoginCallback: (callback: (() => void)) => {
    state.loginCallbacks.push(callback)
  },

  setUserDataFunction: (func: (data: UserDataInterface) => ParsedUserInterface) => {
    state.userDataFunction = func
  },

  setIdentifierField: (field: 'email' | 'username') => {
    state.identifierField = field
  }
}

export { mutations }

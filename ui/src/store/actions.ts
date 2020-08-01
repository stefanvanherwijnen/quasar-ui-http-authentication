import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import { AxiosInstance, AxiosResponse } from 'axios'
import { Cookies } from 'quasar'
import VueRouter from 'vue-router'

export interface PromptsInterface {
  registerRoute: string,
  verificationRoute: string,
  loginRoute: string,
  fetchUserRoute: string,
  passwordForgotRoute: string,
  passwordResetRoute: string,
  authenticationScheme: string,
  identifierField: string,
}

export type UserIdentifierType = ({ __identifier: 'email', email: string } | { __identifier: 'username', username: string })

export type UserRegisterType = UserIdentifierType & { password: string }
export type UserLoginType = UserRegisterType
// const REGISTER_ROUTE: string = prompts['http-authentication'].registerRoute
// const VERIFICATION_ROUTE: string = prompts['http-authentication'].verificationRoute
// const LOGIN_ROUTE: string = prompts['http-authentication'].loginRoute
// const FETCH_USER_ROUTE: string = prompts['http-authentication'].fetchUserRoute
// const PASSWORD_FORGOT_ROUTE: string = prompts['http-authentication'].passwordForgotRoute
// const PASSWORD_RESET_ROUTE: string = prompts['http-authentication'].passwordResetRoute
// const AUTHENTICATION_SCHEME: string = prompts['http-authentication'].authenticationScheme
// const IDENTIFIER_FIELD: 'email' | 'username' = prompts['http-authentication'].identifierField

import { useState, UserDataInterface, ParsedUserInterface } from './state'
const state = useState()

import { mutations } from './mutations'

const setIdentifier = (user: ParsedUserInterface): UserIdentifierType => {
  if (user.email) {
    return {
      __identifier: 'email',
      email: user.email,
    }
  } else if (user.username) {
    return {
      __identifier: 'username',
      username: user.username
    }
  } else {
    throw new Error('No identifier found in user data')
  }
}

const useActions = ({ axios, prompts }: { axios: AxiosInstance, prompts: PromptsInterface }) => {
  const REGISTER_ROUTE: string = prompts.registerRoute
  const VERIFICATION_ROUTE: string = prompts.verificationRoute
  const LOGIN_ROUTE: string = prompts.loginRoute
  const FETCH_USER_ROUTE: string = prompts.fetchUserRoute
  const PASSWORD_FORGOT_ROUTE: string = prompts.passwordForgotRoute
  const PASSWORD_RESET_ROUTE: string = prompts.passwordResetRoute
  const AUTHENTICATION_SCHEME: string = prompts.authenticationScheme
  // const IDENTIFIER_FIELD: 'email' | 'username' = prompts.identifierField

  const actions = {
    register: (data: UserRegisterType) => {
      return axios.post(REGISTER_ROUTE, data)
    },

    login: async (data: { user: UserLoginType, rememberMe: boolean }) => {
      return axios
        .post(LOGIN_ROUTE, data.user)
        .then((response: AxiosResponse<{user: { data: UserDataInterface }, token: string}>) => {
          mutations.setUser(response.data.user.data)
          const userData = setIdentifier(state.userDataFunction(response.data.user.data))
          actions.setHeader({
            token: response.data.token,
            user: userData,
            password: data.user.password,
            rememberMe: data.rememberMe
          })
          return Promise.resolve()
        })
    },

    setHeaderTokenBearer (token: string, rememberMe = false) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      if (rememberMe) {
        Cookies.set('authorization_token', token, {
          expires: 365,
          secure: true
        })
      } else {
        Cookies.set('authorization_token', token, {
          secure: true 
        })
      }
    },

    setHeaderTokenBasic (identifier: string, password: string) {
      axios.defaults.headers.common.Authorization = `Basic ${btoa(`${identifier}:${password}`)}`
    },

    setHeader: ({ token, user, password, rememberMe }: { token: string, user: UserIdentifierType, password?: string, rememberMe: boolean}) => {
      if (AUTHENTICATION_SCHEME === 'Basic') {
        let identifier
        if (user.__identifier === 'email') {
          identifier = user.email
        } else if (user.__identifier === 'username') {
          identifier = user.username
        }
        if (identifier && password) {
          actions.setHeaderTokenBasic(identifier, password)
        }
      } else if (AUTHENTICATION_SCHEME === 'Bearer') {
        actions.setHeaderTokenBearer(token, rememberMe)
      }
    },

    fetch: async () => {
      const token = Cookies.get('authorization_token')
      if (token) {
        actions.setHeaderTokenBearer(token)
      }
      if (axios.defaults.headers.common.Authorization) {
        return axios.get(FETCH_USER_ROUTE).then((response: AxiosResponse<{data: UserDataInterface}>) => {
          mutations.setUser(response.data.data)
        }).then(() => {
          actions.loginCallback()
        })
      } else {
        return Promise.reject('No authorization token found')
      }
    },

    logout: () => {
      Cookies.remove('authorization_token')
      mutations.setUserToNull()
    },

    verify: (token: string) => {
      return axios.get(`${VERIFICATION_ROUTE}?token=${token}`)
    },

    passwordForgot: (user: { email: string }) => {
      return axios.post(PASSWORD_FORGOT_ROUTE, user)
    },

    passwordReset: ({ token, user }: { token: string, user: { password: string }}) => {
      return axios.post(`${PASSWORD_RESET_ROUTE}?token=${token}`, user)
    },

    loginCallback: (data: { router?: VueRouter } = {}) => {
      for (const loginCallback of state.loginCallbacks) {
        loginCallback({ router: data.router })
      }
    }
  }
  return actions
}

export { useActions }

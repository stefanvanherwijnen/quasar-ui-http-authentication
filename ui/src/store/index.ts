import Vue from 'vue'
import VueCompositionAPI, { computed, provide, inject } from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import { useState } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { useActions, PromptsInterface } from './actions'
import { AxiosInstance } from 'axios'

const defaultPrompts = {
  identifierField: 'email',
  authenticationScheme: 'Bearer',
  loginRoute: '/auth/login',
  registerRoute: '/auth/register',
  verificationRoute: '/auth/verify',
  passwordForgotRoute: '/auth/password/forgot',
  passwordResetRoute: '/auth/password/reset',
  fetchUserRoute: '/auth/user'
}

const state = useState()

const store = ({ axios, prompts }: { axios: AxiosInstance, prompts: PromptsInterface }) => ({
  state: computed(() => state),
  mutations: mutations,
  actions: useActions({ axios, prompts }),
  getters: getters
})

const AuthSymbol = Symbol('Auth store')

export default store
export type AuthStore = typeof store

export function provideStore ({ axios, prompts }: { axios: AxiosInstance, prompts: PromptsInterface }) {
  if (!axios) {
    throw new Error('No axios instance provided. Using default')
  }
  if (!prompts) {
    console.log('No valid prompts have been provided.')
    prompts = defaultPrompts
  } else {
    prompts = { ...defaultPrompts, ...prompts }
  }
  const authStore = store({ axios, prompts })
  provide(AuthSymbol, authStore)
}

export function useStore () {
  const authStore = inject(AuthSymbol) as ReturnType<AuthStore>
  if (!authStore) {
    throw new Error('No auth store provided')
  }
  return authStore
}

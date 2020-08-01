import Vue from 'vue'
import VueCompositionAPI, { reactive } from '@vue/composition-api'
import VueRouter from 'vue-router'
Vue.use(VueCompositionAPI)

export interface UserDataInterface {
  id: string,
  attributes: {
    email: string
    username: string
    // password?: string
    name: string
    roleNames: Array<string>
  }
}

export interface ParsedUserInterface {
  [key: string]: unknown
  id: string
  email: string
  username?: string
  name?: string
  roles: Array<string>
}

interface AuthInterface {
  user: ParsedUserInterface | null
  loginCallbacks: Array<(data?: loginCallbackData) => void>
  userDataFunction: (data: UserDataInterface) => ParsedUserInterface,
  identifierField: 'email' | 'username'
}

export interface loginCallbackData {
  router?: VueRouter
}

const user: ParsedUserInterface | null = null
const loginCallbacks: Array<(data?: loginCallbackData) => void> = []
const userDataFunction: (data: UserDataInterface) => ParsedUserInterface = (data: UserDataInterface) => {
  return {
    id: data.id,
    email: data.attributes.email,
    name: data.attributes.name,
    roles: Object.keys(data.attributes.roleNames).length ? Object.values(data.attributes.roleNames) : data.attributes.roleNames
  }
}

const identifierField: 'email' | 'username' = 'email'

const state = reactive<AuthInterface>({
  user: user,
  loginCallbacks: loginCallbacks,
  userDataFunction: userDataFunction,
  identifierField: identifierField
})

const useState = () => state

export { useState }

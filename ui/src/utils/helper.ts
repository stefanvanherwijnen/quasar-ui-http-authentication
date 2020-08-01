import store, { useStore, AuthStore } from '../store'
import { provide, inject } from '@vue/composition-api'
import VueRouter from 'vue-router'
import { UserIdentifierType, UserRegisterType, UserLoginType } from '../store/actions'

const AuthHelperSymbol = Symbol('AuthHelper')

const helper = (store: ReturnType<AuthStore>) => ({
  register: (user: UserRegisterType) => store.actions.register(user),
  login: (data: {user: UserLoginType, rememberMe: boolean }) => store.actions.login(data),
  loginCallback: (data: { router?: VueRouter }) => store.actions.loginCallback(data),
  addLoginCallback: (fn: () => void) => store.mutations.addLoginCallback(fn),
  logout: () => store.actions.logout(),
  verify: (token: string) => store.actions.verify(token),
  passwordForgot: (data: { email: string}) => store.actions.passwordForgot(data),
  passwordReset: (data: { token: string, user: { password: string }}) => store.actions.passwordReset(data),
  loggedIn: () => store.getters.loggedIn(),
  check: (roles: Array<string>) => store.getters.check(roles),
  setHeader: (
    data: { token: string, user: UserIdentifierType, password?: string, rememberMe: boolean }
  ) => store.actions.setHeader(data),
  fetch: () => store.actions.fetch(),
  user: () => store.getters.user()
})

export type TAuthHelper = ReturnType<typeof helper>

export function provideHelper () {
  const store = useStore()
  return provide(AuthHelperSymbol, helper(store))
}

export function useAuthHelper () {
  const authHelper = inject(AuthHelperSymbol) as TAuthHelper
  if (!authHelper) {
    throw new Error('No auth helper has been provided.')
  }
  return authHelper
}

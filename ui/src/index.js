import { version } from '../package.json'

import AuthMenu from './components/AuthMenu.vue'
import LoginComponent from './components/LoginComponent.vue'
import RegisterComponent from './components/RegisterComponent.vue'
import LogoutComponent from './components/LogoutComponent.vue'
import PasswordForgotComponent from './components/PasswordForgotComponent.vue'
import PasswordResetComponent from './components/PasswordResetComponent.vue'
import VerificationComponent from './components/VerificationComponent.vue'

import { initUi } from './utils/setup'
import { useAuthHelper } from './utils/helper'
import { setRouteGuard } from './utils/router'

import {
  ClosePopup
} from 'quasar'

export {
  version,
  initUi,
  useAuthHelper,
  setRouteGuard,
  AuthMenu,
  LoginComponent,
  RegisterComponent,
  LogoutComponent,
  PasswordForgotComponent,
  PasswordResetComponent,
  VerificationComponent
}

export default {
  version,
  initUi,
  useAuthHelper,
  setRouteGuard,
  AuthMenu,
  LoginComponent,
  RegisterComponent,
  LogoutComponent,
  PasswordForgotComponent,
  PasswordResetComponent,
  VerificationComponent,

  install (Vue) {
    Vue.directive('close-popup', ClosePopup)

    Vue.component(AuthMenu.name, AuthMenu)
    Vue.component(LoginComponent.name, LoginComponent)
    Vue.component(RegisterComponent.name, RegisterComponent)
    Vue.component(LogoutComponent.name, LogoutComponent)
    Vue.component(PasswordForgotComponent.name, PasswordForgotComponent)
    Vue.component(PasswordResetComponent.name, PasswordResetComponent)
    Vue.component(VerificationComponent.name, VerificationComponent)
  }
}

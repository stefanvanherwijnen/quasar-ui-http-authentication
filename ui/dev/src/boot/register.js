import Vue from 'vue'
// import VuePlugin from 'ui' // "ui" is aliased in quasar.conf.js
import VuePlugin from '../../../dist/index.common.js'
import { initUi } from '../../../dist/index.common.js'
import { useAuthHelper } from '../../../dist/index.common'
Vue.use(VuePlugin)

// @ts-nocheck

import { boot } from 'quasar/wrappers'
// import * as prompts from 'app/quasar.extensions.json'
import { useAxiosInstance } from './axios'

function addToSetup (app, fn) {
  const old = app.setup
  if (old) {
    app.setup = function () {
      old()
      fn()
    }
  } else {
    app.setup = function () {
      fn()
    }
  }
}

export default boot(({ app, router, store, Vue }) => {
  const prompts = {}

  addToSetup(app, function () {
    console.log('Adding http-auth')
    const axiosInstance = useAxiosInstance()
    initUi({ axios: axiosInstance, router, prompts })
    const $auth = useAuthHelper()
    $auth.addLoginCallback(() => console.log('Login callback'))
  })
})

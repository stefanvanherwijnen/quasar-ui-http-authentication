import VuePlugin from 'quasar-ui-http-authentication'
import { initUi, useAuthHelper, setRouteGuard } from 'quasar-ui-http-authentication'

import { boot } from 'quasar/wrappers'
import * as prompts from 'app/quasar.extensions.json'

// Use your own axios instance
import { injectAxios } from 'boot/axios'

export default boot(({ app, router, Vue }) => {
  Vue.use(VuePlugin)
  const axiosInstance = injectAxios()
  app.setup = () => {
    initUi({ axios: axiosInstance, prompts })
    const $auth = useAuthHelper()
    $auth.addLoginCallback(() => console.log('Login callback'))
    setRouteGuard(router)
  }
})

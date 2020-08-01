/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

import { IndexAPI } from '@quasar/app'

function extendConf (conf) {
  // register our boot file
  conf.boot.push('~@quasar/quasar-app-extension-http-authentication/src/boot/register.js')

  // make sure app extension files & ui packages get transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-http-authentication[\\/]src/)
  conf.build.transpileDependencies.push(/quasar-ui-http-authentication[\\/]src/)

  // make sure the stylesheet goes through webpack to avoid SSR issues
  // conf.css.push('~@quasar/quasar-ui-http-authentication/src/index.sass')
}

export = function (api: IndexAPI) {
  // Uncomment and correct the versions
  api.compatibleWith('quasar', '^1.0.0')
  api.compatibleWith('@quasar/app', '^1.3.0 || ^2.0.0')

  api.extendQuasarConf(extendConf)
}
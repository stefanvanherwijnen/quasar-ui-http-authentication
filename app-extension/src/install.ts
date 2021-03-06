/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */

import { InstallAPI } from '@quasar/app'

export = function (api: InstallAPI) {
  // Uncomment and correct the versions
  api.compatibleWith('quasar', '^1.0.0')
  api.compatibleWith('@quasar/app', '^1.3.0 || ^2.0.0')
}

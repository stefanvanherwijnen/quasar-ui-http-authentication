/**
 * Quasar App Extension prompts script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/prompts-api
 *
 * Inquirer prompts
 * (answers are available as "api.prompts" in the other scripts)
 * https://www.npmjs.com/package/inquirer#question
 *
 * Example:

  return [
    {
      name: 'name',
      type: 'string',
      required: true,
      message: 'Quasar CLI Extension name (without prefix)',
    },
    {
      name: 'preset',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [
        {
          name: 'Install script',
          value: 'install'
        },
        {
          name: 'Prompts script',
          value: 'prompts'
        },
        {
          name: 'Uninstall script',
          value: 'uninstall'
        }
      ]
    }
  ]

 */
export = function () {
  return [
    {
      name: 'baseUrl',
      type: 'input',
      required: true,
      message: 'URL of API server',
      default: 'http://127.0.0.1:3000'
    },
    {
      name: 'authenticationScheme',
      type: 'list',
      required: true,
      message: 'HTTP Authentication scheme (https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)',
      choices: [
        {
          name: 'Bearer',
          value: 'Bearer',
          short: 'Bearer'
        },
        {
          name: 'Basic',
          value: 'Basic',
          short: 'Basic'
        }
      ],
      default: 'Bearer'
    },
    {
      name: 'identifierField',
      type: 'list',
      required: true,
      message: 'Field to identify an account (email or username)',
      choices: [
        {
          name: 'Email',
          value: 'email',
          short: 'Email'
        },
        {
          name: 'Username',
          value: 'username',
          short: 'Username'
        }
      ],
      default: 'email'
    },
    {
      name: 'registerRoute',
      type: 'input',
      required: true,
      message: 'Route for user registration',
      default: '/auth/register'
    },
    {
      name: 'verificationRoute',
      type: 'input',
      required: true,
      message: 'Route for user verification',
      default: '/auth/verify'
    },
    {
      name: 'loginRoute',
      type: 'input',
      required: true,
      message: 'Route for user login',
      default: '/auth/login'
    },
    {
      name: 'passwordForgotRoute',
      type: 'input',
      required: true,
      message: 'Route for forgotten password request',
      default: '/auth/password/forgot'
    },
    {
      name: 'passwordResetRoute',
      type: 'input',
      required: true,
      message: 'Route to reset password',
      default: '/auth/password/reset'
    },
    {
      name: 'fetchUserRoute',
      type: 'input',
      required: true,
      message: 'Route to fetch authenticated user',
      default: '/auth/user'
    }
  ]
}

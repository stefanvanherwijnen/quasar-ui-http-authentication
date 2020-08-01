import { provide, inject } from '@vue/composition-api'
import axios from 'axios'
import { boot } from 'quasar/wrappers'

const AxiosSymbol = Symbol('Axios')
export function provideAxios ({ baseURL }) {
  const axiosInstance = axios.create({
    baseURL: baseURL
  })
  return provide(AxiosSymbol, axiosInstance)
}

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

export function useAxiosInstance () {
  const axiosInstance = inject(AxiosSymbol)
  if (!axiosInstance) {
    throw new Error('No axios instance has been provided.')
  }
  return axiosInstance
}

export default boot(({ app }) => {
  addToSetup(app, function () {
    console.log('Adding axios')
    provideAxios({ baseURL: 'http://127.0.0.1:3000' })
  })
})
import { provideStore } from '../store'
import { PromptsInterface } from '../store/actions'
import { AxiosInstance } from 'axios'
import { provideHelper } from './helper'
import { setRouteGuard } from './router'
import VueRouter from 'vue-router'

function initUi ({ axios, router, prompts }: { axios: AxiosInstance, router: VueRouter, prompts: PromptsInterface }) {
  provideStore({ axios, prompts })
  provideHelper()
  setRouteGuard(router)
}

export {
  initUi
}
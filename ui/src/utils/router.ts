import VueRouter from 'vue-router'
import { useAuthHelper } from './helper'

export function setRouteGuard (router: VueRouter) {
  const $auth = useAuthHelper()
  router.beforeEach((to, from, next) => {
    const record = to.matched.find(record => record.meta.auth)
    console.log(record)
    if (record) {
      if (!$auth.loggedIn()) {
        return $auth.fetch().then(() => {
          if ($auth.loggedIn()) {
            next('/')
          } else if (
            !$auth.check(record.meta.auth)
          ) {
            next('/account')
          } else {
            next()
          }
        }).catch(() => {
          next('/')
        })
      } else if (
        !$auth.check(record.meta.auth)
      ) {
        return next('/account')
      }
    }
    next()
  })
}

export function addRoutes (router: VueRouter) {
  // const { routes } = router.options
  // // @ts-ignore
  // const routeData = routes.find(r => r.path === '/')
  // // @ts-ignore
  // const currentRoutes = routeData.children.map(route => route.path)
  // const newRoutes = [
  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: () => import('http-authentication/lang/')
  //   },
  //   {
  //     path: '/logout',
  //     name: 'logout',
  //     component: () => import('http-authentication/pages/Logout.vue')
  //   },
  //   {
  //     path: '/register',
  //     name: 'register',
  //     component: () => import('http-authentication/pages/Register.vue')
  //   },
  //   {
  //     path: '/verification',
  //     name: 'verification',
  //     component: () => import('http-authentication/pages/Verification.vue')
  //   },
  //   {
  //     path: '/password',
  //     name: 'password',
  //     component: { render: h => h('router-view') },
  //     children: [
  //       {
  //         path: 'forgot',
  //         name: 'forgot',
  //         component: () => import('http-authentication/pages/password/Forgot.vue')
  //       },
  //       {
  //         path: 'reset',
  //         name: 'reset',
  //         component: () => import('http-authentication/pages/password/Reset.vue')
  //       }
  //     ]
  //   }
  // ]
  // routeData.children = []
  // for (const route of newRoutes) {
  //   if (!currentRoutes.includes(route.path)) {
  //     routeData.children.push(route)
  //   }
  // }
  // router.addRoutes([routeData])
}
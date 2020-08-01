import pages from './pages'

const children = pages.map(page => ({
  path: page.path,
  component: () => import('pages/' + page.file + '.vue')
}))

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/protected', meta: { auth: ['administrator'] }, component: () => import('pages/Index.vue') }
    ].concat(children)
  }
]

export default routes

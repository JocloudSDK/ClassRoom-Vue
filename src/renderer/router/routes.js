const Layout = () => import(/* webpackChunkName: "test" */ '@/pages/layout/index.vue')
const Login = () => import(/* webpackChunkName: "login" */ '@/pages/login/index.vue')
const Error = () => import(/* webpackChunkName: "error" */ '@/pages/error/index.vue')
const Classroom = () => import(/* webpackChunkName: "classroom" */ '@/pages/classroom/index.vue')
const TestStore = () => import(/* webpackChunkName: "test" */ '@/pages/testStore.vue')
let route = []

if (process.env.NODE_PLATFORM === 'electron') {
  const Test = () => import(/* webpackChunkName: "test" */ '@/pages/test.vue')

  route = [
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/testStore',
      name: 'TestStore',
      component: TestStore
    }
  ]
}

const routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Login',
        component: Login
      },
      {
        path: '/class/:id/:type',
        name: 'Classroom',
        component: Classroom
      },
      ...route
    ]
  },
  {
    path: '*',
    name: 'Error',
    component: Error,
    meta: {
      title: '您访问的页面找不到',
      toLogin: false
    }
  },
  {
    path: '/testStore',
    name: 'TestStore',
    component: TestStore
  }
]

export default routes

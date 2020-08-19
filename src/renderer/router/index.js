import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'
import App from '@/App.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  fallback: false,
  routes
})

router.beforeEach((to, from, next) => {
  console.log('router:', to, from)
  // ...
  // TODO
  next()
})

export default {
  run () {
    new Vue({
      render (h) {
        return h(App)
      },
      store,
      router,
      data: {
        event: new Vue()
      }
    }).$mount('#app')
  }
}

import Vue from 'vue'
// import '@/registerServiceWorker'
import Router from '@/router'
import Element from '@/plugin/element'
import Filter from '@/common/filter'
import Directive from '@/common/directive'
import Storage from '@/plugin/storage'
import 'element-ui/lib/theme-chalk/index.css'
import Toast from '@/plugin/toast'
import axios from 'axios'

Vue.prototype.$axios = axios

Vue.config.productionTip = false

Element(Vue)
Vue.use(Filter)
Vue.use(Directive)
Vue.use(Storage)
Vue.use(Toast)

Router.run()

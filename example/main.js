import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'vue-directive-image-previewer/dist/assets/style.css' // image_view css
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
// require('./mock/getDetail.js')
import Element from 'element-ui'
import Cookies from 'js-cookie'
import App from './App'
import router from './router'
import store from './store'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer' // image_view
import './permission' // permission control
import './icons' // icon
import api from './api/API'
import AFTableColumn from 'af-table-column'
import { getparams } from './utils/globalFunction/index'
import mloading from '@common/loading/index.js'
import i18n from './lang' // Internationalization

Vue.use(AFTableColumn)

// 空参过滤
Vue.prototype.getParams = getparams

Vue.use(VueDirectiveImagePreviewer)
Vue.use(mloading)
Vue.prototype.$api = api
Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  VueDirectiveImagePreviewer,
  api,
  render: h => h(App)
})

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import app from './modules/app'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user
  },
  getters
})

export default store

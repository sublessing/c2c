import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import chart from './modules/chart'
import user from './modules/user'
import resource from './modules/resource'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    resource,
    chart
  },
  getters
})

export default store

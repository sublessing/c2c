import {
  constantRouterMap
} from '@/router/index'
import localRoute from './router'
import Layout from '@/views/layout/Layout'
import LayoutSub from '@/views/layout/LayoutSub'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
/**
 * 将服务器返回路由格式化为route
 * @param {*} routes
 */

function formatRouter(routes) {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    if (route.component === 'Layout') {
      route.component = Layout
    } else if (route.component === 'LayoutSub') {
      route.component = LayoutSub
    } else if (route.component) {
      route.component = _import(route.component)
    }
    if (route.children && route.children.length) {
      formatRouter(route.children)
    }
  }
}

function buildRouteMap(routes, routeMap) {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    if (route.id !== undefined) {
      routeMap[route.id] = route
      if (route.children && route.children.length) {
        buildRouteMap(route.children, routeMap)
      }
    }
  }
}

const permission = {
  state: {
    routers: constantRouterMap, // 静态路由 + 动态路由
    addRouters: [], // 用户接受我们后台路由
    routeMap: {} // 菜单显示要用
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      formatRouter(routers)
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      buildRouteMap(state.routers, state.routeMap)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        const { routers } = data
        commit('SET_ROUTERS', routers)
        resolve()
      })
    }
  }
}

export default permission

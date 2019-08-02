import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  getToken
} from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = getToken()
  if (token > 0) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
    } else {
      if (store.getters.name === '') {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const routers = res.data.routers
          store.dispatch('GenerateRoutes', {
            routers
          }).then(() => { // 拉取路由信息
            router.addRoutes(store.getters.addRouters)
            // 先初始化资源,再跳转
            Promise.all([
              store.dispatch('InitMerchantMap'),
              store.dispatch('InitAgentMap')
            ]).then(value => {
              if (to.redirectedFrom !== undefined) {
                next({
                  path: to.redirectedFrom
                })
              } else {
                next({ ...to
                })
              }
            })
          })
        }).catch((e) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({
              path: '/login'
            })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

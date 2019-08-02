export default [
  {
    component: 'Layout',
    id: 1,
    meta: {
      name: '首页'
    },
    name: 1,
    onlyOne: 1,
    parent_id: 0,
    path: '/',
    sort_id: 0,
    children: [
      {
        component: 'dashboard/indexData',
        id: 2,
        meta: { title: '首页', icon: 'home' },
        name: '87',
        parent_id: 2,
        path: '/index',
        sort_id: 0
      }
    ]
  },
  {
    component: 'Layout',
    id: 3,
    meta: {
      title: '订单管理',
      icon: 'table'
    },
    name: 3,
    parent_id: 0,
    path: '/order',
    sort_id: 1,
    children: [
      {
        component: 'order/order_recharge',
        id: 4,
        meta: {
          title: '充值订单查询'
        },
        name: 4,
        parent_id: 3,
        path: '/order/recharge',
        sort_id: 2
      },
      {
        component: 'order/order_draw',
        id: 5,
        meta: {
          title: '转账订单查询'
        },
        name: 5,
        parent_id: 3,
        path: '/order/draw',
        sort_id: 2
      }
    ]
  },
  {
    component: 'Layout',
    id: 6,
    meta: {
      title: '商户管理',
      icon: 'user'
    },
    name: 6,
    parent_id: 0,
    path: '/merchant',
    sort_id: 1,
    children: [
      {
        component: 'merchant/account',
        id: 7,
        meta: {
          title: '商户账号'
        },
        name: 7,
        parent_id: 6,
        path: '/merchant/account',
        sort_id: 2
      },
      {
        component: 'merchant/pass',
        id: 8,
        meta: {
          title: '商户通道'
        },
        name: 8,
        parent_id: 6,
        path: '/merchant/pass',
        sort_id: 2
      }
    ]
  },
  {
    component: 'Layout',
    id: 9,
    meta: {
      title: '权限管理',
      icon: 'auth'
    },
    name: 9,
    parent_id: 0,
    path: '/auth',
    sort_id: 1,
    children: [
      {
        component: 'auth/user',
        id: 10,
        meta: {
          title: '用户管理'
        },
        name: 10,
        parent_id: 9,
        path: '/auth/user',
        sort_id: 2
      },
      {
        component: 'auth/role',
        id: 11,
        meta: {
          title: '角色管理'
        },
        name: 11,
        parent_id: 9,
        path: '/auth/role',
        sort_id: 2
      },
      {
        component: 'auth/permission',
        id: 12,
        meta: {
          title: '权限管理'
        },
        name: 12,
        parent_id: 9,
        path: '/auth/permission',
        sort_id: 2
      }
    ]
  }
]

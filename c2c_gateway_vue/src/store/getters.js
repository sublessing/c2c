const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  name: state => state.user.name,
  roleIds: state => state.user.roleIds,
  urls: state => state.user.urls,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  routeMap: state => state.permission.routeMap,
  merchantMap: state => state.resource.merchantMap,
  merchantMap2: state => state.resource.merchantMap2,
  merchantKeyMap: state => state.resource.merchantKeyMap,
  channelWayMap: state => state.resource.channelWayMap,
  agentMap: state => state.resource.agentMap,
  queryParams: state => state.chart.queryParams
}

export default getters

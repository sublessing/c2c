import request from '@/utils/request'

//  获取支付宝日报列表
export function listDayAlipay(params) {
  return request({
    url: '/statistics/alipay_day/list/',
    method: 'get',
    params: params
  })
}

//  支付宝日报导出excel
export function dayAlipayExcel(params) {
  return request({
    url: '/statistics/alipay_day/excel/',
    method: 'get',
    params: params
  })
}

//  获取云闪付日报列表
export function listDayUnion(params) {
  return request({
    url: '/statistics/union_day/list/',
    method: 'get',
    params: params
  })
}

//  云闪付日报导出excel
export function dayUnionExcel(params) {
  return request({
    url: '/statistics/union_day/excel/',
    method: 'get',
    params: params
  })
}

//  获取通道日报列表
export function listDayChannel(params) {
  return request({
    url: '/statistics/way_day/list/',
    method: 'get',
    params: params
  })
}

//  通道日报导出excel
export function dayChannelExcel(params) {
  return request({
    url: '/statistics/way_day/excel/',
    method: 'get',
    params: params
  })
}

//  获取代理日报列表
export function listDayAgent(params) {
  return request({
    url: '/statistics/agent_day/list/',
    method: 'get',
    params: params
  })
}

//  代理日报导出excel
export function dayAgentExcel(params) {
  return request({
    url: '/statistics/agent_day/excel/',
    method: 'get',
    params: params
  })
}

//  获取支付渠道通道列表
export function listDayChannelWay(params) {
  return request({
    url: '/statistics/channel_way/list/',
    method: 'get',
    params: params
  })
}

//  支付通道日导出excel
export function dayChannelWayExcel(params) {
  return request({
    url: '/statistics/channel_way/excel/',
    method: 'get',
    params: params
  })
}

//  获取商户流水列表
export function listDayWx(params) {
  return request({
    url: '/statistics/wx_day/list/',
    method: 'get',
    params: params
  })
}

//  商户流水导出excel
export function dayWxExcel(params) {
  return request({
    url: '/statistics/wx_day/excel/',
    method: 'get',
    params: params
  })
}

//  获取代理流水列表
export function listAgentRecord(params) {
  return request({
    url: '/statistics/agent_record/list/',
    method: 'get',
    params: params
  })
}

//  代理流水导出excel
export function agentRecordExcel(params) {
  return request({
    url: '/statistics/agent_record/excel/',
    method: 'get',
    params: params
  })
}

export function rebotComputerStatusCharts() {
  return request({
    url: '/stat/rebot_computer/charts/',
    method: 'get'
  })
}

export function rebotPhoneStatusCharts() {
  return request({
    url: '/stat/rebot_phone/charts/',
    method: 'get'
  })
}

// 其他所有的监控
export function jkOthersNewestCompare() {
  return request({
    url: '/stat/jk_others/newest_compare/',
    method: 'get'
  })
}

export function listFictitiousRecord(params) {
  return request({
    url: '/stat/fictitious_record/list/',
    method: 'get',
    params: params
  })
}

export function resetConfig() {
  return request({
    url: '/stat/config/reload/',
    method: 'get'
  })
}

export function listAgentFilter(query) {
  return request({
    url: '/stat/agent_filter/list/',
    method: 'get',
    params: query
  })
}

export function updateAgentFilter(data) {
  return request({
    url: '/stat/agent_filter/curd/',
    method: 'patch',
    data: data
  })
}

export function addAgentFilter(data) {
  return request({
    url: '/stat/agent_filter/curd/',
    method: 'post',
    data: data
  })
}

export function deleteAgentFilter(data) {
  return request({
    url: '/stat/agent_filter/curd/',
    method: 'delete',
    data: data
  })
}

export function listAliAccount(query) {
  return request({
    url: '/stat/ali_account/list/',
    method: 'get',
    params: query
  })
}

export function updateAliAccount(data) {
  return request({
    url: '/stat/ali_account/curd/',
    method: 'patch',
    data: data
  })
}

export function addAliAccount(data) {
  return request({
    url: '/stat/ali_account/curd/',
    method: 'post',
    data: data
  })
}

export function deleteAliAccount(data) {
  return request({
    url: '/stat/ali_account/curd/',
    method: 'delete',
    data: data
  })
}

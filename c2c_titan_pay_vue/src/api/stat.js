import request from '@/utils/request'

//  获取系统日报列表
export function listDaySys(params) {
  return request({
    url: '/statistics/system_day/list/',
    method: 'get',
    params: params
  })
}

//  系统日报导出excel
export function daySysExcel(params) {
  return request({
    url: '/statistics/system_day/excel/',
    method: 'get',
    params: params
  })
}

//  获取商户日报列表
export function listDayMerchant(params) {
  return request({
    url: '/statistics/merchant_day/list/',
    method: 'get',
    params: params
  })
}

//  商户日报导出excel
export function dayMerchantExcel(params) {
  return request({
    url: '/statistics/merchant_day/excel/',
    method: 'get',
    params: params
  })
}

//  获取企业账号日报列表
export function listDayChannel(params) {
  return request({
    url: '/statistics/enterprise_day/list/',
    method: 'get',
    params: params
  })
}

//  企业账号日报导出excel
export function dayChannelExcel(params) {
  return request({
    url: '/statistics/enterprise_day/excel/',
    method: 'get',
    params: params
  })
}

export function dayAgentExcel(params) {
  return request({
    url: '/stat/day-agent/excel/',
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
export function listMerchantRecord(params) {
  return request({
    url: '/statistics/merchant_record/list/',
    method: 'get',
    params: params
  })
}

//  商户流水导出excel
export function merchantRecordExcel(params) {
  return request({
    url: '/statistics/merchant_record/excel/',
    method: 'get',
    params: params
  })
}

//  获取企业账号流水列表
export function listEnterpriseRecord(params) {
  return request({
    url: '/statistics/enterprise_record/list/',
    method: 'get',
    params: params
  })
}

//  企业账号流水导出excel
export function enterpriseRecordExcel(params) {
  return request({
    url: '/statistics/enterprise_record/excel/',
    method: 'get',
    params: params
  })
}

//  获取渠道流水列表
export function listChannelRecord(params) {
  return request({
    url: '/statistics/channel_record/list/',
    method: 'get',
    params: params
  })
}

//  渠道流水导出excel
export function channelRecordExcel(params) {
  return request({
    url: '/statistics/channel_record/excel/',
    method: 'get',
    params: params
  })
}

export function listAgentRecord(params) {
  return request({
    url: '/stat/agent_record/list/',
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

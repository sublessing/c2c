import request from '@/utils/request'
export function jkMerchantRechargeSucc(params) {
  return request({
    url: '/stat/jk_merchant/recharge_succ/',
    method: 'get',
    params: params
  })
}

//  获取商户充值成功率统计 type = 0
//  获取商户提现成功率统计 type = 1
export function jkMerchantDrawSucc(params) {
  return request({
    url: '/stat/jk_merchant/draw_succ/',
    method: 'get',
    params: params
  })
}

export function jkMerchantNewest(params) {
  return request({
    url: '/stat/jk_merchant/newest-data/',
    method: 'get',
    params: params
  })
}

export function jkMerchantBalance(params) {
  return request({
    url: '/stat/jk_merchant/balance/',
    method: 'get',
    params: params
  })
}

export function jkAgentSuccRate(params) {
  return request({
    url: '/stat/jk_agent/succ-rate/',
    method: 'get',
    params: params
  })
}

export function jkAgentNewest(params) {
  return request({
    url: '/stat/jk_agent/newest-data/',
    method: 'get',
    params: params
  })
}

export function jkAgentBalance(params) {
  return request({
    url: '/stat/jk_agent/balance/',
    method: 'get',
    params: params
  })
}

export function jkAgentCount(params) {
  return request({
    url: '/stat/jk_agent_count/stat/',
    method: 'get',
    params: params
  })
}

export function listErrorpic(params) {
  return request({
    url: '/stat/error/list/',
    method: 'get',
    params: params
  })
}

export function listSms(params) {
  return request({
    url: '/stat/sms/list/',
    method: 'get',
    params: params
  })
}


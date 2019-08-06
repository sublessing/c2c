import request from '@/utils/request'

//  获取操作日志列表
export function listRequestLog(params) {
  return request({
    url: '/service/log/list/',
    method: 'get',
    params: params
  })
}

// 获取全局配置列表
export function listConfig(query) {
  return request({
    url: '/service/config/list/',
    method: 'get',
    params: query
  })
}

//  修改全局配置
export function updateConfig(data) {
  return request({
    url: '/service/config/curd/',
    method: 'patch',
    data: data
  })
}

//  重载全局配置
export function resetConfig(data) {
  return request({
    url: '/service/config/reload/',
    method: 'post',
    data: data
  })
}

//  获取耗材管理列表
export function listTpResourceApiList(params) {
  return request({
    url: '/order/tp_resource_api/list/',
    method: 'get',
    params: params
  })
}

//  新建耗材管理
export function addTpResourceApiList(data) {
  return request({
    url: '/order/tp_resource_api/curd/',
    method: 'post',
    data: data
  })
}

//  修改耗材管理
export function editTpResourceApiList(data) {
  return request({
    url: '/order/tp_resource_api/curd/',
    method: 'patch',
    data: data
  })
}

//  删除耗材管理
export function deleteTpResourceApiList(data) {
  return request({
    url: '/order/tp_resource_api/curd/',
    method: 'put',
    data: data
  })
}

//  修改耗材管理状态
export function statusTpResourceApiList(data) {
  return request({
    url: '/order/tp_resource_api/status/',
    method: 'post',
    data: data
  })
}

//  获取充值订单列表
export function listOrderRecharge(params) {
  return request({
    url: '/order/pay/list/',
    method: 'get',
    params: params
  })
}

//  充值订单导出excel
export function orderRechargeExcel(params) {
  return request({
    url: '/order/pay/excel/',
    method: 'get',
    params: params
  })
}

//  充值订单回调订单状态
export function orderCallback(data) {
  return request({
    url: '/order/pay/callback/',
    method: 'post',
    data: data
  })
}

//  获取支付渠道列表
export function listChannel(params) {
  return request({
    url: '/channel/channel/list/',
    method: 'get',
    params: params
  })
}

//  获取支付渠道选择项列表
export function listSelectChannel(params) {
  return request({
    url: '/channel/channel/selectlist/',
    method: 'get',
    params: params
  })
}

//  添加支付渠道
export function addChannel(data) {
  return request({
    url: '/channel/channel/curd/',
    method: 'post',
    data: data
  })
}

//  修改支付渠道
export function editChannel(data) {
  return request({
    url: '/channel/channel/curd/',
    method: 'patch',
    data: data
  })
}

//  修改支付渠道状态
export function editChannelStatus(data) {
  return request({
    url: '/channel/channel/status/',
    method: 'post',
    data: data
  })
}

//  获取支付通道列表
export function listWay(params) {
  return request({
    url: '/channel/pass/list/',
    method: 'get',
    params: params
  })
}

//  添加支付通道
export function addWay(data) {
  return request({
    url: '/channel/pass/curd/',
    method: 'post',
    data: data
  })
}

//  修改支付通道
export function editWay(data) {
  return request({
    url: '/channel/pass/curd/',
    method: 'patch',
    data: data
  })
}

//  修改支付通道状态
export function editWayStatus(data) {
  return request({
    url: '/channel/pass/status/',
    method: 'post',
    data: data
  })
}

//  获取充值总数量
export function successRateMerchantPay(params) {
  return request({
    url: '/monitoring/pay/number/',
    method: 'get',
    params: params
  })
}

//  获取充值总金额
export function successRateMerchantDraw(params) {
  return request({
    url: '/monitoring/pay/money/',
    method: 'get',
    params: params
  })
}

//  获取充值成功率
export function successRateChannelPay(params) {
  return request({
    url: '/monitoring/pay/rate/',
    method: 'get',
    params: params
  })
}

//  获取资源充值成功率
export function successRateResPay(params) {
  return request({
    url: '/monitoring/res_pay/rate/',
    method: 'get',
    params: params
  })
}

//  获取余额
export function successRateChannelDraw(params) {
  return request({
    url: '/monitoring/pay/balance/',
    method: 'get',
    params: params
  })
}

//  获取头部订单总计
export function listOrderDay(params) {
  return request({
    url: '/monitoring/pay/order/',
    method: 'get',
    params: params
  })
}

export function channelBalance(params) {
  return request({
    url: '/monitoring/channel/balance/',
    method: 'get',
    params: params
  })
}

//  充值订单手工确认
export function orderRechargeToSuccess(data) {
  return request({
    url: '/order/pay/to_success/',
    method: 'post',
    data: data
  })
}

export function orderDrawToSuccess(data) {
  return request({
    url: '/service/order-draw/to-success/',
    method: 'post',
    data: data
  })
}

export function resetOrderDrawQueryCount(data) {
  return request({
    url: '/service/order-draw/draw-query-count/reset/',
    method: 'post',
    data: data
  })
}

export function orderDrawQueryMore(data) {
  return request({
    url: '/service/order-draw/query-more/',
    method: 'post',
    data: data
  })
}

export function orderRechargeQueryMore(data) {
  return request({
    url: '/service/order-recharge/query-more/',
    method: 'post',
    data: data
  })
}

//  获取转账订单列表
export function listOrderDraw(params) {
  return request({
    url: '/order/draw/list/',
    method: 'get',
    params: params
  })
}

//  提现订单回调订单状态
export function drawOrderCallback(data) {
  return request({
    url: '/order/draw/callback/',
    method: 'post',
    data: data
  })
}

//  转账订单导出excel
export function orderDrawExcel(params) {
  return request({
    url: '/order/draw/excel/',
    method: 'get',
    params: params
  })
}

export function listMerchant(params) {
  return request({
    url: '/merchant/account/list/',
    method: 'get',
    params: params
  })
}

//  获取商户通道list
export function listFictitious(params) {
  return request({
    url: '/merchant/channel/list/',
    method: 'get',
    params: params
  })
}
//  获取商户通道商户树结构
export function listFictitiousTree(params) {
  return request({
    url: '/merchant/channel/treeList/',
    method: 'get'
  })
}

//  修改商户通道
export function updateFictitious(data) {
  return request({
    url: '/merchant/channel/curd/',
    method: 'patch',
    data: data
  })
}

//  添加商户通道
export function addFictitious(data) {
  return request({
    url: '/merchant/channel/curd/',
    method: 'post',
    data: data
  })
}

//  删除商户通道
export function deleteFictitious(data) {
  return request({
    url: '/merchant/channel/curd/',
    method: 'put',
    data: data
  })
}

//  改变商户通道状态
export function banFictitious(data) {
  return request({
    url: '/merchant/channel/status/',
    method: 'post',
    data: data
  })
}

export function changeFictitiousBalance(data) {
  return request({
    url: '/service/fictitious/change_balance/',
    method: 'post',
    data: data
  })
}

// vuex用
export function loadMerchantIdAndName(params) {
  return request({
    url: '/merchant/account/treeList/',
    method: 'get'
  })
}
// vuex用
export function loadAgentIdAndName(params) {
  return request({
    url: '/service/agent/loadAgentIdAndName/',
    method: 'get'
  })
}

//  修改商户
export function updateMerchant(data) {
  return request({
    url: '/merchant/account/curd/',
    method: 'patch',
    data: data
  })
}

//  添加商户
export function addMerchant(data) {
  return request({
    url: '/merchant/account/curd/',
    method: 'post',
    data: data
  })
}

//  删除商户
export function deleteMerchant(data) {
  return request({
    url: '/merchant/account/curd/',
    method: 'put',
    data: data
  })
}

//  修改提现余额
export function merchantAddMoney(data) {
  return request({
    url: '/merchant/update/max/',
    method: 'put',
    data: data
  })
}

export function listAgent(params) {
  return request({
    url: '/service/agent/list/',
    method: 'get',
    params: params
  })
}

export function addAgent(data) {
  return request({
    url: '/service/agent/curd/',
    method: 'post',
    data: data
  })
}

export function updateAgent(data) {
  return request({
    url: '/service/agent/curd/',
    method: 'patch',
    data: data
  })
}

export function banAagent(data) {
  return request({
    url: '/service/agent/ban/',
    method: 'post',
    data: data
  })
}

export function toogleDrawStatus(data) {
  return request({
    url: '/service/agent/change_draw_status/',
    method: 'post',
    data: data
  })
}

export function toogleRechargeStatus(data) {
  return request({
    url: '/service/agent/change_recharge_status/',
    method: 'post',
    data: data
  })
}

export function aliWapLoginOut(params) {
  return request({
    url: '/service/agent/ali_wap_login_out/',
    method: 'get',
    params: params
  })
}

export function agentAddMoney(data) {
  return request({
    url: '/service/agent/addmoney/',
    method: 'post',
    data: data
  })
}

export function listQrcode(params) {
  return request({
    url: '/service/qrcode/list/',
    method: 'get',
    params: params
  })
}

export function banQrcode(data) {
  return request({
    url: '/service/qrcode/ban/',
    method: 'post',
    data: data
  })
}

export function listRebotComputer(params) {
  return request({
    url: '/service/rebot_computer/list/',
    method: 'get',
    params: params
  })
}

export function listRebotPhone(params) {
  return request({
    url: '/service/rebot_phone/list/',
    method: 'get',
    params: params
  })
}

//  批量修改充值限额
export function updateMerchantDayRechargeMax(data) {
  return request({
    url: '/merchant/update/max/',
    method: 'post',
    data: data
  })
}

//  批量修改提现限额
export function updateMerchantDayDrawMax(data) {
  return request({
    url: '/merchant/update/max/',
    method: 'patch',
    data: data
  })
}

//  修改商户状态
export function banMerchant(data) {
  return request({
    url: '/merchant/update/status/',
    method: 'post',
    data: data
  })
}

export function banMerchantRechargeFlag(data) {
  return request({
    url: '/merchant/update/status/',
    method: 'patch',
    data: data
  })
}

export function banMerchantDrawFlag(data) {
  return request({
    url: '/merchant/update/status/',
    method: 'put',
    data: data
  })
}

export function listDrawRobbingRecord(params) {
  return request({
    url: '/service/draw_robbing_record/list/',
    method: 'get',
    params: params
  })
}

export function listOrderQueryBackground(params) {
  return request({
    url: '/service/order_query_background/list/',
    method: 'get',
    params: params
  })
}


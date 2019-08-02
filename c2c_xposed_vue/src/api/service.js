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

//  获取银行关系列表
export function listBankConfig(query) {
  return request({
    url: '/service/bank_config/list/',
    method: 'get',
    params: query
  })
}

//  获取银行关系选择列表
export function listBankSelectConfig(query) {
  return request({
    url: '/service/bank_config/selectList/',
    method: 'get',
    params: query
  })
}

//  添加银行关系
export function addBankConfig(data) {
  return request({
    url: '/service/bank_config/curd/',
    method: 'post',
    data: data
  })
}

//  修改银行关系
export function editBankConfig(data) {
  return request({
    url: '/service/bank_config/curd/',
    method: 'patch',
    data: data
  })
}

//  获取网关配置列表
export function listGateway(query) {
  return request({
    url: '/service/gateway/list/',
    method: 'get',
    params: query
  })
}

//  获取网关AP配置列表
export function listGatewayAp(query) {
  return request({
    url: '/service/gateway_ap/list/',
    method: 'get',
    params: query
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

//  获取耗材选择列表
export function listTpResourceApiSelectList(params) {
  return request({
    url: '/order/tp_resource_api/selectList/',
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

//  添加耗材到缓存中
export function statusResourceCache(data) {
  return request({
    url: '/order/tp_resource_api/status/',
    method: 'patch',
    data: data
  })
}

//  修改每日限额
export function updateResourceMaxMoney(data) {
  return request({
    url: '/order/tp_resource_api/update/',
    method: 'post',
    data: data
  })
}

//  清理失败次数
export function updateResourceFailedCount(data) {
  return request({
    url: '/order/tp_resource_api/update/',
    method: 'patch',
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

//  获取未匹配充值订单列表
export function listOrderMiss(params) {
  return request({
    url: '/order/miss/list/',
    method: 'get',
    params: params
  })
}

//  确认未匹配充值订单
export function orderMissSucc(data) {
  return request({
    url: '/order/miss/curd/',
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

//  删除支付渠道
export function deleteChannel(data) {
  return request({
    url: '/channel/channel/curd/',
    method: 'put',
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

//  删除支付通道
export function deleteWay(data) {
  return request({
    url: '/channel/pass/curd/',
    method: 'put',
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

//  获取总订单成功率
export function successRateMerchantPay(params) {
  return request({
    url: '/monitoring/order_pay/list/',
    method: 'get',
    params: params
  })
}

//  获取支付宝订单成功率
export function successRateMerchantDraw(params) {
  return request({
    url: '/monitoring/alipay_pay/list/',
    method: 'get',
    params: params
  })
}

//  获取代理充值成功率
export function merchantBalance(params) {
  return request({
    url: '/monitoring/agent_pay/list/',
    method: 'get',
    params: params
  })
}

//  获取微信订单成功率
export function successRateChannelPay(params) {
  return request({
    url: '/monitoring/wx_pay/list/',
    method: 'get',
    params: params
  })
}

//  获取云闪付订单成功率
export function successRateChannelDraw(params) {
  return request({
    url: '/monitoring/union_pay/list/',
    method: 'get',
    params: params
  })
}

//  获取代理余额
export function channelBalance(params) {
  return request({
    url: '/monitoring/agent_balance/list/',
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

//  充值订单手工确认
export function orderDrawToSuccess(data) {
  return request({
    url: '/order/draw/to_success/',
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

//  获取银行卡列表
export function listBank(params) {
  return request({
    url: '/order/bank/list/',
    method: 'get',
    params: params
  })
}

//  添加银行卡
export function addBank(data) {
  return request({
    url: '/order/bank/curd/',
    method: 'post',
    data: data
  })
}

//  修改银行卡
export function editBank(data) {
  return request({
    url: '/order/bank/curd/',
    method: 'patch',
    data: data
  })
}

//  删除银行卡
export function delBank(data) {
  return request({
    url: '/order/bank/curd/',
    method: 'put',
    data: data
  })
}

//  清除银行卡失败次数
export function updateBankFailCount(params) {
  return request({
    url: '/order/bank/curd/',
    method: 'get',
    params: params
  })
}

//  修改银行卡状态
export function updateBankStatus(data) {
  return request({
    url: '/order/bank/status/',
    method: 'post',
    data: data
  })
}

//  修改银行卡限额
export function editStatusBank(data) {
  return request({
    url: '/order/bank/status/',
    method: 'patch',
    data: data
  })
}

export function listMerchant(params) {
  return request({
    url: '/merchant/account/list/',
    method: 'get',
    params: params
  })
}

//  获取通道权重list
export function listWayWeight(params) {
  return request({
    url: '/merchant/way_weight/list/',
    method: 'get',
    params: params
  })
}

//  添加通道权重
export function addWayWeight(data) {
  return request({
    url: '/merchant/way_weight/curd/',
    method: 'post',
    data: data
  })
}

//  修改通道权重
export function editWayWeight(data) {
  return request({
    url: '/merchant/way_weight/curd/',
    method: 'patch',
    data: data
  })
}

//  删除通道权重
export function delWayWeight(data) {
  return request({
    url: '/merchant/way_weight/curd/',
    method: 'put',
    data: data
  })
}

//  重载通道权重
export function resetWayWeight(data) {
  return request({
    url: '/merchant/way_weight/reload/',
    method: 'post',
    data: data
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

//  重载商户通道
export function reloadMerchantWay(data) {
  return request({
    url: '/merchant/channel/status/',
    method: 'patch',
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
    url: '/agent/account/selectList/',
    method: 'get'
  })
}
// vuex用
export function loadChannelWayCodeAndName(params) {
  return request({
    url: '/channel/pass/selectlist/',
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

//  重载商户
export function reloadMerchant(data) {
  return request({
    url: '/merchant/account/reload/',
    method: 'post',
    data: data
  })
}

export function merchantAddMoney(data) {
  return request({
    url: '/service/merchant/addmoney/',
    method: 'post',
    data: data
  })
}

//  获取代理列表
export function listAgent(params) {
  return request({
    url: '/agent/account/list/',
    method: 'get',
    params: params
  })
}

//  添加代理
export function addAgent(data) {
  return request({
    url: '/agent/account/curd/',
    method: 'post',
    data: data
  })
}

// 修改代理
export function updateAgent(data) {
  return request({
    url: '/agent/account/curd/',
    method: 'patch',
    data: data
  })
}

//  删除代理
export function delAagent(data) {
  return request({
    url: '/agent/account/curd/',
    method: 'put',
    data: data
  })
}

// 修改代理登陆状态
export function statusLoginAagent(data) {
  return request({
    url: '/agent/account/status/',
    method: 'post',
    data: data
  })
}

// 修改代理状态
export function statusAagent(data) {
  return request({
    url: '/agent/account/status/',
    method: 'patch',
    data: data
  })
}

// 修改代理到缓存
export function statusAagentCache(data) {
  return request({
    url: '/agent/account/status/',
    method: 'put',
    data: data
  })
}

// 修改代理余额
export function editAagentBalance(data) {
  return request({
    url: '/agent/account/balance/',
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

//  获取机器人列表
export function listRebotComputer(params) {
  return request({
    url: '/robot/robot/list/',
    method: 'get',
    params: params
  })
}

//  添加机器人
export function addRebotComputer(data) {
  return request({
    url: '/robot/robot/curd/',
    method: 'post',
    data: data
  })
}

//  删除机器人
export function delRebotComputer(data) {
  return request({
    url: '/robot/robot/curd/',
    method: 'put',
    data: data
  })
}

//  获取代理服务器列表
export function listRebotPhone(params) {
  return request({
    url: '/robot/proxy/list/',
    method: 'get',
    params: params
  })
}

//  获取代理服务器选择列表
export function listSelectRebotPhone(params) {
  return request({
    url: '/robot/proxy/selectList/',
    method: 'get',
    params: params
  })
}

//  添加代理服务器
export function addRebotPhone(data) {
  return request({
    url: '/robot/proxy/curd/',
    method: 'post',
    data: data
  })
}

//  修改代理服务器
export function editRebotPhone(data) {
  return request({
    url: '/robot/proxy/curd/',
    method: 'patch',
    data: data
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

//  获取首总览
export function listOrderPayMonitoring(params) {
  return request({
    url: '/monitoring/order/pay/',
    method: 'get',
    params: params
  })
}

//  获取代理首总览
export function listAgentOrderMonitoring(params) {
  return request({
    url: '/monitoring/agent_order/pay/',
    method: 'get',
    params: params
  })
}


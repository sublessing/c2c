<template>
  <div>
    <el-card v-loading="loading" style="width:100%;">
      <el-row class="item">更新时间：{{max_time}}</el-row>
      <el-row>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="昨日" name="day"></el-tab-pane>
          <el-tab-pane label="7日" name="week"></el-tab-pane>
          <el-tab-pane label="30日" name="month"></el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- <el-card  > -->
            <div class="text">
              <el-row class="item">
                充值订单总数量：{{newestData.order_recharge_num}} |&nbsp;&nbsp;
                  {{oldData.order_recharge_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.order_recharge_num > oldData.order_recharge_num,desc: newestData.order_recharge_num <= oldData.order_recharge_num }">
                  {{((oldData.order_recharge_num == 0 && newestData.order_recharge_num != 0) ? 1 : ((newestData.order_recharge_num - oldData.order_recharge_num)) / oldData.order_recharge_num) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_recharge_num > oldData.order_recharge_num ? '↑': '↓'"></span>
                </span>
              </el-row>

              <el-row class="item">
                充值订单完成数量：{{newestData.order_recharge_succ_num}} |&nbsp;&nbsp;
                  {{oldData.order_recharge_succ_num}}&nbsp;&nbsp;
                <span :class='{asc: newestData.order_recharge_succ_num > oldData.order_recharge_succ_num, desc: newestData.order_recharge_succ_num <= oldData.order_recharge_succ_num}'>
                  {{((oldData.order_recharge_succ_num == 0 && newestData.order_recharge_succ_num != 0) ? 1 : ((newestData.order_recharge_succ_num - oldData.order_recharge_succ_num)) / oldData.order_recharge_succ_num) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_recharge_succ_num > oldData.order_recharge_succ_num ? '↑': '↓'"></span>
                </span>
              </el-row>

              <el-row class="item">
                充值订单总金额：{{$priceFormat((newestData.order_recharge_money?newestData.order_recharge_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.order_recharge_money?oldData.order_recharge_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class='{asc: newestData.order_recharge_money > oldData.order_recharge_money, desc: newestData.order_recharge_money <= oldData.order_recharge_money}'>
                  {{((oldData.order_recharge_money == 0 && newestData.order_recharge_money != 0) ? 1 : ((newestData.order_recharge_money - oldData.order_recharge_money) / oldData.order_recharge_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_recharge_money > oldData.order_recharge_money ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                充值订单完成金额：{{$priceFormat((newestData.order_recharge_succ_money?newestData.order_recharge_succ_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.order_recharge_succ_money?oldData.order_recharge_succ_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class='{asc: newestData.order_recharge_succ_money > oldData.order_recharge_succ_money, desc: newestData.order_recharge_succ_money <= oldData.order_recharge_succ_money}'>
                  {{((oldData.order_recharge_succ_money == 0 && newestData.order_recharge_succ_money != 0) ? 1 : ((newestData.order_recharge_succ_money - oldData.order_recharge_succ_money) / oldData.order_recharge_succ_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_recharge_succ_money > oldData.order_recharge_succ_money ? '↑': '↓'"></span>
                </span>
              </el-row>
            </div>
          <!-- </el-card> -->
        </el-col>
        <el-col :span="12">
          <!-- <el-card  > -->
            <div class="text">
              <el-row class="item">
                转账订单总数量：{{newestData.order_draw_num}} |&nbsp;&nbsp;
                  {{oldData.order_draw_num}}&nbsp;&nbsp;
                <span :class='{asc: newestData.order_draw_num > oldData.order_draw_num, desc: newestData.order_draw_num <= oldData.order_draw_num}'>
                  {{((oldData.order_draw_num == 0 && newestData.order_draw_num != 0) ? 1 : ((newestData.order_draw_num - oldData.order_draw_num) / oldData.order_draw_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_draw_num > oldData.order_draw_num ? '↑': '↓'"></span>
                </span>
              </el-row>

              <el-row class="item">
                转账订单完成数量：{{newestData.order_draw_succ_num}} |&nbsp;&nbsp;
                  {{oldData.order_draw_succ_num}}&nbsp;&nbsp;
                <span :class='{asc: newestData.order_draw_succ_num > oldData.order_draw_succ_num, desc: newestData.order_draw_succ_num <= oldData.order_draw_succ_num}'>
                  {{((oldData.order_draw_succ_num == 0 && newestData.order_draw_succ_num != 0) ? 1 : ((newestData.order_draw_succ_num - oldData.order_draw_succ_num)) / oldData.order_draw_succ_num) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_draw_succ_num > oldData.order_draw_succ_num ? '↑': '↓'"></span>
                </span>
              </el-row>

              <el-row class="item">
                转账订单总金额：{{$priceFormat((newestData.order_draw_money?newestData.order_draw_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.order_draw_money?oldData.order_draw_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class='{asc: newestData.order_draw_money > oldData.order_draw_money, desc: newestData.order_draw_money <= oldData.order_draw_money}'>
                  {{((oldData.order_draw_money == 0 && newestData.order_draw_money != 0) ? 1 : ((newestData.order_draw_money - oldData.order_draw_money)) / oldData.order_draw_money) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_draw_money > oldData.order_draw_money? '↑': '↓'"></span>
                </span>
              </el-row>

              <el-row class="item">
                转账订单完成金额：{{$priceFormat((newestData.order_draw_succ_money?newestData.order_draw_succ_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.order_draw_succ_money?oldData.order_draw_succ_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class='{asc: newestData.order_draw_succ_money > oldData.order_draw_succ_money, desc: newestData.order_draw_succ_money <= oldData.order_draw_succ_money}'>
                  {{((oldData.order_draw_succ_money == 0 && newestData.order_draw_succ_money != 0) ? 1 : ((newestData.order_draw_succ_money - oldData.order_draw_succ_money)) / oldData.order_draw_succ_money) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_draw_succ_money > oldData.order_draw_succ_money? '↑': '↓'"></span>
                </span>
              </el-row>
            </div>
          <!-- </el-card> -->
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//  首页头部统计
import { listPayOrder } from '@/api/service'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      max_time: null,
      newestData: {},
      oldData: {},
      timer: null,
      loading: false,
      activeName: 'day',
      params: {
        day__gte: parseTime(
          new Date().getTime(),
          '{y}-{m}-{d} {h}:{i}:{s}'
        ),
        day__lte: parseTime(
          new Date().getTime(),
          '{y}-{m}-{d} {h}:{i}:{s}'
        )
      }
    }
  },
  created() {
    this.handleClick()
    this.timer = setInterval(this.fetchData, 60 * 1000*2)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    handleClick(item) {
      var num = 1;
      if (item && item.name === 'week') {
        num = 7;
      }
      if (item && item.name === 'month') {
        num = 30;
      }
      this.params.day__gte = parseTime(new Date().getTime()-1000*60*60*24*num, '{y}-{m}-{d} {h}')+':00:00'
      this.params.day__lte = parseTime(new Date().getTime(), '{y}-{m}-{d} {h}')+':00:00'
      this.fetchData()
    },
    fetchData() { // 获取数据
      this.loading = true
      listPayOrder(this.params).then(response => {
        this.max_time = parseTime(
          new Date().getTime(),
          '{y}-{m}-{d} {h}:{i}:{s}'
        )
        var leng = response.data.items.length
        this.oldData = {
          order_recharge_num: response.data.items[leng-1] ? response.data.items[leng-1].order_pay_num : 0,
          order_recharge_succ_num: response.data.items[leng-1] ? response.data.items[leng-1].order_pay_succ_num : 0,
          order_recharge_money: response.data.items[leng-1] ? response.data.items[leng-1].order_pay_money : 0,
          order_recharge_succ_money: response.data.items[leng-1] ? response.data.items[leng-1].order_pay_succ_money : 0,
          order_draw_num: response.data.items[leng-1] ? response.data.items[leng-1].order_draw_num : 0,
          order_draw_succ_num: response.data.items[leng-1] ? response.data.items[leng-1].order_draw_succ_num : 0,
          order_draw_money: response.data.items[leng-1] ? response.data.items[leng-1].order_draw_money : 0,
          order_draw_succ_money: response.data.items[leng-1] ? response.data.items[leng-1].order_draw_succ_money : 0,
        }
        this.newestData = {
          order_recharge_num: response.data.items[0] ? response.data.items[0].order_pay_num : 0,
          order_recharge_succ_num: response.data.items[0] ? response.data.items[0].order_pay_succ_num : 0,
          order_recharge_money: response.data.items[0] ? response.data.items[0].order_pay_money : 0,
          order_recharge_succ_money: response.data.items[0] ? response.data.items[0].order_pay_succ_money : 0,
          order_draw_num: response.data.items[0] ? response.data.items[0].order_draw_num : 0,
          order_draw_succ_num: response.data.items[0] ? response.data.items[0].order_draw_succ_num : 0,
          order_draw_money: response.data.items[0] ? response.data.items[0].order_draw_money : 0,
          order_draw_succ_money: response.data.items[0] ? response.data.items[0].order_draw_succ_money : 0,
        }
        this.loading = false
      })
    }
  }
}
</script>


<style scoped>
.chart-container {
  position: relative;
  width: 50%;
  height: 30%;
}

.asc {
  color: #f56c6c;
}

.desc {
  color: #67c23a;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 10px;
}

a:focus,
a:link {
  text-decoration: none;
  color: black;
}

a:visited {
  text-decoration: none;
  color: black;
}

a:hover {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

a:active {
  outline: none;
}
</style>

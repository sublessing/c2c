<template>
  <div>
    <el-card v-loading="loading" style="width:100%;">
      <el-row class="item" style="margin-bottom: 20px;">更新时间：{{max_time}}</el-row>
      <el-row>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="昨日" name="day"></el-tab-pane>
          <el-tab-pane label="7日" name="week"></el-tab-pane>
          <el-tab-pane label="30日" name="month"></el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row>
        <el-col :span="6">
            <h3>总充值订单</h3>
            <div class="text">
              <el-row class="item">
                总数量：{{newestData.order_num}} |&nbsp;&nbsp;
                  {{oldData.order_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.order_num > oldData.order_num,desc: newestData.order_num <= oldData.order_num }">
                  {{((oldData.order_num == 0 && newestData.order_num != 0) ? 1 : ((newestData.order_num - oldData.order_num) / oldData.order_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_num > oldData.order_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                完成数量：{{newestData.order_succ_num}} |&nbsp;&nbsp;
                  {{oldData.order_succ_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.order_succ_num > oldData.order_succ_num,desc: newestData.order_succ_num <= oldData.order_succ_num }">
                  {{((oldData.order_succ_num == 0 && newestData.order_succ_num != 0) ? 1 : ((newestData.order_succ_num - oldData.order_succ_num) / oldData.order_succ_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_succ_num > oldData.order_succ_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                总金额：{{$priceFormat((newestData.order_money?newestData.order_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.order_money?oldData.order_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.order_money > oldData.order_money,desc: newestData.order_money <= oldData.order_money }">
                  {{((oldData.order_money == 0 && newestData.order_money != 0) ? 1 : ((newestData.order_money - oldData.order_money) / oldData.order_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_money > oldData.order_money ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                完成金额：{{$priceFormat((newestData.order_succ_money?newestData.order_succ_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.order_succ_money?oldData.order_succ_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.order_succ_money > oldData.order_succ_money,desc: newestData.order_succ_money <= oldData.order_succ_money }">
                  {{((oldData.order_succ_money == 0 && newestData.order_succ_money != 0) ? 1 : ((newestData.order_succ_money - oldData.order_succ_money) / oldData.order_succ_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_succ_money > oldData.order_succ_money ? '↑': '↓'"></span>
                </span>
              </el-row>
            </div>
        </el-col>
        <el-col :span="6">
            <h3>银联</h3>
            <div class="text">
              <el-row class="item">
                总数量：{{newestData.union_order_num}} |&nbsp;&nbsp;
                  {{oldData.union_order_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.union_order_num > oldData.union_order_num,desc: newestData.union_order_num <= oldData.union_order_num }">
                  {{((oldData.union_order_num == 0 && newestData.union_order_num != 0) ? 1 : ((newestData.union_order_num - oldData.union_order_num) / oldData.union_order_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.union_order_num > oldData.union_order_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                完成数量：{{newestData.union_succ_num}} |&nbsp;&nbsp;
                  {{oldData.union_succ_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.union_succ_num > oldData.union_succ_num,desc: newestData.union_succ_num <= oldData.union_succ_num }">
                  {{((oldData.union_succ_num == 0 && newestData.union_succ_num != 0) ? 1 : ((newestData.union_succ_num - oldData.union_succ_num) / oldData.union_succ_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.union_succ_num > oldData.union_succ_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                总金额：{{$priceFormat((newestData.union_order_money?newestData.union_order_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.union_order_money?oldData.union_order_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.union_order_money > oldData.union_order_money,desc: newestData.union_order_money <= oldData.union_order_money }">
                  {{((oldData.union_order_money == 0 && newestData.union_order_money != 0) ? 1 : ((newestData.union_order_money - oldData.union_order_money) / oldData.union_order_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.union_order_money > oldData.union_order_money ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                完成金额：{{$priceFormat((newestData.union_succ_money?newestData.union_succ_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.union_succ_money?oldData.union_succ_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.union_succ_money > oldData.union_succ_money,desc: newestData.union_succ_money <= oldData.union_succ_money }">
                  {{((oldData.union_succ_money == 0 && newestData.union_succ_money != 0) ? 1 : ((newestData.union_succ_money - oldData.union_succ_money) / oldData.union_succ_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.union_succ_money > oldData.union_succ_money ? '↑': '↓'"></span>
                </span>
              </el-row>
            </div>
        </el-col>
        <el-col :span="6">
            <h3>支付宝</h3>
            <div class="text">
              <el-row class="item">
                总数量：{{newestData.alipay_order_num}} |&nbsp;&nbsp;
                  {{oldData.alipay_order_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.alipay_order_num > oldData.alipay_order_num,desc: newestData.alipay_order_num <= oldData.alipay_order_num }">
                  {{((oldData.alipay_order_num == 0 && newestData.alipay_order_num != 0) ? 1 : ((newestData.alipay_order_num - oldData.alipay_order_num) / oldData.alipay_order_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.alipay_order_num > oldData.alipay_order_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                完成数量：{{newestData.alipay_succ_num}} |&nbsp;&nbsp;
                  {{oldData.alipay_succ_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.alipay_succ_num > oldData.alipay_succ_num,desc: newestData.alipay_succ_num <= oldData.alipay_succ_num }">
                  {{((oldData.alipay_succ_num == 0 && newestData.alipay_succ_num != 0) ? 1 : ((newestData.alipay_succ_num - oldData.alipay_succ_num) / oldData.alipay_succ_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.alipay_succ_num > oldData.alipay_succ_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                总金额：{{$priceFormat((newestData.alipay_order_money?newestData.alipay_order_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.alipay_order_money?oldData.alipay_order_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.alipay_order_money > oldData.alipay_order_money,desc: newestData.alipay_order_money <= oldData.alipay_order_money }">
                  {{((oldData.alipay_order_money == 0 && newestData.alipay_order_money != 0) ? 1 : ((newestData.alipay_order_money - oldData.alipay_order_money) / oldData.alipay_order_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.alipay_order_money > oldData.alipay_order_money ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                完成金额：{{$priceFormat((newestData.alipay_succ_money?newestData.alipay_succ_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.alipay_succ_money?oldData.alipay_succ_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.alipay_succ_money > oldData.alipay_succ_money,desc: newestData.alipay_succ_money <= oldData.alipay_succ_money }">
                  {{((oldData.alipay_succ_money == 0 && newestData.alipay_succ_money != 0) ? 1 : ((newestData.alipay_succ_money - oldData.alipay_succ_money) / oldData.alipay_succ_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.alipay_succ_money > oldData.alipay_succ_money ? '↑': '↓'"></span>
                </span>
              </el-row>
            </div>
        </el-col>
        <el-col :span="6">
            <h3>微信</h3>
            <div class="text">
              <el-row class="item">
                总数量：{{newestData.wx_order_num}} |&nbsp;&nbsp;
                  {{oldData.wx_order_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.wx_order_num > oldData.wx_order_num,desc: newestData.wx_order_num <= oldData.wx_order_num }">
                  {{((oldData.wx_order_num == 0 && newestData.wx_order_num != 0) ? 1 : ((newestData.wx_order_num - oldData.wx_order_num) / oldData.wx_order_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.wx_order_num > oldData.wx_order_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                完成数量：{{newestData.wx_succ_num}} |&nbsp;&nbsp;
                  {{oldData.wx_succ_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.wx_succ_num > oldData.wx_succ_num,desc: newestData.wx_succ_num <= oldData.wx_succ_num }">
                  {{((oldData.wx_succ_num == 0 && newestData.wx_succ_num != 0) ? 1 : ((newestData.wx_succ_num - oldData.wx_succ_num) / oldData.wx_succ_num)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.wx_succ_num > oldData.wx_succ_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                总金额：{{$priceFormat((newestData.wx_order_money?newestData.wx_order_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.wx_order_money?oldData.wx_order_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.wx_order_money > oldData.wx_order_money,desc: newestData.wx_order_money <= oldData.wx_order_money }">
                  {{((oldData.wx_order_money == 0 && newestData.wx_order_money != 0) ? 1 : ((newestData.wx_order_money - oldData.wx_order_money) / oldData.wx_order_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.wx_order_money > oldData.wx_order_money ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                完成金额：{{$priceFormat((newestData.wx_succ_money?newestData.wx_succ_money:0).toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat((oldData.wx_succ_money?oldData.wx_succ_money:0).toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.wx_succ_money > oldData.wx_succ_money,desc: newestData.wx_succ_money <= oldData.wx_succ_money }">
                  {{((oldData.wx_succ_money == 0 && newestData.wx_succ_money != 0) ? 1 : ((newestData.wx_succ_money - oldData.wx_succ_money) / oldData.wx_succ_money)) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.wx_succ_money > oldData.wx_succ_money ? '↑': '↓'"></span>
                </span>
              </el-row>
            </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//  首页头部统计
import { listOrderDay } from '@/api/service'
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
      listOrderDay(this.params).then(response => {
        this.max_time = parseTime(
          new Date().getTime(),
          '{y}-{m}-{d} {h}:{i}:{s}'
        )
        var leng = response.data.items.length
        this.oldData = {
          order_num: response.data.items[leng-1] ? response.data.items[leng-1].order_num : 0,
          order_succ_num: response.data.items[leng-1] ? response.data.items[leng-1].order_succ_num : 0,
          order_money: response.data.items[leng-1] ? response.data.items[leng-1].order_money : 0,
          order_succ_money: response.data.items[leng-1] ? response.data.items[leng-1].order_succ_money : 0,
          union_order_num: response.data.items[leng-1] ? response.data.items[leng-1].union_order_num : 0,
          union_succ_num: response.data.items[leng-1] ? response.data.items[leng-1].union_succ_num : 0,
          union_order_money: response.data.items[leng-1] ? response.data.items[leng-1].union_order_money : 0,
          union_succ_money: response.data.items[leng-1] ? response.data.items[leng-1].union_succ_money : 0,
          alipay_order_num: response.data.items[leng-1] ? response.data.items[leng-1].alipay_order_num : 0,
          alipay_succ_num: response.data.items[leng-1] ? response.data.items[leng-1].alipay_succ_num : 0,
          alipay_order_money: response.data.items[leng-1] ? response.data.items[leng-1].alipay_order_money : 0,
          alipay_succ_money: response.data.items[leng-1] ? response.data.items[leng-1].alipay_succ_money : 0,
          wx_order_num: response.data.items[leng-1] ? response.data.items[leng-1].wx_order_num : 0,
          wx_succ_num: response.data.items[leng-1] ? response.data.items[leng-1].wx_succ_num : 0,
          wx_order_money: response.data.items[leng-1] ? response.data.items[leng-1].wx_order_money : 0,
          wx_succ_money: response.data.items[leng-1] ? response.data.items[leng-1].wx_succ_money : 0,
        }
        this.newestData = {
          order_num: response.data.items[0] ? response.data.items[0].order_num : 0,
          order_succ_num: response.data.items[0] ? response.data.items[0].order_succ_num : 0,
          order_money: response.data.items[0] ? response.data.items[0].order_money : 0,
          order_succ_money: response.data.items[0] ? response.data.items[0].order_succ_money : 0,
          union_order_num: response.data.items[0] ? response.data.items[0].union_order_num : 0,
          union_succ_num: response.data.items[0] ? response.data.items[0].union_succ_num : 0,
          union_order_money: response.data.items[0] ? response.data.items[0].union_order_money : 0,
          union_succ_money: response.data.items[0] ? response.data.items[0].union_succ_money : 0,
          alipay_order_num: response.data.items[0] ? response.data.items[0].alipay_order_num : 0,
          alipay_succ_num: response.data.items[0] ? response.data.items[0].alipay_succ_num : 0,
          alipay_order_money: response.data.items[0] ? response.data.items[0].alipay_order_money : 0,
          alipay_succ_money: response.data.items[0] ? response.data.items[0].alipay_succ_money : 0,
          wx_order_num: response.data.items[0] ? response.data.items[0].wx_order_num : 0,
          wx_succ_num: response.data.items[0] ? response.data.items[0].wx_succ_num : 0,
          wx_order_money: response.data.items[0] ? response.data.items[0].wx_order_money : 0,
          wx_succ_money: response.data.items[0] ? response.data.items[0].wx_succ_money : 0,
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

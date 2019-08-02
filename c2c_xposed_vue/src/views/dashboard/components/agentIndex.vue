<template>
  <div>
    <el-card v-loading="loading" style="width:100%; height:100%">
      <el-row class="item">更新时间：{{max_time}}</el-row>
      <el-row>
        <el-col :span="12">
            <h2>当前余额：{{balance}}元</h2>
            <!-- <div class="text">
              <el-row class="item">
                充值订单完成总数量：{{newestData.order_recharge_num}} |&nbsp;&nbsp;
                  {{oldData.order_recharge_num}}&nbsp;&nbsp;
                <span :class="{asc: newestData.order_recharge_num > oldData.order_recharge_num,desc: newestData.order_recharge_num <= oldData.order_recharge_num }">
                  {{((newestData.order_recharge_num - oldData.order_recharge_num) / oldData.order_recharge_num) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_recharge_num > oldData.order_recharge_num ? '↑': '↓'"></span>
                </span>
              </el-row>
              <el-row class="item">
                充值订单完成总金额：{{$priceFormat(newestData.order_recharge_money.toFixed(2))}} |&nbsp;&nbsp;
                  {{$priceFormat(oldData.order_recharge_money.toFixed(2))}}&nbsp;&nbsp;
                <span :class="{asc: newestData.order_recharge_money > oldData.order_recharge_money,desc: newestData.order_recharge_money <= oldData.order_recharge_money }">
                  {{((newestData.alipay_recharge_num - oldData.order_recharge_money) / oldData.order_recharge_money) | toPercentFilter}} &nbsp;&nbsp;
                  <span v-text="newestData.order_recharge_money > oldData.order_recharge_money ? '↑': '↓'"></span>
                </span>
              </el-row>
            </div> -->
        </el-col>
        <el-col :span="12">
            <div class="text">
                <el-button type="primary" style="width: 100px;border-radius: 2px;" @click="concat_admin">转账</el-button>
            </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-table
          v-loading.body="loading"
          :data="list"
          border
          style="width: 100%">
          <el-table-column
            prop="day"
            align="center"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="balance"
            align="center"
            label="余额">
            <template slot-scope="scope">
              {{ $priceFormat(scope.row.balance.toFixed(2)) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_succ_num"
            align="center"
            label="收款笔数">
          </el-table-column>
          <el-table-column
            align="center"
            label="收款金额">
            <template slot-scope="scope">
              {{ $priceFormat(scope.row.order_succ_money.toFixed(2)) }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//  首页头部统计
import { listAgentOrderMonitoring } from '@/api/service'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      list: [],
      max_time: null,
      balance: 0,
      newestData: {},
      oldData: {},
      timer: null,
      loading: false,
      params: {
        day__gte: parseTime(
          new Date().getTime()-24*60*60*1000*7,
          '{y}-{m}-{d}'
        ),
        day__lte: parseTime(
          new Date().getTime() + 24*60*60*1000,
          '{y}-{m}-{d}'
        )
      }
    }
  },
  created() {
    this.fetchData()
    this.timer = setInterval(this.fetchData, 60 * 1000*2)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    fetchData() { // 获取数据
      this.loading = true
      this.params.day__gte = parseTime(new Date(this.params.day__gte).getTime(), '{y}-{m}-{d}')
      this.params.day__lte = parseTime(new Date(this.params.day__lte).getTime(), '{y}-{m}-{d}')
      listAgentOrderMonitoring(this.params).then(response => {
        this.max_time = parseTime(
          new Date().getTime(),
          '{y}-{m}-{d} {h}:{i}:{s}'
        )
        this.list = response.data.items
        // this.oldData = {
        //   order_recharge_num: response.data.items[1] ? response.data.items[1].order_succ_num : 0,
        //   order_recharge_money: response.data.items[1] ? response.data.items[1].order_succ_money : 0,
        // }
        // this.newestData = {
        //   order_recharge_num: response.data.items[0] ? response.data.items[0].order_succ_num : 0,
        //   order_recharge_money: response.data.items[0] ? response.data.items[0].order_succ_money : 0,
        // }
        this.balance = response.data.items[0] ? response.data.items[0].balance : 0
        this.loading = false
      })
    },
    concat_admin () {
        const h = this.$createElement;
        this.$alert(h('p', { style: 'color: teal;text-algin: center;'}, '联系方式：XXXXXXXXX'), '联系管理员', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
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

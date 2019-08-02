<template>
  <div>
    <el-card class="box-card">
      <el-row style="padding: 0 40px;">
        <el-form :inline="true" :model="queryParams" size="mini">
          <el-form-item label="统计日期">
            <el-date-picker v-model="queryParams.day__gte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:130px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" label-width="25px">
            <el-date-picker v-model="queryParams.day__lte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:130px">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">搜 索</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <!--1.总订单成功率 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/order_pay/list/')">
            <order-pay ref="order_pay_view" @connectChart="connectChart"></order-pay>
        </el-col>

        <!--2.支付宝订单成功率 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/alipay_pay/list/')">
            <alipay-pay ref="alipay_pay_view" @connectChart="connectChart"></alipay-pay>
        </el-col>

        <!--3.微信订单成功率 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/wx_pay/list/')">
            <wx-pay ref="wx_pay_view" @connectChart="connectChart"></wx-pay>
        </el-col>

        <!--4.云闪付订单成功率 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/union_pay/list/')">
            <union-pay ref="union_pay_view" @connectChart="connectChart"></union-pay>
        </el-col>

        <!--5.代理充值成功率 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/agent_pay/list/')">
            <agent-pay ref="agent_pay_view" @connectChart="connectChart"></agent-pay>
        </el-col>

        <!--6.代理余额 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/agent_balance/list/')">
            <agent-balance ref="agent_balance_view" @connectChart="connectChart"></agent-balance>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//  统计图标Card
import echarts from 'echarts'
  import { mapGetters } from 'vuex'
  
  import orderPay from '../../monitoring/components/order_pay'
  import alipayPay from '../../monitoring/components/alipay_pay'
  import wxPay from '../../monitoring/components/wx_pay'
  import unionPay from '../../monitoring/components/union_pay'
  import agentPay from '../../monitoring/components/agent_pay'
  import agentBalance from '../../monitoring/components/agent_balance'

  export default {
    components: { orderPay, alipayPay, wxPay, unionPay, agentPay, agentBalance },
    computed: {
      ...mapGetters([
        'roleIds',
        'urls',
        'queryParams'
      ]),
      hasRole() {
        return this.roleIds.includes(1)
      }
    },
    methods: {
      handleFilter() {
        if (this.urls.includes('/monitoring/order_pay/list/')) {
          this.$refs.order_pay_view.fetchData();
        }
        if (this.urls.includes('/monitoring/alipay_pay/list/')) {
          this.$refs.alipay_pay_view.fetchData();
        }
        if (this.urls.includes('/monitoring/wx_pay/list/')) {
          this.$refs.wx_pay_view.fetchData();
        }
        if (this.urls.includes('/monitoring/union_pay/list/')) {
          this.$refs.union_pay_view.fetchData();
        }
        if (this.urls.includes('/monitoring/agent_pay/list/')) {
          this.$refs.agent_pay_view.fetchData();
        }
        if (this.urls.includes('/monitoring/agent_balance/list/')) {
          this.$refs.agent_balance_view.fetchData();
        }
      },
      connectChart () {
        setTimeout(() => {
          var chartList = [];
          if (this.urls.includes('/monitoring/order_pay/list/')) {
            chartList.push(this.$refs.order_pay_view.chart);
          }
          if (this.urls.includes('/monitoring/alipay_pay/list/')) {
            chartList.push(this.$refs.alipay_pay_view.chart);
          }
          if (this.urls.includes('/monitoring/wx_pay/list/')) {
            chartList.push(this.$refs.wx_pay_view.chart);
          }
          if (this.urls.includes('/monitoring/union_pay/list/')) {
            chartList.push(this.$refs.union_pay_view.chart);
          }
          if (this.urls.includes('/monitoring/agent_pay/list/')) {
            chartList.push(this.$refs.agent_pay_view.chart);
          }
          if (this.urls.includes('/monitoring/agent_balance/list/')) {
            chartList.push(this.$refs.agent_balance_view.chart);
          }
          echarts.connect(chartList);
        }, 1000)
      }
    }
  }
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 50%;
  height: 25%;
}

.box-card {
  margin-top: 5px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 5px;
}
</style>


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
        <!--1.商户充值成功率曲线 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/merchant/list/')">
              <merchant-pay ref="merchant_pay_view" @connectChart="connectChart"></merchant-pay>
        </el-col>

        <!--2.商户提现成功率曲线 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/merchant/drawlist/')">
              <merchant-draw ref="merchant_draw_view" @connectChart="connectChart"></merchant-draw>
        </el-col>

        <!--3.渠道充值成功率曲线 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/channel/list/')">
              <channel-pay ref="channel_pay_view" @connectChart="connectChart"></channel-pay>
        </el-col>

        <!--4.渠道提现成功率曲线 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/channel/drawlist/')">
              <channel-draw ref="channel_draw_view" @connectChart="connectChart"></channel-draw>
        </el-col>

        <!--5.商户余额曲线 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/merchant/balance/')">
              <merchant-balance ref="merchant_balance_view" @connectChart="connectChart"></merchant-balance>
        </el-col>

        <!--6.通道余额曲线 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/channel/balance/')">
              <channel-balance ref="channel_balance_view" @connectChart="connectChart"></channel-balance>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//  统计图标Card
import echarts from 'echarts'
  import { mapGetters } from 'vuex'
  // import merchantRechargeSucc from './merchantRechargeSucc'
  // import merchantDrawSucc from './merchantDrawSucc'
  // import channelDrawSucc from './channelDrawSucc'
  // import channelRechargeSucc from './channelRechargeSucc'
  
  import merchantPay from '../../monitoring/components/merchantPay'
  import merchantDraw from '../../monitoring/components/merchantDraw'
  import channelPay from '../../monitoring/components/channelPay'
  import channelDraw from '../../monitoring/components/channelDraw'
  import merchantBalance from '../../monitoring/components/merchantBalance'
  import channelBalance from '../../monitoring/components/channelBalance'

  export default {
    components: { merchantPay, merchantDraw, channelPay, channelDraw, merchantBalance, channelBalance },
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
        if (this.urls.includes('/monitoring/merchant/list/')) {
          this.$refs.merchant_pay_view.fetchData();
        }
        if (this.urls.includes('/monitoring/merchant/drawlist/')) {
          this.$refs.merchant_draw_view.fetchData();
        }
        if (this.urls.includes('/monitoring/channel/list/')) {
          this.$refs.channel_pay_view.fetchData();
        }
        if (this.urls.includes('/monitoring/channel/drawlist/')) {
          this.$refs.channel_draw_view.fetchData();
        }
        if (this.urls.includes('/monitoring/merchant/balance/')) {
          this.$refs.merchant_balance_view.fetchData();
        }
        if (this.urls.includes('/monitoring/channel/balance/')) {
          this.$refs.channel_balance_view.fetchData();
        }
      },
      connectChart () {
        setTimeout(() => {
          var chartList = [];
          if (this.urls.includes('/monitoring/merchant/list/')) {
            chartList.push(this.$refs.merchant_pay_view.chart);
          }
          if (this.urls.includes('/monitoring/merchant/drawlist/')) {
            chartList.push(this.$refs.merchant_draw_view.chart);
          }
          if (this.urls.includes('/monitoring/channel/list/')) {
            chartList.push(this.$refs.channel_pay_view.chart);
          }
          if (this.urls.includes('/monitoring/channel/drawlist/')) {
            chartList.push(this.$refs.channel_draw_view.chart);
          }
          if (this.urls.includes('/monitoring/merchant/balance/')) {
            chartList.push(this.$refs.merchant_balance_view.chart);
          }
          if (this.urls.includes('/monitoring/channel/balance/')) {
            chartList.push(this.$refs.channel_balance_view.chart);
          }
          echarts.connect(chartList);
        }, 500)
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


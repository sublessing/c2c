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
        <!--1.充值订单总数量 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/pay/number/')">
            <pay-number ref="pay_number_view" @connectChart="connectChart"></pay-number>
        </el-col>

        <!--2.充值订单总金额 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/pay/money/')">
            <pay-money ref="pay_money_view" @connectChart="connectChart"></pay-money>
        </el-col>

        <!--3.充值成功率 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/pay/rate/')">
            <pay-rate ref="pay_rate_view" @connectChart="connectChart"></pay-rate>
        </el-col>

        <!--4.商户余额 -->
        <el-col :span="12" v-if="urls.includes('/monitoring/pay/balance/')">
            <pay-balance ref="pay_balance_view" @connectChart="connectChart"></pay-balance>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//  统计图标Card
import echarts from 'echarts'
  import { mapGetters } from 'vuex'  
  import payNumber from '../../monitoring/components/pay_number'
  import payMoney from '../../monitoring/components/pay_money'
  import payRate from '../../monitoring/components/pay_rate'
  import payBalance from '../../monitoring/components/pay_balance'

  export default {
    components: { payNumber, payMoney, payRate, payBalance },
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
        if (this.urls.includes('/monitoring/pay/number/')) {
          this.$refs.pay_number_view.fetchData();
        }
        if (this.urls.includes('/monitoring/pay/money/')) {
          this.$refs.pay_money_view.fetchData();
        }
        if (this.urls.includes('/monitoring/pay/rate/')) {
          this.$refs.pay_rate_view.fetchData();
        }
        if (this.urls.includes('/monitoring/pay/balance/')) {
          this.$refs.pay_balance_view.fetchData();
        }
      },
      connectChart () {
        setTimeout(() => {
          var chartList = [];
            if (this.urls.includes('/monitoring/pay/number/')) {
              chartList.push(this.$refs.pay_number_view.chart);
            }
            if (this.urls.includes('/monitoring/pay/money/')) {
              chartList.push(this.$refs.pay_money_view.chart);
            }
            if (this.urls.includes('/monitoring/pay/rate/')) {
              chartList.push(this.$refs.pay_rate_view.chart);
            }
            if (this.urls.includes('/monitoring/pay/balance/')) {
              chartList.push(this.$refs.pay_balance_view.chart);
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


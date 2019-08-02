<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" label-width="80px" size="mini">
      <el-form-item label="日期选择">
        <el-date-picker v-model="queryParams.day__gte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width: 130px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.day__lte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width: 130px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="代理" v-if="!roleIds.includes(3)">
        <el-select v-model="queryParams.agent_id" size="mini" clearable>
          <el-option v-for="(value, key) in agentMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleDownload" v-if="this.urls.includes('/statistics/agent_day/excel/')" :loading="downloadLoading">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small" @sort-change="handleSort">
      <el-table-column prop="day" label="统计日期" width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="代理名称" width="100" align="center">
        <template slot-scope="scope">{{ agentMap[''+scope.row.agent_id] }}</template>
      </el-table-column>
      <el-table-column prop="alipay_res" label="支付宝资源" align="center">
        <template slot-scope="scope">{{ scope.row.alipay_res }} | <span style="color: rgb(0, 204, 0);">{{scope.row.alipay_res_on}}</span></template>
      </el-table-column>
      <el-table-column prop="wx_res" label="微信资源" align="center">
        <template slot-scope="scope">{{ scope.row.wx_res }} | <span style="color: rgb(0, 204, 0);">{{scope.row.wx_res_on}}</span></template>
      </el-table-column>
      <el-table-column prop="union_res" label="云闪付资源" align="center">
        <template slot-scope="scope">{{ scope.row.union_res }} | <span style="color: rgb(0, 204, 0);">{{scope.row.union_res_on}}</span></template>
      </el-table-column>
      <el-table-column prop="balance" label="当日余额" align="center">
        <template slot-scope="scope">{{$priceFormat((scope.row.balance?scope.row.balance:0).toFixed(2))}}</template>
      </el-table-column>
      <el-table-column prop="order_money" label="今日收款" align="center">
        <template slot-scope="scope">{{ $priceFormat((scope.row.order_money?scope.row.order_money:0).toFixed(2)) }} | <span style="color: rgb(0, 204, 0);">{{$priceFormat((scope.row.order_succ_money?scope.row.order_succ_money:0).toFixed(2))}}</span></template>
      </el-table-column>
      <el-table-column prop="pay_fee" label="手续费" align="center">
        <template slot-scope="scope">{{$priceFormat((scope.row.pay_fee?scope.row.pay_fee:0).toFixed(2))}}</template>
      </el-table-column>
      <el-table-column prop="order_num" label="充值订单数" align="center">
        <template slot-scope="scope">{{ scope.row.order_num }} | <span style="color: rgb(0, 204, 0);">{{scope.row.order_succ_num}}</span></template>
      </el-table-column>
      <el-table-column prop="pay_rate" label="充值订单成功率" align="center">
        <template slot-scope="scope">{{ (scope.row.pay_rate*100).toFixed(2) }}%</template>
      </el-table-column>
      <el-table-column prop="alipay_order_money" label="支付宝订单额" align="center">
        <template slot-scope="scope">{{ $priceFormat((scope.row.alipay_order_money?scope.row.alipay_order_money:0).toFixed(2)) }} | <span style="color: rgb(0, 204, 0);">{{$priceFormat((scope.row.alipay_succ_money?scope.row.alipay_succ_money:0).toFixed(2))}}</span></template>
      </el-table-column>
      <el-table-column prop="rate_alipay" label="支付宝成功率" align="center">
        <template slot-scope="scope">{{ (scope.row.rate_alipay*100).toFixed(2) }}%</template>
      </el-table-column>
      <el-table-column prop="wx_order_money" label="微信订单额" align="center">
        <template slot-scope="scope">{{ $priceFormat((scope.row.wx_order_money?scope.row.wx_order_money:0).toFixed(2)) }} | <span style="color: rgb(0, 204, 0);">{{$priceFormat((scope.row.wx_succ_money?scope.row.wx_succ_money:0).toFixed(2))}}</span></template>
      </el-table-column>
      <el-table-column prop="rate_wx" label="微信成功率" align="center">
        <template slot-scope="scope">{{ (scope.row.rate_wx*100).toFixed(2) }}%</template>
      </el-table-column>
      <el-table-column prop="union_order_money" label="云闪付订单额" align="center">
        <template slot-scope="scope">{{ $priceFormat((scope.row.union_order_money?scope.row.union_order_money:0).toFixed(2)) }} | <span style="color: rgb(0, 204, 0);">{{$priceFormat((scope.row.union_succ_money?scope.row.union_succ_money:0).toFixed(2))}}</span></template>
      </el-table-column>
      <el-table-column prop="rate_union" label="云闪付成功率" align="center">
        <template slot-scope="scope">{{ (scope.row.rate_union*100).toFixed(2) }}%</template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listDayAgent, dayAgentExcel } from '@/api/stat'
import { parseTime } from '@/utils/index'
export default {
  computed: {
    ...mapGetters([
      'urls',
      'roleIds',
      'agentMap'
    ])
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      downloadLoading: false,
      queryParams: {
        page: 1,
        limit: 20,
        day__gte: parseTime(
          new Date().getTime()-1000*60*60*24,
          '{y}-{m}-{d}'
        ),
        day__lte: parseTime(
          new Date().getTime(),
          '{y}-{m}-{d}'
        )
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listDayAgent(this.queryParams).then(response => {
        this.list = response.data.items
        console.log(this.list)
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.queryParams.page = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.queryParams.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.fetchData()
    },
    handleSort({ column, prop, order }) {
      this.queryParams.sort_order = order
      this.queryParams.sort_name = prop
      this.fetchData()
    },
    handleDownload() {
      this.downloadLoading = true
      dayAgentExcel(this.queryParams).then(response => {
        this.downloadData = response.data.items
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '统计日期', '代理名称', '支付宝资源', '微信资源','云闪付资源',
            '当日余额', '今日收款', '手续费', '充值订单数','充值订单成功率',
            '支付宝订单额', '支付宝成功率', '微信订单额', '微信成功率','云闪付订单额','云闪付成功率'
          ]
          const filterVal = [
            'day', 'agent_id', 'alipay_res', 'wx_res', 'union_res',
            'balance', 'order_money', 'pay_fee', 'order_num', 'pay_rate',
            'alipay_order_money', 'rate_alipay', 'wx_order_money', 'rate_wx', 'union_order_money','rate_union'
          ]
          const data = this.formatJson(filterVal, this.downloadData)
          export_json_to_excel(tHeader, data, '代理日报')
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'agent_id') {
          return this.agentMap[''+v.agent_id]
        } else if (j === 'alipay_res') {
          return v.alipay_res + '|' + v.alipay_res_on
        } else if (j === 'wx_res') {
          return v.wx_res + '|' + v.wx_res_on
        } else if (j === 'union_res') {
          return v.union_res + '|' + v.union_res_on
        } else if (j === 'order_money') {
          return v.order_money + '|' + v.order_succ_money
        } else if (j === 'order_num') {
          return v.order_num + '|' + v.order_succ_num
        } else if (j === 'alipay_order_money') {
          return v.alipay_order_money + '|' + v.alipay_succ_money
        } else if (j === 'wx_order_money') {
          return v.wx_order_money + '|' + v.wx_succ_money
        } else if (j === 'union_order_money') {
          return v.union_order_money + '|' + v.union_succ_money
        }else if (j === 'pay_rate') {
          return (v.pay_rate*100).toFixed(2) + '%'
        }else if (j === 'rate_alipay') {
          return (v.rate_alipay*100).toFixed(2) + '%'
        }else if (j === 'rate_wx') {
          return (v.rate_wx*100).toFixed(2) + '%'
        }else if (j === 'rate_union') {
          return (v.rate_union*100).toFixed(2) + '%'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>


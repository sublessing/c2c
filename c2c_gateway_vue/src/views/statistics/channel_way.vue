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
      <el-form-item label="渠道名称">
        <el-select v-model="queryParams.channel_name" size="mini" clearable>
          <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道类型">
        <el-select v-model="queryParams.is_pay" size="mini" clearable>
          <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="queryParams.way_type" size="mini" clearable>
          <el-option v-for="(value, key) in payWayMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleDownload" v-if="this.urls.includes('/statistics/channel_way/excel/')" :loading="downloadLoading">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small" @sort-change="handleSort">
      <el-table-column prop="day" label="统计日期" width="140" align="center">
      </el-table-column>
      <el-table-column prop="channel_name" label="渠道名称" align="center">
      </el-table-column>
      <el-table-column prop="way_name" label="通道名称" align="center">
      </el-table-column>
      <el-table-column prop="type" label="通道类型" align="center">
        <template slot-scope="scope">
          {{ payMap[''+scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="way_type" label="支付方式" align="center">
        <template slot-scope="scope">{{ payWayMap[scope.row.way_type] }}</template>
      </el-table-column>
      <el-table-column prop="order_money" label="订单额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.order_money ? scope.row.order_money: 0).toFixed(2)) }}</template>
      </el-table-column>
      <el-table-column prop="order_succ_money" label="成功订单额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.order_succ_money ? scope.row.order_succ_money: 0).toFixed(2)) }}</template>
      </el-table-column>
      <el-table-column prop="order_num" label="订单数" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="order_succ_num" label="成功订单数" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="rate" label="成功率" align="center" sortable="custom">
        <template slot-scope="scope">{{ (scope.row.rate*100).toFixed(2) }}%</template>
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
import { listDayChannelWay, dayChannelWayExcel } from '@/api/stat'
import { listSelectChannel } from '@/api/service'
import { parseTime } from '@/utils/index'
export default {
  computed: {
    ...mapGetters([
      'urls'
    ])
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      downloadLoading: false,
      channelMap: {},
      payMap: {'1':'充值', '0': '提现'},
      payWayMap: {'1':'支付宝', '2': '微信', '3':'银行卡', '4': '云闪付'},
      queryParams: {
        page: 1,
        limit: 40,
        day__gte: parseTime(
          new Date().getTime(),
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
    this.getChannelMap()
    this.fetchData()
  },
  methods: {
    getChannelMap(){
      listSelectChannel().then(res => {
        res.data.items.map(e => {
          this.$set(this.channelMap, ''+e.channel_code, e.channel_name)
        })
      })
    },
    fetchData() {
      this.listLoading = true
      listDayChannelWay(this.queryParams).then(response => {
        this.list = response.data.items
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
      dayChannelWayExcel(this.queryParams).then(response => {
        this.downloadData = response.data.items
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '统计日期', '渠道名称', '通道名称', '通道类型', '支付方式',
            '订单额', '成功订单额', '订单数', '成功订单数', '成功率'
          ]
          const filterVal = [
            'day', 'channel_name', 'way_name', 'type', 'way_type',
            'order_money', 'order_succ_money', 'order_num', 'order_succ_num', 'rate'
          ]
          const data = this.formatJson(filterVal, this.downloadData)
          export_json_to_excel(tHeader, data, '支付通道日报')
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'type') {
          return this.payMap[v.type]
        } else if (j === 'way_type') {
          return this.payWayMap[v.way_type]
        } else if (j === 'rate') {
          return (v.rate*100).toFixed(2) + "%"
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>


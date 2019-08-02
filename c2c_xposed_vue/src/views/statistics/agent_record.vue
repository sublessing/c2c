<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" label-width="80px" size="mini">
      <el-form-item label="日期选择">
        <el-date-picker v-model="queryParams.create_time__gte" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="" style="width: 180px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.create_time__lte" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="" style="width: 180px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="代理" v-if="!roleIds.includes(3)">
        <el-select v-model="queryParams.agent_id" size="mini" clearable>
          <el-option v-for="(value, key) in agentMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号">
          <el-input v-model="queryParams.order_no__contains" size="mini" clearable placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleDownload" v-if="this.urls.includes('/statistics/agent_record/excel/')" :loading="downloadLoading">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small" @sort-change="handleSort">
      <el-table-column prop="create_time" label="交易完成时间" width="140" align="center">
        <template slot-scope="scope">{{ formatTime(scope.row.create_time) }}</template>
      </el-table-column>
      <el-table-column prop="agent_id" label="所属代理" align="center">
        <template slot-scope="scope">{{ agentMap[''+scope.row.agent_id] }}</template>
      </el-table-column>
      <el-table-column prop="balance" label="交易前余额" align="center" sortable="custom">
        <template slot-scope="scope">{{$priceFormat((scope.row.balance?scope.row.balance:0).toFixed(2))}}</template>
      </el-table-column>
      <el-table-column prop="money" label="交易金额" align="center" sortable="custom">
        <template slot-scope="scope">{{$priceFormat((scope.row.money?scope.row.money:0).toFixed(2))}}</template>
      </el-table-column>
      <el-table-column prop="after_price" label="交易后余额" align="center">
        <template slot-scope="scope">{{$priceFormat((scope.row.balance + scope.row.money).toFixed(2))}}</template>
      </el-table-column>
      <el-table-column prop="order_no" label="订单号" align="center">
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center">
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
import { listAgentRecord, agentRecordExcel } from '@/api/stat'
import { parseTime } from '@/utils/index'
export default {
  computed: {
    ...mapGetters([
      'urls',
      'merchantMap',
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
        create_time__gte: parseTime(
          new Date().getTime()-60*60*1000*24,
          '{y}-{m}-{d} {h}:{i}:{s}'
        ),
        create_time__lte: parseTime(
          new Date().getTime(),
          '{y}-{m}-{d} {h}:{i}:{s}'
        )
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    formatTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    fetchData() {
      this.listLoading = true
      listAgentRecord(this.queryParams).then(response => {
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
      if (prop && order) {
        this.queryParams.sort_order = order
        this.queryParams.sort_name = prop
      }
      this.fetchData()
    },
    handleDownload() {
      this.downloadLoading = true
      agentRecordExcel(this.queryParams).then(response => {
        this.downloadData = response.data.items
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '交易完成时间', '所属代理', '交易前余额', '交易金额', 
            '交易后余额', '订单号','备注'
          ]
          const filterVal = [
            'create_time', 'agent_id', 'balance', 'money',
            'after_balance', 'order_no', 'memo'
          ]
          const data = this.formatJson(filterVal, this.downloadData)
          export_json_to_excel(tHeader, data, '代理流水')
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'create_time') {
          return parseTime(v.create_time, '{y}-{m}-{d} {h}:{i}:{s}')
        } else if (j === 'agent_id') {
          return this.agentMap[''+v.agent_id]
        } else if (j === 'after_balance') {
          return (v.balance + v.money)
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>


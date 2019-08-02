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
      <el-form-item label="支付方式">
        <el-select v-model="queryParams.sub_type" size="mini" clearable>
          <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleDownload" v-if="this.urls.includes('/statistics/union_day/excel/')" :loading="downloadLoading">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small" @sort-change="handleSort">
      <el-table-column prop="day" label="统计日期" width="140" align="center">
      </el-table-column>
      <el-table-column prop="sub_type" label="支付方式" align="center" sortable="custom">
        <template slot-scope="scope">{{ payMap[''+scope.row.sub_type] }}</template>
      </el-table-column>
      <el-table-column prop="order_money" label="充值金额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.order_money?scope.row.order_money:0).toFixed(2)) }} | <span style="color: rgb(0, 204, 0);">{{$priceFormat((scope.row.order_succ_money?scope.row.order_succ_money:0).toFixed(2))}}</span></template>
      </el-table-column>
      <el-table-column prop="order_num" label="充值笔数" align="center" sortable="custom">
        <template slot-scope="scope">{{ scope.row.order_num }} | <span style="color: rgb(0, 204, 0);">{{scope.row.order_succ_num}}</span></template>
      </el-table-column>
      <el-table-column prop="pay_rate" label="充值成功率" align="center" sortable="custom">
        <template slot-scope="scope">{{ (scope.row.pay_rate*100).toFixed(2) }}%</template>
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
import { listDayUnion, dayUnionExcel } from '@/api/stat'
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
      payMap: {
        '401': '云闪付'
      },
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
        ),
        type: '4',
        sub_type: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listDayUnion(this.queryParams).then(response => {
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
      console.log(column, prop, order)
      this.queryParams.sort_order = order
      this.queryParams.sort_name = prop
      this.fetchData()
    },
    handleDownload() {
      this.downloadLoading = true
      dayUnionExcel(this.queryParams).then(response => {
        this.downloadData = response.data.items
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '统计日期', '支付方式', '充值金额', '充值笔数','充值成功率',
          ]
          const filterVal = [
            'day', 'sub_type', 'order_money', 'order_num', 'pay_rate'
          ]
          const data = this.formatJson(filterVal, this.downloadData)
          export_json_to_excel(tHeader, data, '云闪付日报')
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'pay_rate') {
          return (v.pay_rate*100).toFixed(2) + '%'
        } else if (j === 'sub_type') {
          return this.payMap[''+v.sub_type]
        } else if (j === 'order_money') {
          return v.order_money + '|' + v.order_succ_money
        } else if (j === 'order_num') {
          return v.order_num + '|' + v.order_succ_num
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>


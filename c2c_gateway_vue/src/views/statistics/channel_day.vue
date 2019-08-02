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
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleDownload" v-if="this.urls.includes('/statistics/channel_day/excel/')" :loading="downloadLoading">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small" @sort-change="handleSort">
      <el-table-column prop="day" label="统计日期" width="140" align="center">
      </el-table-column>
      <el-table-column prop="channel_name" label="渠道名称" align="center">
      </el-table-column>
      <el-table-column prop="balance" label="当日余额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.balance ? scope.row.balance: 0).toFixed(2)) }}</template>
      </el-table-column>
      <el-table-column prop="fee" label="收取手续费" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.fee ? scope.row.fee: 0).toFixed(2)) }}</template>
      </el-table-column>
      <el-table-column prop="order_pay_money" label="充值金额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.order_pay_money ? scope.row.order_pay_money: 0).toFixed(2)) }} | <span style="color: rgb(0, 204, 0);">{{ $priceFormat((scope.row.order_pay_succ_money ? scope.row.order_pay_succ_money: 0).toFixed(2)) }}</span></template>
      </el-table-column>
      <el-table-column prop="order_pay_num" label="充值笔数" align="center" sortable="custom">
        <template slot-scope="scope">{{ scope.row.order_pay_num }} | <span style="color: rgb(0, 204, 0);">{{scope.row.order_pay_succ_num}}</span></template>
      </el-table-column>
      <el-table-column prop="pay_rate" label="充值成功率" align="center" sortable="custom">
        <template slot-scope="scope">{{ (scope.row.pay_rate*100).toFixed(2) }}%</template>
      </el-table-column>
      <el-table-column prop="order_draw_money" label="转账金额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.order_draw_money ? scope.row.order_draw_money: 0).toFixed(2)) }} | <span style="color: rgb(0, 204, 0);">{{ $priceFormat((scope.row.order_draw_succ_money ? scope.row.order_draw_succ_money: 0).toFixed(2)) }}</span></template>
      </el-table-column>
      <el-table-column prop="order_draw_num" label="转账笔数" align="center" sortable="custom">
        <template slot-scope="scope">{{ scope.row.order_draw_num }} | <span style="color: rgb(0, 204, 0);">{{scope.row.order_draw_succ_num}}</span></template>
      </el-table-column>
      <el-table-column prop="draw_rate" label="转账成功率" align="center" sortable="custom">
        <template slot-scope="scope">{{ (scope.row.draw_rate*100).toFixed(2) }}%</template>
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
import { listDayChannel, dayChannelExcel } from '@/api/stat'
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
          this.$set(this.channelMap, ''+e.id, e.channel_name)
        })
      })
    },
    fetchData() {
      this.listLoading = true
      listDayChannel(this.queryParams).then(response => {
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
      dayChannelExcel(this.queryParams).then(response => {
        this.downloadData = response.data.items
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '统计日期', '渠道名称', '当日余额', '收取手续费',
            '充值金额', '充值笔数','充值成功率',
            '转账金额', '转账笔数','转账成功率'
          ]
          const filterVal = [
            'day', 'channel_name', 'balance', 'fee',
            'order_pay_money', 'order_pay_num', 'pay_rate',
            'order_draw_money', 'order_draw_num', 'draw_rate'
          ]
          const data = this.formatJson(filterVal, this.downloadData)
          export_json_to_excel(tHeader, data, '支付渠道日报')
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'pay_rate') {
          return (v.pay_rate*100).toFixed(2) + '%'
        } else if (j === 'draw_rate') {
          return (v.draw_rate*100).toFixed(2) + '%'
        } else if (j === 'order_pay_money') {
          return v.order_pay_money + '|' + v.order_pay_succ_money
        } else if (j === 'order_pay_num') {
          return v.order_pay_num + '|' + v.order_pay_succ_num
        } else if (j === 'order_draw_money') {
          return v.order_draw_money + '|' + v.order_draw_succ_money
        } else if (j === 'order_draw_num') {
          return v.order_draw_num + '|' + v.order_draw_succ_num
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>


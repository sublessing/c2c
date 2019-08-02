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
      <el-form-item label="业务类型">
        <el-select v-model="queryParams.type" size="mini" clearable>
          <el-option v-for="(value, key) in typeList" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属商户">
        <el-select v-model="queryParams.merchant_name" size="mini" clearable>
          <el-option v-for="(value, key) in merchantMap" :key="key" :label="value" :value="value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号">
          <el-input v-model="queryParams.order_no__contains" size="mini" clearable placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="操作人">
          <el-input v-model="queryParams.memo__contains" size="mini" clearable placeholder="操作人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleDownload" v-if="this.urls.includes('/statistics/merchant_record/excel/')" :loading="downloadLoading">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small" @sort-change="handleSort">
      <el-table-column prop="create_time" label="交易时间" width="140" align="center">
      </el-table-column>
      <el-table-column prop="type" label="业务类型" align="center">
        <template slot-scope="scope">{{ typeList[''+scope.row.type] }}</template>
      </el-table-column>
      <el-table-column prop="merchant_name" label="所属商户" align="center">
      </el-table-column>
      <el-table-column prop="merchant_user_id" label="商户用户ID" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.merchant_user_id === null">-</span>
          <span v-else>{{ scope.row.merchant_user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="way_type" label="支付方式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.way_type === null">-</span>
          <span v-else>{{ payWayMap[''+scope.row.way_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="交易金额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.price ? scope.row.price: 0).toFixed(2)) }}</template>
      </el-table-column>
      <el-table-column prop="before_price" label="交易前余额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.before_price ? scope.row.before_price: 0).toFixed(2)) }}</template>
      </el-table-column>
      <el-table-column prop="after_price" label="交易后余额" align="center" sortable="custom">
        <template slot-scope="scope">{{ $priceFormat((scope.row.after_price ? scope.row.after_price: 0).toFixed(2)) }}</template>
      </el-table-column>
      <el-table-column prop="order_no" label="平台订单号" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.order_no === null">-</span>
          <span v-else>{{ scope.row.order_no }}</span>
        </template>
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
import { listMerchantRecord, merchantRecordExcel } from '@/api/stat'
import { listSelectChannel } from '@/api/service'
import { parseTime } from '@/utils/index'
export default {
  computed: {
    ...mapGetters([
      'urls',
      'merchantMap'
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
      typeList: {'0':'商户充值', '1': '商户转账', '2':'系统加款', '3': '系统扣款', '4': '手续费'},
      channelMap: {},
      payWayMap: {'1':'支付宝', '2': '微信', '3':'银行卡', '4': '云闪付'},
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
      listMerchantRecord(this.queryParams).then(response => {
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
      merchantRecordExcel(this.queryParams).then(response => {
        this.downloadData = response.data.items
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '交易时间', '业务类型', '所属商户', '商户用户ID', 
            '支付方式', '交易金额','交易前金额',
            '交易后金额', '平台订单号','备注'
          ]
          const filterVal = [
            'create_time', 'type', 'merchant_name', 'merchant_user_id',
            'way_type', 'price', 'before_price',
            'after_price', 'order_no', 'memo'
          ]
          const data = this.formatJson(filterVal, this.downloadData)
          export_json_to_excel(tHeader, data, '商户流水')
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'type') {
          return this.typeList[''+v.type]
        } else if (j === 'merchant_name') {
          return v.merchant_name ? v.merchant_name : '-'
        } else if (j === 'merchant_user_id') {
          return v.merchant_user_id ? v.merchant_user_id : '-'
        } else if (j === 'order_no') {
          return v.order_no ? v.order_no : '-'
        } else if (j === 'way_type') {
          return v.way_type ? this.payWayMap[''+v.way_type] : '-'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>


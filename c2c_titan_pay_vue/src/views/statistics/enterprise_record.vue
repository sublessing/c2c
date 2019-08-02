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
      <!-- <el-form-item label="账号ID">
          <el-input v-model="queryParams.res_out_id" size="mini" clearable placeholder="账号ID"></el-input>
      </el-form-item> -->
      <el-form-item label="账号名称">
          <el-input v-model="queryParams.res_name__contains" size="mini" clearable placeholder="账号名称"></el-input>
      </el-form-item>
      <el-form-item label="订单号">
          <el-input v-model="queryParams.order_no__contains" size="mini" clearable placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleDownload" v-if="this.urls.includes('/statistics/enterprise_record/excel/')" :loading="downloadLoading">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small" @sort-change="handleSort">
      <el-table-column prop="create_time" label="交易时间" width="140" align="center">
      </el-table-column>
      <el-table-column prop="type" label="业务类型" align="center">
        <template slot-scope="scope">{{ typeList[''+scope.row.type] }}</template>
      </el-table-column>
      <!-- <el-table-column prop="res_out_id" label="账号ID" align="center">
      </el-table-column> -->
      <el-table-column prop="res_name" label="账号名称" align="center">
      </el-table-column>
      <el-table-column prop="merchant_name" label="交易商户" align="center">
      </el-table-column>
      <el-table-column prop="merchant_user_id" label="交易目标ID" align="center">
      </el-table-column>
      <el-table-column prop="order_no" label="订单号" align="center">
      </el-table-column>
      <el-table-column prop="price" label="交易金额" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.price !== null">{{$priceFormat((scope.row.price?scope.row.price:0).toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="before_price" label="交易前余额" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.before_price !== null">{{$priceFormat((scope.row.before_price?scope.row.before_price:0).toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="after_price" label="交易后余额" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.after_price !== null">{{$priceFormat((scope.row.after_price?scope.row.after_price:0).toFixed(2))}}</span>
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
import { listEnterpriseRecord, enterpriseRecordExcel } from '@/api/stat'
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
        limit: 40,
        create_time__gte: parseTime(
          new Date().getTime()-60*60*1000*24,
          '{y}-{m}-{d} {h}:{i}:{s}'
        ),
        create_time__lte: parseTime(
          new Date().getTime(),
          '{y}-{m}-{d} {h}:{i}:{s}'
        )
      },
      typeList: {'0':'商户充值', '1': '商户转账', '2':'系统加款', '3': '系统扣款'},
      payWayMap: {'0':'支付宝', '1': '微信', '2':'银行卡', '3': '云闪付'},
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listEnterpriseRecord(this.queryParams).then(response => {
        this.list = response.data.items.map(v => {
          this.$set(v, 'balance', v.balance / 100)
          this.$set(v, 'recharge', v.recharge / 100)
          this.$set(v, 'draw', v.draw / 100)
          this.$set(v, 'sxf', v.sxf / 100)
          return v
        })
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
      console.log(prop, order)
      this.queryParams.sort_order = order
      this.queryParams.sort_name = prop
      this.fetchData()
    },
    handleDownload() {
      this.downloadLoading = true
      enterpriseRecordExcel(this.queryParams).then(response => {
        this.downloadData = response.data.items
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '交易时间', '业务类型', '账号名称', 
            '交易商户', '交易目标ID','订单号',
            '交易金额', '交易前金额','交易后金额','备注'
          ]
          const filterVal = [
            'create_time', 'type', 'res_name',
            'merchant_name', 'merchant_user_id', 'order_no',
            'price', 'before_price', 'after_price', 'memo'
          ]
          const data = this.formatJson(filterVal, this.downloadData)
          export_json_to_excel(tHeader, data, '企业账号流水')
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'type') {
          return this.typeList[''+v.type]
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>


<template>
  <div class="app-container">
    <!-- <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="支付宝账号">
        <el-input v-model="queryParams.ali_account" placeholder="支付宝账号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
      </el-form-item>
    </el-form> -->
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small">
      <el-table-column prop="create_time" label="创建时间" align="center">
      </el-table-column>
      <el-table-column prop="notify_url" label="回调地址" align="center">
      </el-table-column>
      <el-table-column  prop="memo" label="备注" align="center">
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { listGatewayAp } from '@/api/service'

export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      createVisible: false,
      queryParams: {
        page: 1,
        limit: 40
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listGatewayAp(this.queryParams).then(response => {
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
    }
  }
}
</script>

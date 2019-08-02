<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" label-width="80px" size="mini">
      <el-form-item label="创建时间">
        <el-date-picker v-model="queryParams.create_time__gte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:140px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.create_time__lte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:140px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.state" size="mini" clearable>
          <el-option v-for="(value, key) in stateMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作码">
        <el-input v-model="queryParams.op_code"></el-input>
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="queryParams.operator"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small">
      <!-- <el-table-column prop="id" label="ID" width="80">
      </el-table-column> -->
      <el-table-column prop="create_time" label="创建时间" width="140">
      </el-table-column>
      <el-table-column prop="state" label="状态" width="70">
        <template slot-scope="scope">
          {{stateMap[scope.row.state]}}
        </template>
      </el-table-column>
      <el-table-column prop="op_code" label="操作码" width="70">
      </el-table-column>
      <el-table-column prop="request_url" label="请求URL">
      </el-table-column>
      <el-table-column prop="return_msg" label="返回结果" width="300" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" width="80">
      </el-table-column>
      <el-table-column prop="object_id" label="操作对象id" width="120">
      </el-table-column>
      <el-table-column prop="log_memo" label="说明" width="280">
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px; display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { listRequestLog } from '@/api/service'

export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      queryParams: {
        page: 1,
        limit: 20,
        create_time__gte: '',
        create_time__lte: '',
        state: '',
        operator: ''
      },
      stateMap: { '-1': '失败', '0': '成功' }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listRequestLog(this.queryParams).then(response => {
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


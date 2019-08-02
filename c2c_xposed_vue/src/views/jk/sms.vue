<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="代理id">
        <el-input v-model="queryParams.agent_id" placeholder="代理id"></el-input>
      </el-form-item>
      <el-form-item label="代理账号">
        <el-input v-model="queryParams.agent_account" placeholder="代理账号"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryParams.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="queryParams.type" size="mini" clearable style="width:110px">
          <el-option v-for="(value, key) in typeMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="queryParams.create_time__gte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:140px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.create_time__lte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:140px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small">
      <!-- <el-table-column prop="id" label="ID" width="80">
      </el-table-column> -->
      <el-table-column prop="create_time" label="创建时间" width="140" align="center">
      </el-table-column>
      <el-table-column prop="sms_id" label="短信id" width="80" align="center">
      </el-table-column>
      <el-table-column prop="agent_id" label="代理id" align="center">
      </el-table-column>
      <el-table-column prop="agent_account" label="代理账号" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="手机" align="center">
      </el-table-column>
      <el-table-column prop="sms_code" label="短信验证码" align="center">
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center" width="120">
        <template slot-scope="scope">
          {{typeMap[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column prop="alive_flag" label="是否有效" align="center" width="70">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.alive_flag | statusFilter"> {{aliveMap[scope.row.alive_flag]}}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { listSms } from '@/api/jk'

export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      queryParams: {
        page: 1,
        limit: 40,
        create_time__gte: '',
        create_time__lte: ''
      },
      typeMap: { 0: '注册', 1: '修改密码' },
      aliveMap: { 0: '有效', 1: '无效' }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listSms(this.queryParams).then(response => {
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

<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="机器人id">
        <el-input v-model="queryParams.device_id" placeholder="机器人id"></el-input>
      </el-form-item>
      <el-form-item label="代理id">
        <el-input v-model="queryParams.agent__agent_id" placeholder="代理id"></el-input>
      </el-form-item>
      <el-form-item label="代理账号">
        <el-input v-model="queryParams.agent__login_name" placeholder="代理账号"></el-input>
      </el-form-item>
      <el-form-item label="错误码">
        <el-input v-model="queryParams.err_code" placeholder="错误码"></el-input>
      </el-form-item>
      <el-form-item label="日期选择">
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
      <el-table-column prop="device_id" label="机器人id" width="200" align="center">
      </el-table-column>
      <el-table-column prop="agent.agent_id" label="代理id" align="center">
      </el-table-column>
      <el-table-column prop="agent.login_name" label="代理账号" align="center">
      </el-table-column>
      <el-table-column prop="err_code" label="错误码" align="center">
      </el-table-column>
      <el-table-column prop="err_msg" label="错误信息" align="center">
      </el-table-column>
      <el-table-column  label="请求URL" width="400">
        <template slot-scope="scope">
          <a :href="scope.row.picture_path" target='_blank'>
            <el-button type="primary" size="small">点击查看图片</el-button>
          </a>
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
import { listErrorpic } from '@/api/jk'

export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      queryParams: {
        agent: null,
        page: 1,
        limit: 40,
        create_time__gte: '',
        create_time__lte: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listErrorpic(this.queryParams).then(response => {
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

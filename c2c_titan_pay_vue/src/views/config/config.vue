<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-button type="warning" size="small" @click="reload"  v-if="this.urls.includes('/service/config/reload/')"  :loading="reseting">全部重载</el-button>
      </el-form-item>
    </el-form>
    <el-table :cell-style="cellStyle" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中"  border stripe fit highlight-current-row size="small">
      <el-table-column prop="id" label="ID" align="center" width="60" >
      </el-table-column>
      <el-table-column  label="字段名" align="center" width="250" >
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.config_name"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.config_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值" align="center" width="400">
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.config_value"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.config_value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="400">
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.memo"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" align="center">
      </el-table-column>
      <el-table-column prop="reload_time" label="重载时间" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-show="scope.row.edit" type="danger" size="small" @click="doSubmit(scope.row)">保存</el-button>
          <el-button v-show="scope.row.edit" type="" size="small" @click="doCancel(scope.row)">取消</el-button>
          <el-button v-show="!scope.row.edit" type="primary" size="small" @click="doEdit(scope.row)">编辑</el-button>
        </template>
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
import { updateConfig, listConfig, resetConfig } from '@/api/service'


export default {
  computed: {
    ...mapGetters([
      'urls'
    ])
  },
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 20
      },
      reseting: false,
      list: null,
      total: 0,
      listLoading: true,
      form: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    cellStyle (data) {
      if (new Date(data.row.reload_time).getTime() < new Date(data.row.update_time).getTime()) {
        return {
          "background-color": "rgba(255, 0, 0, 0.1)"
        }
      }
    },
    handleSizeChange(val) {
      this.queryParams.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      listConfig(this.queryParams).then(response => {
        this.list = response.data.items.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.total = response.data.total
        this.listLoading = false
      })
    },
    doSubmit(row) {
      delete row.edit
      updateConfig(row).then(response => {
        this.$notify({
          title: '提交',
          message: `${row.id}，${response.msg}`,
          type: response.code === 0 ? 'success' : 'error',
          duration: response.code === 0 ? 2000 : 0
        })
        this.fetchData()
      })
    },
    doEdit(row) {
      this.rawRow = Object.assign({}, row)
      row.edit = true
    },
    doCancel(row) {
      Object.assign(row, this.rawRow)
      row.edit = false
    },
    reload() {
      this.$confirm('您确定重载配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reseting = true
        resetConfig().then(response => {
          this.$notify({
            title: response.code === 0 ? '重载成功' : '重载失败',
            message: response.msg,
            type: response.code === 0 ? 'success' : 'error',
            duration: response.code === 0 ? '1000' : 0
          })
          this.reseting = false
          this.fetchData()
        })
      })
    }
  }
}
</script>


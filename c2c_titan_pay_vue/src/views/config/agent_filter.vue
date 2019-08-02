<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="日期选择">
        <el-date-picker v-model="queryParams.sdate__gte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:120px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.sdate__lte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:120px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="代理账号">
        <el-input v-model="queryParams.agent__login_name" placeholder="代理账号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
      </el-form-item>
      <el-row style="margin-bottom: 10px;">
        <el-button type="primary" size="small"  @click="handleDel">批量删除</el-button>
        <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
      </el-row>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column label="代理ID" align="center" width="120" >
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.agent.agent_id"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.agent.agent_id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agent.login_name" label="代理账号" align="center">
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center">
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-show="scope.row.edit" type="danger" size="small" @click="doSubmit(scope.row)">保存</el-button>
          <el-button v-show="scope.row.edit" type="" size="small" @click="doCancel(scope.row)">取消</el-button>
          <el-button v-show="!scope.row.edit" type="primary" size="small" @click="doEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="新增" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="代理id" prop='agent_id'>
          <el-input v-model="form.agent_id"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="doCreate" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listAgentFilter, updateAgentFilter, addAgentFilter, deleteAgentFilter } from '@/api/stat'

export default {
  computed: {
    ...mapGetters([
      'urls'
    ])
  },
  data() {
    const isInteger = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!/^[1-9]+[0-9]*$/.test(value)) {
          callback(new Error('请填写正整数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      createVisible: false,
      submitting: false,
      total: 0,
      list: null,
      listLoading: true,
      form: {},
      queryParams: {
        agent: null,
        page: 1,
        limit: 40,
        create_time__gte: '',
        create_time__lte: ''
      },
      rules: {
        agent_id: [
          { required: true, message: '请填写代理id' },
          { validator: isInteger }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
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
    fetchData() {
      this.listLoading = true
      listAgentFilter(this.queryParams).then(response => {
        this.list = response.data.items.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.total = response.data.total
        this.listLoading = false
      })
    },
    doSubmit(row) {
      updateAgentFilter(row).then(response => {
        this.$notify({
          title: '提交',
          message: response.msg,
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
    handleCreate() {
      this.form = {}
      this.dialogStatus = 'create'
      this.createVisible = true
    },
    doCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          addAgentFilter(this.form).then(response => {
            this.createVisible = false
            this.$notify({
              title: response.code === 0 ? '成功' : '操作失败',
              message: response.msg,
              type: response.code === 0 ? 'success' : 'error',
              duration: response.code === 0 ? 2000 : 0
            })
            this.submitting = false
            this.handleFilter()
          })
        }
      })
    },
    handleDel() {
      if (this.multipleSelection === undefined || this.multipleSelection.length === 0) return
      const cmsg = '您确认删除这些数据吗, 请确认！'
      this.$confirm(cmsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.doDel({ filter_id: this.multipleSelection[i].filter_id })
        }
        this.handleFilter()
      })
    },
    doDel(data) {
      deleteAgentFilter(data).then(response => {
        this.$notify({
          title: response.code === 0 ? '成功' : '操作失败',
          message: response.msg,
          type: response.code === 0 ? 'success' : 'error',
          duration: response.code === 0 ? 2000 : 0
        })
        this.handleFilter()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectItem(row, column, cell, event) {
      console.log(column)
      if (column.type === 'selection' || column.property === 'merchant_id') {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
    }
  }
}
</script>


<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="支付宝账号">
        <el-input v-model="queryParams.ali_account" placeholder="支付宝账号"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="queryParams.ali_real_name" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="账号校验状态">
        <el-select v-model="queryParams.ali_account_flag" size="mini" clearable style="width:120px;">
          <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="真实姓名校验状态">
        <el-select v-model="queryParams.real_name_flag" size="mini" clearable style="width:120px;" >
          <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
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
      <el-row style="margin-bottom: 10px;">
        <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
        <el-button type="danger" size="small"  @click="handleDel">批量删除</el-button>
      </el-row>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
     <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="140" align="center">
      </el-table-column>
      <el-table-column prop="ali_account" label="支付宝账号" width="200" align="center">
      </el-table-column>
      <el-table-column prop="ali_real_name" label="真实姓名" align="center">
      </el-table-column>
      <el-table-column label="支付宝账号校验结果" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.ali_account_flag | statusFilter">{{statusOptions[scope.row.ali_account_flag]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名校验结果" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.real_name_flag | statusFilter">{{statusOptions[scope.row.real_name_flag]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  prop="remark" label="备注" width="300">
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="25%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="right" label-width="120px">
        <el-form-item label="支付宝账号" prop='ali_account'>
          <el-input v-model="form.ali_account" placeholder="支付宝账号"></el-input>
        </el-form-item>

        <el-form-item label="真实姓名" prop='ali_real_name'>
          <el-input v-model="form.ali_real_name" placeholder="支付宝真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="账号校验状态" prop='ali_account_flag'>
          <el-select v-model="form.ali_account_flag" size="small">
            <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名校验状态" prop='real_name_flag'>
          <el-select v-model="form.real_name_flag" size="small">
            <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="支付宝姓名"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="doCreate" :loading="submitting">确 定</el-button>
        <el-button v-else type="primary" @click="doUpdate" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAliAccount, addAliAccount, updateAliAccount, deleteAliAccount } from '@/api/stat'

export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      createVisible: false,
      submitting: false,
      form: {},
      dialogStatus: '',
      queryParams: {
        agent: null,
        page: 1,
        limit: 40,
        create_time__gte: '',
        create_time__lte: ''
      },
      statusOptions: { '-1': '正在验证', '0': '已通过', '1': '未通过' },
      titleMap: { update: '编辑', create: '新增' },
      rules: {
        ali_account: [
          { required: true, message: '请填写支付账号' },
          { max: 30, message: '最长30位' },
          { min: 2, message: '最短2位' }
        ],
        ali_real_name: [
          { required: true, message: '请填写真实姓名' },
          { max: 30, message: '最长30位' },
          { min: 2, message: '最短2位' }
        ],
        ali_account_flag: [
          { required: true, message: '请选择' }
        ],
        real_name_flag: [
          { required: true, message: '请选择' }
        ],
        remark: [
          { max: 30, message: '最长30位' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listAliAccount(this.queryParams).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.queryParams.page = 1
      this.fetchData()
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
          addAliAccount(this.form).then(response => {
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
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.form.ali_account_flag = '' + this.form.ali_account_flag
      this.form.real_name_flag = '' + this.form.real_name_flag
      this.dialogStatus = 'update'
      this.createVisible = true
    },
    doUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          updateAliAccount(this.form).then(response => {
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
          this.doDel({ ali_id: this.multipleSelection[i].ali_id })
        }
        this.handleFilter()
      })
    },
    doDel(data) {
      deleteAliAccount(data).then(response => {
        this.$notify({
          title: response.code === 0 ? '删除成功' : '操作失败',
          message: response.msg,
          type: response.code === 0 ? 'success' : 'error',
          duration: response.code === 0 ? 2000 : 0
        })
        this.handleFilter()
      })
    },
    handleSizeChange(val) {
      this.queryParams.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectItem(row, column, cell, event) {
      console.log(column)
      if (column.type === 'selection' || column.property === 'ali_id') {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
    }
  }
}
</script>

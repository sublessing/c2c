<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="ID">
        <el-input v-model="queryParams.id" placeholder="ID"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px;">
      <!-- <el-button type="primary" size="small" @click="handleBan(0)">批量操作按钮0</el-button>
      <el-button type="primary" size="small"  @click="handleBan(1)">批量操作按钮1</el-button> -->
    </el-row>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
      <!-- <el-table-column type="selection" width="50" align="center">
      </el-table-column> -->
      <el-table-column prop="id" label="ID" width="80"  align="center">
      </el-table-column>
      <el-table-column prop="token" label="token"  align="center">
      </el-table-column>
      <el-table-column label="是否登录" align="center" width="70">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.is_login == 0 ? 'danger' : 'success'"> {{ scope.row.is_login == 0 ? '未登录' : '已登陆' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注"  align="center">
      </el-table-column>
      <el-table-column prop="login_time" label="登录时间" width="150" align="center">
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="150" align="center">
      </el-table-column>
      <el-table-column prop="ping_time" label="心跳时间" width="150" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="360px" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" initial="off" label-position="left" label-width="120px">
        <el-form-item label="token" prop="token" size="small">
          <el-input v-model="form.token" placeholder="请输入token"></el-input>
        </el-form-item>
        <el-form-item label="备注" size="small">
          <el-input v-model="form.memo" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false" size="small">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" size="small" type="primary" @click="doCreate" :loading="submitting">确 定</el-button>
        <el-button v-else type="primary" size="small" @click="doUpdate" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRebotPhone, addRebotPhone, editRebotPhone } from '@/api/service'

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (this.form.phone !== undefined && this.form.phone !== '' && !/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.form.phone)) {
        callback(new Error('手机号码输入有误!'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      total: null,
      listLoading: true,
      queryParams: {
        page: 1,
        limit: 40,
        status: ''
      },
      form: {},
      dialogStatus: 'create',
      createVisible: false,
      submitting: false,
      rules: {
        login_password: [
          { max: 20, message: '最长20位' },
          { min: 6, message: '最短20位' }
        ],
        phone: [
          { validator: validatePhone }
        ],
        status: [
          { required: true, message: '请选择账号状态' }
        ],
        alipay_account: [
          { required: true, message: '请填写支付宝账号' }
        ],
        realname: [
          { required: true, message: '支付宝姓名' }
        ]

      },
      dialogStatus: '',
      statusMap: { 0: '正常', 1: '禁用' },
      loginMap: { 0: '已登录', 1: '未登录' },
      typeMap: { 0: '内部代理', 1: '外部代理', 2: '虚拟用户' },
      flagMap: { 0: '可以付款', 1: '不能付款' },
      titleMap: { update: '编辑', create: '新增' }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleCreate() {
      this.form = {}
      this.dialogStatus = 'create'
      this.createVisible = true
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.createVisible = true
    },
    doCreate () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          addRebotPhone(this.form).then(response => {
            this.submitting = false
            this.$notify({
              title: response.code === 0 ? '成功' : '操作失败',
              message: response.msg,
              type: response.code === 0 ? 'success' : 'error',
              duration: response.code === 0 ? 2000 : 0
            })
            if (response.code === 0) {
              this.createVisible = false
              this.handleFilter()
            }
          })
        }
      })
    },
    doUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          editRebotPhone(this.form).then(response => {
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
    generateKey() {
      const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      var str = ''
      var weishu = 6 + Math.random() * 14
      for (let i = 0; i < weishu; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      this.$set(this.form, 'login_password', str)
    },
    fetchData() {
      this.listLoading = true
      listRebotPhone(this.queryParams).then(response => {
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
    handleBan(st) { // st = 0 表示要xxx
      if (st !== 0 && st !== 1) return
      if (this.multipleSelection === undefined || this.multipleSelection.length === 0) return
      const cmsg = st === 0 ? '批量xxx，请确认！' : '批量xxx，请确认！'
      this.$confirm(cmsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          // 处理
        }
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


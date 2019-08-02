<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" size="mini" clearable style="width:160px">
          <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联对象类型">
        <el-select v-model="queryParams.agent__type" size="mini" clearable style="width:160px">
          <el-option v-for="(value, key) in typeMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联对象ID">
        <el-input v-model="queryParams.agent__agent_id"></el-input>
      </el-form-item>
      <el-form-item label="关联支付宝">
        <el-input v-model="queryParams.ali_account"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" size="small" @click="handleBan(0)">批量操作按钮0</el-button>
      <el-button type="primary" size="small"  @click="handleBan(1)">批量操作按钮1</el-button>
    </el-row>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column prop="computer_id" label="ID" width="80"  align="center">
      </el-table-column>
      <el-table-column label="状态" align="center" width="70">
        <template slot-scope="scope">
          {{statusMap[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column prop="device_id" label="电脑编号ID"  align="center">
      </el-table-column>
      <el-table-column prop="ip_address" label=" IP地址"  align="center">
      </el-table-column>
      <el-table-column label="关联对象类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.agent">
            {{typeMap[scope.row.agent.type]}}
          </span>
          <span v-else>
            -
          </span>
        </template>
      </el-table-column>
      <el-table-column label="关联对象ID"  align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.agent">
            {{scope.row.agent.agent_id}}
          </span>
          <span v-else>
            -
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="ali_account" label="关联支付宝账号" align="center">
      </el-table-column>
      <el-table-column prop="update_time" label="最近一次操作时间" width="150" align="center">
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { listRebotComputer } from '@/api/service'

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
        ali_account: [
          { required: true, message: '请填写支付宝账号' }
        ],
        realname: [
          { required: true, message: '支付宝姓名' }
        ]

      },
      dialogStatus: '',
      statusMap: { 0: '已登录', 1: '未登录', 2: '等待登录', 3: '登录中' },
      typeMap: { 0: '内部代理', 1: '外部代理', 2: '虚拟用户' },
      flagMap: { 0: '正常', 1: '关闭' },
      titleMap: { update: '编辑', create: '新增' }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
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
      listRebotComputer(this.queryParams).then(response => {
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


<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="设备ID">
        <el-input v-model="queryParams.robot_no"></el-input>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="queryParams.way_type" size="mini" clearable style="width:160px">
          <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.is_online" size="mini" clearable style="width:160px">
          <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
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
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="80"  align="center">
      </el-table-column>
      <el-table-column label="状态" align="center" width="70">
        <template slot-scope="scope">
          {{statusMap[scope.row.is_online]}}
        </template>
      </el-table-column>
      <el-table-column prop="robot_no" label="设备ID"  align="center">
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          {{ payMap[''+scope.row.way_type] }}
        </template>
      </el-table-column> 
      <el-table-column label="代理服务器ID" align="center" prop="proxy_id">
      </el-table-column> 
      <el-table-column label="备注" align="center" prop="memo">
      </el-table-column> 
      <el-table-column prop="ping_time" label="心跳时间" width="150" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button> -->
          <el-button type="danger" @click.native="deleteMerchantChannelBan(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="360px" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" initial="off" label-position="left" label-width="120px">
        <el-form-item label="设备ID" prop="robot_no" size="small">
          <el-input v-if="dialogStatus=='create'" v-model="form.robot_no" placeholder="请输入设备ID"></el-input>
          <el-input v-else v-model="form.robot_no" placeholder="请输入设备ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="way_type">
          <el-select v-model="form.way_type" size="small" clearable>
            <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理服务器ID" prop="proxy_id">
          <el-select v-model="form.proxy_id" size="small" clearable>
            <el-option v-for="(value, key) in proxyMap" :key="key" :label="label_label(key, value)" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="is_online">
          <el-select v-model="form.is_online" size="small" clearable>
            <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
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
import { listRebotComputer, addRebotComputer, delRebotComputer, listSelectRebotPhone } from '@/api/service'

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
        robot_no: [
          { required: true, message: '请输入设备ID' }
        ],
        way_type: [
          { required: true, message: '请选择支付方式' }
        ],
        proxy_id: [
          { required: true, message: '请选择代理服务器ID' }
        ],
        is_online: [
          { required: true, message: '请选择在线状态' }
        ]
      },
      dialogStatus: '',
      statusMap: { 0: '离线', 1: '在线' },
      payMap: { 1: '支付宝', 2: '微信', 3: '银行卡', 4: '云闪付' },
      typeMap: { 0: '内部代理', 1: '外部代理', 2: '虚拟用户' },
      flagMap: { 0: '正常', 1: '关闭' },
      titleMap: { update: '编辑', create: '新增' },
      proxyMap: {}
    }
  },
  created() {
    this.getProxyList()
    this.fetchData()
  },
  methods: {
    label_label(key, value) {
      return key+'('+(value==0?"未登录":"已登录")+')'
    },
    getProxyList(){
      listSelectRebotPhone().then(res => {
        res.data.items.map(e => {
          this.$set(this.proxyMap, ''+e.id, e.is_login)
        })
      })
    },
    handleCreate() {
      this.form = {}
      this.dialogStatus = 'create'
      this.createVisible = true
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.form.way_type = '' + this.form.way_type
      this.form.proxy_id = '' + this.form.proxy_id
      this.form.is_online = '' + this.form.is_online
      this.dialogStatus = 'update'
      this.createVisible = true
    },
    doCreate () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          addRebotComputer(this.form).then(response => {
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
          // this.submitting = true
          // updateFictitious(this.form).then(response => {
          //   this.createVisible = false
          //   this.$notify({
          //     title: response.code === 0 ? '成功' : '操作失败',
          //     message: response.msg,
          //     type: response.code === 0 ? 'success' : 'error',
          //     duration: response.code === 0 ? 2000 : 0
          //   })
          //   this.submitting = false
          //   this.handleFilter()
          // })
        }
      })
    },
    deleteMerchantChannelBan(item) { 
      const cmsg = '即将删除商户通道『 '+item.robot_no+' 』,请确认!'
      this.$confirm(cmsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        delRebotComputer({delete_id: item.id}).then(response => {
            this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
            })
            this.handleFilter()
        })
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


<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <!-- <el-form-item label="商户类型">
        <el-select v-model="queryParams.type" size="mini" clearable style="width:110px">
          <el-option v-for="(value, key) in typeMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="商户名称">
        <el-input v-model="queryParams.merchant_name"></el-input>
      </el-form-item>
      <el-form-item label="商户状态">
        <el-select v-model="queryParams.status" size="mini" clearable style="width:110px" placeholder="全部">
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
    	<el-button type="primary" size="small" @click="handleMerchantBan(0)">批量启用商户</el-button>
      <el-button type="warning" size="small" @click="handleMerchantBan(1)">批量禁用商户</el-button>
    </el-row>

    <el-table :cell-style="cellStyle" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
      <el-table-column type="selection" width="50" align="center" fixed>
      </el-table-column>
      <el-table-column prop="merchant_name" label="商户名称" align="center">
      </el-table-column>
      <el-table-column prop="merchant_code" label="商户CODE" align="center">
      </el-table-column>
      <el-table-column prop="merchant_pay_key" label="商户充值token" align="center">
      </el-table-column>
      <el-table-column prop="balance" label="余额" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.balance !== null">{{$priceFormat((scope.row.balance?scope.row.balance:0).toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="商户状态" align="center" width="70">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter"> {{statusMap[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" align="center">
      </el-table-column>
      <el-table-column prop="reload_time" label="重载时间" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click.native="deleteMerchantBan(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" @click.native="handleMoney(scope.row)" size="mini">加减款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 用form2提交数据, 需要titleMap2, label2, dialog2Visible, updating2 -->
    <el-dialog :close-on-click-modal="false" :title="titleMap2[form2.type]" :visible.sync="dialog2Visible" width="28%" v-draggable>
      <el-form class="small-space" :model="form2" label-position="left" label-width="100px">
        <el-form-item :label="labelMap2[form2.type]">
          <el-input v-model="form2.max" placeholder="单位元"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog2Visible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdateMaxBatch" :loading="updating2" >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="商户名称" prop="merchant_name">
          <el-input v-if="dialogStatus=='create'" v-model="form.merchant_name" placeholder="2-8中文字符" ></el-input>
          <el-input v-else v-model="form.merchant_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="商户CODE" prop="merchant_code">
          <el-input v-if="dialogStatus=='create'" v-model="form.merchant_code" placeholder="2-8位字母或数字组成" ></el-input>
          <el-input v-else v-model="form.merchant_code" disabled></el-input>
        </el-form-item>
        <el-form-item label="充值token" prop="merchant_pay_key">
          <el-input v-model="form.merchant_pay_key" placeholder="充值token">
            <el-button slot="append" @click="generateKey('merchant_pay_key')" >随机生成</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" size="small">
            <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop='memo'>
          <el-input v-model="form.memo" placeholder="最多不超过10个汉字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="doCreate" :loading="submitting">确 定</el-button>
        <el-button v-else type="primary" @click="doUpdate" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="加减款" :visible.sync="addMoenyDialogShow" width="25%" v-draggable>
      <el-form class="small-space" :model="form2" ref="form2" :rules="rules2" label-position="left" label-width="100px">
        <el-form-item label="商户名称">
          <el-input v-model="form2.merchant_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="加减金额" prop="money">
          <el-input v-model="form2.money" placeholder="正数加款,负数减款(单位元)">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMoenyDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="doAddMoney" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMerchant, updateMerchant, addMerchant, deleteMerchant, updateMerchantDayRechargeMax, updateMerchantDayDrawMax, banMerchant, banMerchantRechargeFlag, banMerchantDrawFlag, merchantAddMoney } from '@/api/service'

export default {
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
    const isInteger2 = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!/^[-]?\d+\.?\d{0,2}$/.test(value) || value == 0) {
          callback(new Error('请填写非0数字,最多两位小数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const isInteger3 = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (isNaN(Number(value))) {
          callback(new Error('请填正确数值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      list: null,
      total: null,
      listLoading: true,
      submitting: false,
      queryParams: {
        page: 1,
        limit: 40,
        status: ''
      },
      updating2: false,
      createVisible: false,
      dialog2Visible: false,
      drawDialogVisible: false,
      addMoenyDialogShow: false,
      form: {},
      form2: {
      },
      rules: {
        merchant_code: [
          { required: true, message: '请填写商户CODE' },
          { max: 8, message: '最长8位' },
          { min: 2, message: '最短2位' }
        ],
        merchant_name: [
          { required: true, message: '请填写商户名称' },
          { max: 8, message: '最长8位' },
          { min: 2, message: '最短2位' }
        ],
        merchant_pay_key: [
          { required: true, message: '请填写充值token' }
        ],
        merchant_draw_key: [
          { required: true, message: '请填写转账token' }
        ],
        pay_max: [
          { validator: isInteger }
        ],
        draw_max: [
          { validator: isInteger }
        ],
        memo: [
          { max: 10, message: '最长10位' }
        ]
      },
      rules2: {
        money: [
          { required: true, message: '请填写加款金额' },
          { validator: isInteger3 }
        ],
        google_code: [
          { required: true, message: '请填写google验证码' }
        ]
      },
      dialogStatus: '',
      statusMap: { 0: '启用', 1: '禁用' },
      statusOptions: { 0: '启用', 1: '禁用' },
      typeMap: { 0: '正常商户', 1: '虚拟商户', 2: '平台商户' },
      flagMap: { 0: '正常', 1: '关闭' },
      titleMap: { update: '编辑', create: '创建' },
      titleMap2: { 0: '批量修改充值限额', 1: '批量修改提现限额' },
      labelMap2: { 0: '每日充值限额', 1: '每日提现限额' }
    }
  },
  filters: {
    statusFilter(status) {
      const map = { '1': 'danger', '0': 'success' }
      return map[status]
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
    generateKey(keyType) {
      const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      var str = ''
      for (let i = 0; i < 16; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      this.$set(this.form, keyType, str)
    },
    fetchData() {
      this.listLoading = true
      listMerchant(this.queryParams).then(response => {
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
    handleMoney(row) {
      this.form2 = row
      this.addMoenyDialogShow = true
    },
    handleCreate() {
      this.form = {}
      this.dialogStatus = 'create'
      this.createVisible = true
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.form.status = '' + this.form.status
      // this.form.type = '' + this.form.type
      this.dialogStatus = 'update'
      this.createVisible = true
    },
    doCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          addMerchant(this.form).then(response => {
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
    doAddMoney() {
      this.$refs.form2.validate(valid => {
        if (valid) {
          this.$confirm(`您确定给${this.form2.merchant_name}加款吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitting = true
            merchantAddMoney({ id: this.form2.id, balance: this.form2.money }).then(response => {
              this.createVisible = false
              this.$notify({
                title: response.code === 0 ? '成功' : '操作失败',
                message: response.msg,
                type: response.code === 0 ? 'success' : 'error',
                duration: response.code === 0 ? 2000 : 0
              })
              this.addMoenyDialogShow = false
              this.submitting = false
              this.handleFilter()
            })
          })
        }
      })
    },
    doUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          updateMerchant(this.form).then(response => {
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
    handleRechargeOrDraw(type) { // 0:充值; 1:提现
      if (this.multipleSelection === undefined || this.multipleSelection.length === 0) {
        this.$notify({
          title: '操作提示',
          message: '请先选择要修改的选项',
          type: 'info',
          duration: 1000
        })
        return
      }
      this.form2.type = type
      this.dialog2Visible = true
    },
    doUpdateMaxBatch() {
      if (!/^[1-9]\d*|0$/.test(this.form2.max)) {
        this.$notify({
          title: '参数错误',
          message: '限额为非负整数',
          type: 'error',
          duration: 2000
        })
        return false
      }
      this.updating2 = true
      if (this.form2.type === 0) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const mid = this.multipleSelection[i].id
          updateMerchantDayRechargeMax({ id: mid, pay_max: this.form2.max }).then(response => {
            this.$notify({
              title: response.code === 0 ? '设置成功' : '操作失败',
              message: mid + ': ' + response.msg,
              type: response.code === 0 ? 'success' : 'error',
              duration: response.code === 0 ? 2000 : 0
            })
            this.handleFilter()
          })
        }
      } else if (this.form2.type === 1) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          updateMerchantDayDrawMax({ id: this.multipleSelection[i].id, draw_max: this.form2.max }).then(response => {
            this.$notify({
              title: response.code === 0 ? '设置成功' : '操作失败',
              message: this.multipleSelection[i].id + response.msg,
              type: response.code === 0 ? 'success' : 'error',
              duration: response.code === 0 ? 2000 : 0
            })
            this.handleFilter()
          })
        }
      }
      this.updating2 = false
      this.dialog2Visible = false
    },

    handleMerchantBan(st) { // st = 0 表示要启用
      if (st !== 0 && st !== 1) {
        this.$notify({
          title: '操作提示',
          message: '请先选择要修改的选项',
          type: 'info',
          duration: 1000
        })
        return
      }
      if (this.multipleSelection === undefined || this.multipleSelection.length === 0) return
      const cmsg = st === 0 ? '批量启用商户，请确认！' : '批量停用商户，请确认！'
      this.$confirm(cmsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.doBan({ id: this.multipleSelection[i].id, status: st }, st)
        }
        this.handleFilter()
      })
    },
    doBan(data, st) {
      banMerchant(data).then(response => {
        this.$notify({
          title: '成功',
          message: st === 0 ? '启用成功' : '停用成功',
          type: 'success',
          duration: 2000
        })
        this.handleFilter()
      })
    },
    deleteMerchantBan(item) { 
        const cmsg = '即将删除商户『 '+item.merchant_name+' 』,请确认!'
        this.$confirm(cmsg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          deleteMerchant({delete_id: item.id}).then(response => {
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
    handleRechargeFlagBan(st) { // st = 0 表示要启用
      if (st !== 0 && st !== 1) {
        this.$notify({
          title: '操作提示',
          message: '请先选择要修改的选项',
          type: 'info',
          duration: 1000
        })
        return
      }
      if (this.multipleSelection === undefined || this.multipleSelection.length === 0) return
      const cmsg = st === 0 ? '批量启用充值通道，请确认！' : '批量停用充值通道，请确认！'
      this.$confirm(cmsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.doRechargeFlagBan({ id: this.multipleSelection[i].id, pay_status: st }, st)
        }
        this.handleFilter()
      })
    },
    doRechargeFlagBan(data, st) {
      banMerchantRechargeFlag(data).then(response => {
        this.$notify({
          title: '成功',
          message: st === 0 ? '启用成功' : '停用成功',
          type: 'success',
          duration: 2000
        })
        this.handleFilter()
      })
    },
    handleDrawFlagBan(st) { // st = 0 表示要启用
      if (st !== 0 && st !== 1) {
        this.$notify({
          title: '操作提示',
          message: '请先选择要修改的选项',
          type: 'info',
          duration: 1000
        })
        return
      }
      if (this.multipleSelection === undefined || this.multipleSelection.length === 0) return
      const cmsg = st === 0 ? '批量启用提现通道，请确认！' : '批量停用提现通道，请确认！'
      this.$confirm(cmsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.doDrawFlagBan({ id: this.multipleSelection[i].id, draw_status: st }, st)
        }
        this.handleFilter()
      })
    },
    doDrawFlagBan(data, st) {
      banMerchantDrawFlag(data).then(response => {
        this.$notify({
          title: '成功',
          message: st === 0 ? '启用成功' : '停用成功',
          type: 'success',
          duration: 2000
        })
        this.handleFilter()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectItem(row, column, cell, event) {
      // console.log(column)
      if (column.type === 'selection' || column.property === 'merchant_id') {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
    }
  }
}
</script>
<style scoped>
.red{color: red}
</style>



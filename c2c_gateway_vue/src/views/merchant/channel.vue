<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="商户名称">
        <el-select v-model="queryParams.merchant_name" size="mini" clearable style="width:160px">
          <el-option v-for="(value, key) in merchantMap" :key="key" :label="value" :value="value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道类别">
        <el-select v-model="queryParams.is_pay" size="mini" clearable style="width:160px">
          <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="queryParams.way_type" size="mini" clearable style="width:160px">
          <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px;">
    	<el-button type="primary" size="small" @click="handleFictitiousBan(0)">批量启用</el-button>
      <el-button type="warning" size="small" @click="handleFictitiousBan(1)">批量禁用</el-button>
    </el-row>

    <el-table :cell-style="cellStyle" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" border stripe fit highlight-current-row size="small">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column label="商户名称" align="center" prop="merchant_name"></el-table-column>
      <el-table-column label="通道类别" align="center">
        <template slot-scope="scope">
          {{ channelMap[scope.row.is_pay] }}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          {{ payMap[scope.row.way_type] }}
        </template>
      </el-table-column>
      <el-table-column prop="fee_rate" label="费率" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.fee_rate }}%
        </template>
      </el-table-column>
      <el-table-column prop="profit" label="平台成本" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.profit }}%
        </template>
      </el-table-column>
      <el-table-column prop="status" label="通道状态" align="center" width="70">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter"> {{statusMap[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" align="center" width="160">
      </el-table-column>
      <el-table-column prop="reload_time" label="重载时间" align="center" width="160">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click.native="deleteMerchantChannelBan(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[10,20,30]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 用form2提交数据, 需要titleMap2, label2, dialog2Visible, updating2 -->
    <el-dialog :title="titleMap2[form2.type]" :visible.sync="dialog2Visible" width="28%" v-draggable>
      <el-form class="small-space" :model="form2" label-position="right" label-width="100px">
        <el-form-item :label="labelMap2[form2.type]">
          <el-input v-model="form2.changeBalance" placeholder="单位元"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog2Visible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdateBalance" :loading="updating2" >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="340px" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" initial="off" label-position="left" label-width="80px">
        <el-form-item label="商户名称" prop="merchant_name">
          <el-select v-if="dialogStatus=='create'" v-model="form.merchant_name" size="small" clearable>
            <el-option v-for="(value, key) in merchantMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
          <el-select v-else v-model="form.merchant_name" size="small" clearable disabled>
            <el-option v-for="(value, key) in merchantMap" :key="key" :label="value" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道类别" prop="is_pay">
          <el-select v-model="form.is_pay" size="small" clearable>
            <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="way_type">
          <el-select v-model="form.way_type" size="small" clearable>
            <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费率" prop="fee_rate" size="small">
          <el-input v-model="form.fee_rate" style="width: 200px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="平台成本" prop="profit" size="small">
          <el-input v-model="form.profit" style="width: 200px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="form.status" size="small">
              <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
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
import { mapGetters } from 'vuex'
import { listFictitiousTree, listFictitious, updateFictitious, addFictitious, deleteFictitious, changeFictitiousBalance, banFictitious } from '@/api/service'

export default {
  computed: {
    ...mapGetters([
      'merchantMap',
      'merchantKeyMap'
    ])
  },
  data() {
    const isInteger = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (/^\-(.*)/.test(value)) {
          callback(new Error('请填写正数'))
        } else if (isNaN(Number(value))) {
          callback(new Error('请填正确数值'))
        } else if (/\.\d{3,10}$/.test(value)) {
          callback(new Error('最多两位小数'))
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
        limit: 10
      },
      updating2: false,
      createVisible: false,
      dialog2Visible: false,
      drawDialogVisible: false,
      form: {
        status: 0
      },
      form2: { // 用于批量加钱,减钱
        type: 0 // 0:加钱; 1:减钱
      },
      rules: {
        merchant_name: [
          { required: true, message: '请填写商户名称' }
        ],
        is_pay: [
          { required: true, message: '请选择通道类别' }
        ],
        way_type: [
          { required: true, message: '请选择支付方式' }
        ],
        fee_rate: [
          { required: true, message: '请输入费率' },
          { validator: isInteger }
        ],
        profit: [
          { required: true, message: '请输入平台成本' },
          { validator: isInteger }
        ]
      },
      dialogStatus: '',
      statusMap: { 0: '启用', 1: '禁用' },
      statusOptions: { 0: '启用', 1: '禁用' },
      loginMap: { 0: '已登录', 1: '未登录' },
      channelMap: { 0: '转账', 1: '充值' },
      payMap: { 1: '支付宝', 2: '微信', 3: '银行卡', 4: '云闪付' },
      titleMap: { update: '编辑', create: '创建' },
      titleMap2: { 0: '批量加钱', 1: '批量减钱' },
      labelMap2: { 0: '加钱', 1: '减钱' }
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
    generateKey() {
      const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      var str = ''
      for (let i = 0; i < 16; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      this.$set(this.form, 'token', str)
    },
    fetchData() {
      this.listLoading = true
      listFictitious(this.queryParams).then(response => {
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
    handleCreate() {
      this.form = { 'status': '0' }
      this.dialogStatus = 'create'
      this.createVisible = true
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.form.status = '' + this.form.status
      this.form.is_pay = '' + this.form.is_pay
      this.form.way_type = '' + this.form.way_type
      this.dialogStatus = 'update'
      this.form.merchant_code = row.merchant_code
      this.createVisible = true
    },
    doCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          this.form.merchant_code = this.merchantKeyMap[''+this.form.merchant_name]
          this.form.merchant_name = this.merchantMap[''+this.form.merchant_name]
          addFictitious(this.form).then(response => {
            this.submitting = false
            this.$notify({
              title: response.code === 0 ? '成功' : '操作失败',
              message: response.msg,
              type: response.code === 0 ? 'success' : 'error',
              duration: response.code === 0 ? 2000 : 0
            })
            if (response.code === 0) {
              this.handleFilter()
            }
            this.createVisible = false
          })
        }
      })
    },
    doUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          updateFictitious(this.form).then(response => {
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
    handleBalance(type) { // 0:充值; 1:提现
      if (this.multipleSelection === undefined || this.multipleSelection.length === 0) return
      this.form2.type = type
      this.dialog2Visible = true
    },
    doUpdateBalance() {
      if (!/^[1-9]\d*$/.test(this.form2.changeBalance)) {
        this.$notify({
          title: '参数错误',
          message: '金额为正整数',
          type: 'error',
          duration: 2000
        })
        return false
      }
      this.updating2 = true
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const fid = this.multipleSelection[i].fict_id
        changeFictitiousBalance({ fict_id: fid, changeBalance: this.form2.changeBalance, type: this.form2.type }).then(response => {
          this.$notify({
            title: response.code === 0 ? '操作成功' : '操作失败',
            message: fid + ': ' + response.msg,
            type: response.code === 0 ? 'success' : 'error',
            duration: response.code === 0 ? 2000 : 0
          })
          this.handleFilter()
        })
      }
      this.updating2 = false
      this.dialog2Visible = false
    },

    handleFictitiousBan(st) { // st = 0 表示要启用
      if (st !== 0 && st !== 1) return
      if (this.multipleSelection === undefined || this.multipleSelection.length === 0) return
      const cmsg = st === 0 ? '批量启用虚拟用户，请确认！' : '批量停用虚拟用户，请确认！'
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
      banFictitious(data).then(response => {
        this.$notify({
          title: '成功',
          message: st === 0 ? '启用成功' : '停用成功',
          type: 'success',
          duration: 2000
        })
        this.handleFilter()
      })
    },
    deleteMerchantChannelBan(item) { 
      const cmsg = '即将删除商户通道『 '+item.merchant_name+' 』,请确认!'
      this.$confirm(cmsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        deleteFictitious({delete_id: item.id}).then(response => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style scoped>
.red{color: red}
.el-form-item {margin-bottom: 18px;}
.el-dialog__body{padding:0px 20px; }
</style>



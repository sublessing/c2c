<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="支付方式">
        <el-select v-model="queryParams.way_type" size="mini" clearable style="width:160px" @change="payTypeChange">
          <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
        <!-- <el-button type="primary" @click="handleCreate" v-if="urls.includes('/merchant/way_weight/curd/')">新增</el-button> -->
        <el-button type="warning" @click="reload" v-if="urls.includes('/merchant/way_weight/reload/')">重载</el-button>
      </el-form-item>
    </el-form>

    <el-table :cell-style="cellStyle" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          {{ payMap[scope.row.way_type] }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="子支付方式" align="center">
        <template slot-scope="scope">
          {{ baseWayMap[scope.row.way_type_sub] }}
        </template>
      </el-table-column> -->
      <el-table-column label="子支付方式code" align="center">
        <template slot-scope="scope">
          {{ scope.row.way_type_sub }}
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center">
        <template slot-scope="scope">
          {{ scope.row.weight }}
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
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit" v-if="urls.includes('/merchant/way_weight/curd/')">编辑</el-button>
          <el-button type="danger" @click.native="deleteMerchantChannelBan(scope.row)" size="mini" icon="el-icon-delete" v-if="urls.includes('/merchant/way_weight/curd/')">删除</el-button>
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

    <el-dialog :close-on-click-modal="false" :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="35%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" initial="off" label-position="left" label-width="100px">
        <el-form-item label="支付方式" prop="way_type">
          <el-select v-if="dialogStatus === 'create'" v-model="form.way_type" size="small" clearable @change="payTypeChange">
            <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
          <el-select v-else v-model="form.way_type" size="small" disabled>
            <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子支付方式" prop="way_type_sub">
          <el-select v-if="dialogStatus === 'create'" v-model="form.way_type_sub" clearable prop="way_type_sub">
            <el-option v-for="(value, key) in subWayMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
          <el-select v-else v-model="form.way_type_sub" clearable prop="way_type_sub" disabled>
            <el-option v-for="(value, key) in subWayMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入权重">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" size="small">
          <el-input v-if="dialogStatus === 'create'" v-model="form.memo" placeholder="请输入备注"></el-input>
          <el-input v-else v-model="form.memo" placeholder="请输入备注" disabled></el-input>
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
import { listFictitiousTree, listWayWeight, editWayWeight, addWayWeight, delWayWeight, resetWayWeight, changeFictitiousBalance, banFictitious } from '@/api/service'

export default {
  computed: {
    ...mapGetters([
      'merchantMap2',
      'merchantKeyMap',
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
      list: null,
      total: null,
      listLoading: true,
      submitting: false,
      queryParams: {
        page: 1,
        limit: 20
      },
      updating2: false,
      createVisible: false,
      dialog2Visible: false,
      drawDialogVisible: false,
      form: {

      },
      form2: { // 用于批量加钱,减钱
        type: 0 // 0:加钱; 1:减钱
      },
      rules: {
        merchant_code: [
          { required: true, message: '请选择商户' }
        ],
        is_pay: [
          { required: true, message: '请选择通道类别' }
        ],
        way_type: [
          { required: true, message: '请选择支付方式' }
        ],
        way_type_sub: [
          { required: true, message: '请选择子支付方式' }
        ],
        weight: [
          { required: true, message: '请输入权重' }
        ],
        profit: [
          { required: true, message: '请输入平台成本' }
        ]
      },
      dialogStatus: '',
      statusMap: { 0: '启用', 1: '禁用' },
      statusOptions: { 0: '启用', 1: '禁用' },
      loginMap: { 0: '已登录', 1: '未登录' },
      channelMap: { 0: '转账', 1: '充值' },
      payMap: { 1: '支付宝', 2: '微信', 3: '银行卡', 4: '云闪付' },
      subWayMap: {},
      baseWayMap: {
        '101': '支付宝-普通转帐', 
        '102': '支付宝-自助转帐', 
        '103': '支付宝-支付宝红包', 
        '104': '支付宝-支付宝银行卡', 
        '105': '支付宝-支付宝收款', 
        '106': '支付宝-支付宝固码', 
        '201': '微信-微信转账', 
        '202': '微信-微信固码', 
        '301': '银行卡', 
        '401': '云闪付', 
      },
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
    this.payTypeChange()
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
    payTypeChange (id) {
      this.$set(this.queryParams, 'way_type_sub', null);
      if (id) {
        var map = {},reg = new RegExp('^'+id);
        for (var name in this.baseWayMap) {
          if (reg.test(name)) {
            map[name] = this.baseWayMap[name];
          }
        }
        this.$set(this, 'subWayMap', map);
      }else{
        this.$set(this, 'subWayMap', this.baseWayMap);
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
      listWayWeight(this.queryParams).then(response => {
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
      this.form = {}
      this.dialogStatus = 'create'
      this.createVisible = true
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.form.way_type = '' + this.form.way_type
      this.form.way_type_sub = '' + this.form.way_type_sub
      this.form.weight = '' + this.form.weight
      this.dialogStatus = 'update'
      this.createVisible = true
    },
    doCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          addWayWeight(this.form).then(response => {
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
          editWayWeight(this.form).then(response => {
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
      const cmsg = '即将删除商户通道『 '+this.payMap[item.way_type]+'-'+this.subWayMap[item.way_type_sub]+' 』,请确认!'
      this.$confirm(cmsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        delWayWeight({delete_id: item.id}).then(response => {
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
    },
    selectItem(row, column, cell, event) {
      if (column.type === 'selection' || column.property === 'fict_id') {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
    },
    reload() {
      this.$confirm('您确定重载权重吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reseting = true
        resetWayWeight().then(response => {
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
<style scoped>
.red{color: red}
.el-form-item {margin-bottom: 18px;}
.el-dialog__body{padding:0px 20px; }
</style>



<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="绑定资源">
        <el-select v-model="queryParams.res_id" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in sourceMap" :key="key" :label="value" :value="key" v-if="key!='null'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleCreate">新 增</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px;">
        <el-button type="primary" size="small" @click="handleMerchantBan(0)">批量启用</el-button>
        <el-button type="warning" size="small" @click="handleMerchantBan(1)">批量禁用</el-button>
        <el-button type="primary" size="small" @click="handleUpdateMaxMoney()">批量修改充值限额</el-button>
        <el-button type="warning" size="small" @click="updateFailedCount()">批量清理失败次数</el-button>
    </el-row>
    <el-table :cell-style="cellStyle" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
      <el-table-column type="selection" width="60" align="center" fixed>
      </el-table-column>
      <el-table-column label="绑定资源ID" width="100" align="center">
        <template slot-scope="scope">
          {{sourceMap[''+scope.row.res_id]}}
        </template>
      </el-table-column>
      <el-table-column label="银行卡名称" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.bank_name}}
        </template>
      </el-table-column>
      <el-table-column label="银行卡简称" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.bank_code}}
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" align="center">
        <template slot-scope="scope">
          {{scope.row.card_no}}
        </template>
      </el-table-column>
      <el-table-column label="开户名" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.user_name}}
        </template>
      </el-table-column>
      <el-table-column prop="max_money" label="每日充值限额" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.max_money !== null">{{$priceFormat(scope.row.max_money.toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="today_money" label="当前充值额" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.today_money !== null">{{$priceFormat(scope.row.today_money.toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号状态" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.is_ban | statusFilter"> {{ statusMap[''+scope.row.is_ban] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fail_count" label="连续失败次数" width="100" align="center"></el-table-column>
      <el-table-column prop="update_time" label="修改时间" width="140" align="center">
      </el-table-column>
      <el-table-column prop="reload_time" label="重载时间" width="140" align="center">
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center" width="100">
      </el-table-column>
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button> -->
          <el-button type="danger" @click.native="deleteMerchantBan(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px; display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[10,20,40]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="130px">
        <el-form-item label="绑定资源" prop="res_id" size="small">
            <el-select v-if="dialogStatus == 'create'" v-model="form.res_id" placeholder="请选择绑定资源" clearable>
              <el-option v-for="(value, key) in sourceMap" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
            <el-select v-else v-model="form.res_id" placeholder="请选择绑定资源" disabled>
              <el-option v-for="(value, key) in sourceMap" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选择银行" prop="bank" size="small">
            <el-select v-model="form.bank" placeholder="选择银行" clearable>
              <el-option v-for="(value, key) in bankMap" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="银行卡名称" prop="bank_name" size="small" v-if="form.bank === 'other'" :required="form.bank === 'other'">
          <el-input v-model="form.bank_name" placeholder="银行卡名称" ></el-input>
        </el-form-item>
        <el-form-item label="银行卡简称" prop="bank_code" size="small" v-if="form.bank === 'other'" :required="form.bank === 'other'">
          <el-input v-model="form.bank_code" placeholder="银行卡简称" ></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="card_no" size="small">
          <el-input v-model="form.card_no" placeholder="银行卡号" ></el-input>
        </el-form-item>
        <el-form-item label="开户名" prop="user_name" size="small">
          <el-input v-model="form.user_name" placeholder="开户名" ></el-input>
        </el-form-item>
        <el-form-item label="每日充值限额" prop="max_money" size="small" v-if="dialogStatus=='create'">
          <el-input v-model="form.max_money" placeholder="每日充值限额" ></el-input>
        </el-form-item>
        <el-form-item label="备注" size="small">
          <el-input v-model="form.memo" placeholder="备注" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="doCreate" :loading="submitting">确 定</el-button>
        <el-button v-else type="primary" @click="doUpdate" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改限额" :visible.sync="moneyDialog" width="30%" v-draggable>
      <el-form class="small-space" :model="moneyForm" ref="form" label-position="left" label-width="130px">
        <el-form-item label="单日限额">
          <el-input v-model="moneyForm.max_money" placeholder="请输入单日限额"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moneyDialog = false">取 消</el-button>
        <el-button type="primary" @click="moneyBan" :loading="moneySubmitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listTpResourceApiSelectList, listBank, addBank, editBank, editStatusBank, delBank, updateBankFailCount, updateBankStatus, listBankSelectConfig } from '@/api/service'
import { parseTime } from '@/utils/index'
export default {
  computed: {
    ...mapGetters([
      'urls',
      ''
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
    const contaisTszf = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (/[&?*%]/.test(value)) {
          callback(new Error('不能包含特殊字符'))
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
      queryMoreId: 0,
      listLoading: false,
      callbackLoading: false,
      toSuccDialogShow: false,
      submitting: false,
      form: {},
      multipleSelection: [],
      queryParams: {
        page: 1,
        limit: 20
      },
      rules: {
        res_id: [
          { required: true, message: '绑定资源必填' }
        ],
        bank: [
          { required: true, message: '银行必填' }
        ],
        card_no: [
          { required: true, message: '银行卡号必填' }
        ],
        user_name: [
          { required: true, message: '开户名必填' }
        ],
        max_money: [
          { required: true, message: '每日充值限额必填' },
          { validator: isInteger }
        ]
      },
      statusMap: { '0': '启用', '1': '禁用' },
      callbackStatusMap: { '0': '回调成功', '1': '回调失败', '2': '初始化'},
      confirmTypeMap: { '0': '系统确认', '1': '后台确认' },
      dataTypeMap: { '0': '创建时间', '1': '支付时间', '2': '完成时间' },
      sourceMap: {},
      channelMap: { 1: '支付宝', 2: '微信', 3: '银行卡', 4: '云闪付' },
      titleMap: {'create': '添加银行卡', 'update': '修改银行卡'},
      downloadLoading: false,
      dialogStatus: 'create',
      createVisible: false,
      moneyForm: {},
      moneyDialog: false,
      moneySubmitting: false,
      bankMap: {
        'other': '其他'
      }
    }
  },
  filters: {
    statusFilter(status) {
      const map = { '0': 'success', '1': 'danger', '2': 'warning' }
      return map[status]
    },
    callbackFilter(callback) {
      const map = {  '0': 'success', '1': 'danger', '2': 'warning', '3': 'warning' }
      return map[callback]
    }
  },
  created() {
    this.getBankMap()
    this.getSourceMap()
    this.fetchData()
  },
  methods: {
    getBankMap () {
      listBankSelectConfig().then(res => {
        this.$set(this.bankMap, 'other', '其他')
        res.data.items.map(e => {
          this.$set(this.bankMap, e.bank_code, e.bank_name)
        })
      })
    },
    cellStyle (data) {
      if (new Date(data.row.reload_time).getTime() < new Date(data.row.update_time).getTime()) {
        return {
          "background-color": "rgba(255, 0, 0, 0.1)"
        }
      }
    },
    handleMerchantBan(st) { // st = 0 表示要启用
        if (this.multipleSelection.length === 0) {
            this.$notify({
                title: '操作提示',
                message: '请先选择要修改的选项',
                type: 'info',
                duration: 1000
            })
            return
        }
        const cmsg = st === 0 ? '批量启用渠道，请确认！' : '批量停用渠道，请确认！'
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
        updateBankStatus(data).then(response => {
            this.$notify({
                title: '成功',
                message: st === 0 ? '启用成功' : '停用成功',
                type: 'success',
                duration: 2000
            })
            this.handleFilter()
        })
    },
    updateFailedCount() { 
      if (this.multipleSelection.length === 0) {
          this.$notify({
              title: '操作提示',
              message: '请先选择要修改的选项',
              type: 'info',
              duration: 1000
          })
          return
      }
      const cmsg = '即将清理选中的失败次数,请确认!'
      this.$confirm(cmsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          updateBankFailCount({id: this.multipleSelection[i].id}).then(response => {
              this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
              })
              this.handleFilter()
          })
        }
      })
    },
    deleteMerchantBan(item) { 
      const cmsg = '即将删除银行卡『 '+item.user_name+' 』,请确认!'
      this.$confirm(cmsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        delBank({delete_id: item.id}).then(response => {
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
    moneyBan () {
      this.moneySubmitting = true;
      for (let i = 0; i < this.multipleSelection.length; i++) {
          editStatusBank({ id: this.multipleSelection[i].id, max_money: this.moneyForm.max_money }).then(response => {
              this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
              })
              this.moneySubmitting = false;
              this.handleFilter()
          })
      }
      this.moneyDialog = false;
    },
    handleUpdateMaxMoney () {
        if (this.multipleSelection.length === 0) {
            this.$notify({
                title: '操作提示',
                message: '请先选择要修改的选项',
                type: 'info',
                duration: 1000
            })
            return
        }
        this.moneyForm = {};
        this.moneyDialog = true;
    },
    handleCreate() {
        this.form = {}
        this.dialogStatus = 'create'
        this.createVisible = true
    },
    handleUpdate(row) {
        this.form = Object.assign({}, row)
        this.$set(this.form, 'bank', this.form.bank_code)
        if (this.bankMap[this.form.bank_code] === undefined) {
          this.$set(this.form, 'bank', 'other')
        }
        this.dialogStatus = 'update'
        this.createVisible = true
    },
    doCreate(){
        this.$refs.form.validate(validate => {
            if(!validate) return;
            this.submitting = true
            if (this.form.bank !== 'other') {
                this.$set(this.form, 'bank_name', this.bankMap[this.form.bank])
                this.$set(this.form, 'bank_code', this.form.bank)
            }
            delete this.form.bank
            addBank(this.form).then(response => {
                this.createVisible = false
                this.$notify({
                    title: response.code === 0 ? '添加成功' : '操作失败',
                    message: response.msg,
                    type: response.code === 0 ? 'success' : 'error',
                    duration: response.code === 0 ? 2000 : 0
                })
                this.submitting = false
                this.handleFilter()
            })
        })
    },
    doUpdate(){
        this.$refs.form.validate(valid => {
            if (!valid) return;
            this.submitting = true
            if (this.form.bank !== 'other') {
                this.$set(this.form, 'bank_name', this.bankMap[this.form.bank])
                this.$set(this.form, 'bank_code', this.form.bank)
            }
            delete this.form.bank
            editBank(this.form).then(response => {
                this.createVisible = false
                this.$notify({
                    title: response.code === 0 ? '修改成功' : '操作失败',
                    message: response.msg,
                    type: response.code === 0 ? 'success' : 'error',
                    duration: response.code === 0 ? 2000 : 0
                })
                this.submitting = false
                this.handleFilter()
            })
        })
    },
    getSourceMap() {
      listTpResourceApiSelectList({way_type: 4}).then(res => {
        if (res.data.items) {
          res.data.items.map(e => {
            this.$set(this.sourceMap, e.id, e.res_name)
          })
        }
      })
    },
    fetchData() {
      this.listLoading = true
      listBank(this.queryParams).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.queryParams.page = 1
      this.fetchData()
    },
    handleSucc(row) {
      this.form = Object.assign({}, row)
      this.form.channel_id = '' + this.form.channel_id
      if (this.form.confirm_type !== undefined)
        this.form.confirm_type = '' + this.form.confirm_type
      this.toSuccDialogShow = true
    },
    doOrderSuccess() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          this.form.isPay = 0;
          this.form.pay_time = new Date(this.form.pay_time).getTime();
          orderDrawToSuccess(this.form).then(response => {
            this.toSuccDialogShow = false
            this.$notify({
              title: response.code === 0 ? '操作成功' : '操作失败',
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
    queryMore(recharge_id, order_no) {
      this.$confirm('您确定再次查询吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.queryMoreId = recharge_id
        orderRechargeQueryMore({ recharge_id: recharge_id, order_no: order_no }).then((response) => {
          this.$notify({
            title: response.code === 0 ? '查询成功' : '查询失败',
            message: response.msg,
            type: response.code === 0 ? 'success' : 'error',
            duration: response.code === 0 ? '2000' : 0
          })
          this.queryMoreId = 0
          this.handleFilter()
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
    handleDownload() {
      this.downloadLoading = true
      orderRechargeExcel(this.queryParams).then(response => {
        this.downloadData = response.data.items
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            'ID', '创建时间', '支付时间', '完成时间', '平台订单号',
            '商户订单号', '商户名称', '转账渠道名', '通道类型', '商户转账金额(元)',
            '实际转账金额(元)', '手续费', '订单状态', '通道回调状态', '回调状态', '商户回调地址',
            '回调时间', '对方订单号', '商户用户数据', '支付通道用户数据'
          ]
          const filterVal = [
            'id', 'create_time', 'pay_time', 'finish_time', 'order_no',
            'merchant_order_no', 'merchant_name', 'channel_id', 'way_type', 'order_money',
            'order_real_money', 'draw_fee', 'status', 'way_callback', 'notify_merchant', 'notify_url',
            'callback_time', 'order_no', 'category', 'address'
          ]
          if (!this.urls.includes('/order/draw/callback/')) {
            tHeader.splice(7, 1);
            filterVal.splice(7, 1);
          }
          const data = this.formatJson(filterVal, this.downloadData)
          export_json_to_excel(tHeader, data, '提现订单')
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'channel_id') {
          return this.sourceMap[v.channel_id]
        } else if (j === 'way_type') {
          return this.channelMap[v.way_type]
        } else if (j === 'status') {
          return this.statusMap[v.confirm_type]
        } else if (j === 'way_callback') {
          return this.callbackStatusMap[v.confirm_type]
        } else if (j === 'notify_merchant') {
          return this.callbackStatusMap[v.confirm_type]
        } else {
          return v[j]
        }
      }))
    },
    handleCallbackBatch(item) {
      if (item && item.order_no)
        this.multipleSelection.push(item)
      if (this.multipleSelection.length === 0) {
        return
      }
      this.$confirm('您确定手工回调这些订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.callbackLoading = true
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.doCallback({ orderNo: this.multipleSelection[i].order_no, isPay: 0 })
          if (i === this.multipleSelection.length - 1) {
            this.callbackLoading = false
            this.handleFilter()
          }
        }
      }).catch(() => {
        this.multipleSelection = []
      })
    },
    doCallback(data) {
      drawOrderCallback(data).then(response => {
        this.$notify({
          title: response.code === 0 ? '回调成功' : '回调失败',
          message: response.msg,
          type: response.code === 0 ? 'success' : 'error',
          duration: response.code === 0 ? '1000' : 0
        })
        this.multipleSelection = []
        this.handleFilter()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectItem(row, column, cell, event) {
      if (column.type === 'selection' || column.property === 'merchant_id') {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
    }
  }
}
</script>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .el-form.demo-table-expand.el-form--label-left.el-form--inline > div:nth-child(1) > label,
  .demo-table-expand.el-form--inline .el-form-item label.el-form-item__label {
    width: 90px;
    color: #99a9bf;
    font-size: 16px;
    font-weight: normal;
  }
</style>


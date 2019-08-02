<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item>
        <el-input v-model="queryParams.ids__list" placeholder="平台订单号/商户订单号（多个订单使用英文逗号隔开)" style="width:435px"></el-input>
      </el-form-item>
      <el-form-item label="日期选择">
        <el-date-picker v-model="queryParams.create_time__gte" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="" style="width:180px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.create_time__lte" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="" style="width:180px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="日期类型">
        <el-select v-model="queryParams.data_type" size="mini" style="width:120px">
          <el-option v-for="(value, key) in dataTypeMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="queryParams.status" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道回调状态">
        <el-select v-model="queryParams.way_callback" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in callbackStatusMap" :key="key" :label="value" :value="key" v-if="key!='null'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回调状态">
        <el-select v-model="queryParams.notify_merchant" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in callbackStatusMap" :key="key" :label="value" :value="key" v-if="key!='null'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转账渠道">
        <el-select v-model="queryParams.channel_code" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in channelStatusMap" :key="key" :label="value" :value="key" v-if="key!='null'">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="支付方式">
        <el-select v-model="queryParams.way_type" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="key" v-if="key!='null'">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleDownload" v-if="this.urls.includes('/order/draw/excel/')" :loading="downloadLoading">导出</el-button>
        <el-button type="warning" @click="handleCallbackBatch"  v-if="this.urls.includes('/order/draw/callback/')"  :loading="callbackLoading">批量回调</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
      <el-table-column type="selection" width="60" align="center" fixed>
      </el-table-column>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商户回调地址:">
            <span>{{ props.row.notify_url }}</span>
          </el-form-item>
          <el-form-item label="回调时间:">
            <span>{{ props.row.callback_time }}</span>
          </el-form-item>
          <el-form-item label="对方订单号:">
            <span>{{ props.row.order_no }}</span>
          </el-form-item>
          <el-form-item label="订单状态确认:">
            <span>{{ props.row.merchant_name }}</span>
          <el-button type="primary" size="mini" @click="handleCallbackBatch(props.row)" v-if="urls.includes('/order/draw/callback/') && props.row.notify_merchant !== 0">回调</el-button>
            <el-button type="primary" size="mini" @click.native="handleSucc(props.row)" v-if="urls.includes('/order/draw/to_success/') && (props.row.status === 1 || props.row.status === 2)">手工确认</el-button>
          </el-form-item>
          <el-form-item label="商户用户数据:">
            <span>{{ props.row.category }}</span>
          </el-form-item>
          <el-form-item label="支付通道用户数据:">
            <span>{{ props.row.address }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{scope.row.create_time}}
        </template>
      </el-table-column>
      <el-table-column label="支付时间" width="140" align="center">
        <template slot-scope="scope">
          {{scope.row.draw_time}}
        </template>
      </el-table-column>
      <el-table-column label="完成时间" width="140" align="center">
        <template slot-scope="scope">
          {{scope.row.finish_time}}
        </template>
      </el-table-column>
      <el-table-column label="平台订单号" width="160" align="center">
        <template slot-scope="scope">
          {{scope.row.order_no}}
        </template>
      </el-table-column>
      <el-table-column label="商户订单号" width="160" align="center">
        <template slot-scope="scope">
          {{scope.row.merchant_order_no}}
        </template>
      </el-table-column>
      <el-table-column label="商户名称" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.merchant_name}}
        </template>
      </el-table-column>
      <el-table-column label="转账渠道名" width="100" align="center">
        <template slot-scope="scope">
          {{channelStatusMap[scope.row.channel_code]}}
        </template>
      </el-table-column>
      <el-table-column label="通道类型" align="center">
        <template slot-scope="scope">
          {{channelMap[scope.row.way_type]}}
        </template>
      </el-table-column>
      <el-table-column label="商户转帐金额(元)" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.order_money !== null">{{$priceFormat(scope.row.order_money.toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际转帐金额(元)" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.order_real_money !== null">{{$priceFormat(scope.row.order_real_money.toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.draw_fee !== null">{{$priceFormat(scope.row.draw_fee.toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter"> {{statusMap[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="通道回调状态"  align="center" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.way_callback | callbackFilter"> {{callbackStatusMap[scope.row.way_callback]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="回调状态" align="center" width="100">
        <template slot-scope="scope">
          {{callbackStatusMap[scope.row.notify_merchant]}}
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px; display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[10,20,40]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="手工确认" :visible.sync="toSuccDialogShow" width="25%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="商户名称">
          <el-input v-model="form.merchant_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="渠道名称">
          <el-select v-model="form.channel_code" size="small" clearable placeholder="全部" disabled>
            <el-option v-for="(value, key) in channelStatusMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单金额" prop="order_money">
          <el-input v-model="form.order_money" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户实付金额" prop="real_money">
          <el-input v-model="form.real_money" placeholder="单位元"></el-input>
        </el-form-item>
        <el-form-item label="外部订单号" prop="out_order_no">
          <el-input v-model="form.out_order_no" placeholder="外部订单号"></el-input>
        </el-form-item>
        <el-form-item label="支付时间" prop="pay_time">
          <el-date-picker v-model="form.pay_time" type="datetime" :editable=false format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择支付时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付状态" prop="confirm_type">
          <el-select v-model="form.confirm_type" size="small" clearable placeholder="请选择支付状态">
            <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toSuccDialogShow = false">取 消</el-button>
        <el-button  type="primary" @click="doOrderSuccess" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listSelectChannel, listOrderDraw, orderRechargeExcel, drawOrderCallback, orderDrawToSuccess, orderRechargeQueryMore } from '@/api/service'
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
        limit: 10,
        ids__list: '',
        create_time__gte: parseTime(
          new Date().getTime(),
          '{y}-{m}-{d}'
        )+ ' 00:00:00',
        create_time__lte: parseTime(
          new Date().getTime(),
          '{y}-{m}-{d} {h}:{i}:{s}'
        ),
        status: '',
        data_type: '',
        notify_merchant: '',
        channel_code: '',
        way_type: ''
      },
      rules: {
        out_order_no: [
          { required: true, message: '外部订单号必填' },
          { validator: contaisTszf }
        ],
        pay_time: [
          { required: true, message: '支付时间必填' }
        ],
        confirm_type: [
          { required: true, message: '支付状态必填' }
        ],
        real_money: [
          { required: true, message: '实收金额必填' },
          { validator: isInteger }
        ]
      },
      statusMap: { '0': '支付成功', '1': '支付失败', '2': '待支付' },
      callbackStatusMap: { '0': '回调成功', '1': '回调失败', '2': '初始化'},
      confirmTypeMap: { '0': '系统确认', '1': '后台确认' },
      dataTypeMap: { '0': '创建时间', '1': '支付时间', '2': '完成时间' },
      channelStatusMap: {},
      channelMap: { 1: '支付宝', 2: '微信', 3: '银行卡', 4: '云闪付' },
      downloadLoading: false
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
    this.getChannelMap()
    this.fetchData()
  },
  methods: {
    getChannelMap() {
      listSelectChannel().then(res => {
        if (res.data.items) {
          res.data.items.map(e => {
            this.$set(this.channelStatusMap, e.channel_code, e.channel_name)
          })
        }
      })
    },
    fetchData() {
      this.listLoading = true
      listOrderDraw(this.queryParams).then(response => {
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
      this.form.channel_code = '' + this.form.channel_code
      if (this.form.confirm_type !== undefined)
        this.form.confirm_type = '' + this.form.confirm_type
      this.toSuccDialogShow = true
    },
    doOrderSuccess() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          this.form.isPay = 0;
          this.form.pay_time = this.form.pay_time.replace(/\-/g, '').replace(/\:/g, '').replace(' ', '');
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
            'merchant_order_no', 'merchant_name', 'channel_code', 'way_type', 'order_money',
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
        if (j === 'channel_code') {
          return this.channelStatusMap[v.channel_code]
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


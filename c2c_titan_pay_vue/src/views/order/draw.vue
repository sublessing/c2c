<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item>
        <el-input v-model="queryParams.ids__list" placeholder="平台订单号/商户订单号（多个订单使用英文逗号隔开)" style="width:435px"></el-input>
      </el-form-item>
      <el-form-item label="日期选择">
        <el-date-picker v-model="queryParams.create_time__gte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:140px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.create_time__lte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:140px">
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
        <el-select v-model="queryParams.channel_id" size="mini" clearable style="width:120px" placeholder="全部">
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
      <!-- <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row style="height: 35px; line-heigth:35px;">
            <el-col :span="10">商户回调地址：{{scope.row.notify_url}}</el-col>
            <el-col :span="7">回调时间：{{scope.row.callback_time}}</el-col>
            <el-col :span="7">订单状态确认：
              <span v-if="scope.row.confirm_type==0">自动</span>
              <span v-else>{{scope.row.oper_account}}</span>
              <el-button type="primary" size="mini" v-if="scope.row.status ==3" @click.native="handleSucc(scope.row)">支付完成</el-button>
              
              <el-button type="primary" size="mini" v-if="scope.row.status ==0" >手工回调</el-button>
             
            </el-col>
          </el-row>
          <el-row style="height: 35px; line-heigth:35px;">
            <el-col :span="10">支付宝订单号：{{scope.row.ali_order_no}}</el-col>
            <el-col :span="7">商户名称：{{scope.row.merchant_name}}</el-col>

          </el-row>
        </template>
      </el-table-column> -->
      
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
          <el-button type="primary" size="mini" @click="handleCallbackBatch(props.row)" v-if="urls.includes('/order/draw/callback/')">回调</el-button>
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
      <el-table-column label="平台订单号" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.order_no}}
        </template>
      </el-table-column>
      <el-table-column label="商户订单号" width="100" align="center">
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
          {{channelStatusMap[scope.row.channel_id]}}
        </template>
      </el-table-column>
      <el-table-column label="通道类型" align="center">
        <template slot-scope="scope">
          {{channelMap[scope.row.way_type]}}
        </template>
      </el-table-column>
      <el-table-column label="商户转帐金额(元)" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.order_money}}
        </template>
      </el-table-column>
      <el-table-column label="实际转帐金额(元)" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.order_real_money}}
        </template>
      </el-table-column>
      <el-table-column label="手续费" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.draw_fee}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter"> {{statusMap[scope.row.status]}}</el-tag>
          <!-- <el-button type="primary" size="mini" style="padding: 4px 6px;"  @click="queryMore(scope.row.recharge_id, scope.row.order_no)" :loading="queryMoreId==scope.row.recharge_id" >再次查询</el-button> -->
        </template>
      </el-table-column>
      <el-table-column label="通道回调状态"  align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.way_callback | callbackFilter"> {{callbackStatusMap[scope.row.way_callback]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="回调状态" align="center">
        <template slot-scope="scope">
          {{callbackStatusMap[scope.row.notify_merchant]}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button @click="handleCallbackBatch(scope.row)">回调</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px; display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[10,20,40]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="支付完成" :visible.sync="toSuccDialogShow" width="25%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="平台订单号">
          <el-input v-model="form.order_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付宝订单号" prop="ali_order_no">
          <el-input v-model="form.ali_order_no"></el-input>
        </el-form-item>
        <el-form-item label="支付时间" prop="draw_time">
          <el-date-picker v-model="form.draw_time" type="datetime" :editable=false format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实收金额" prop="agent_real_price">
          <el-input v-model="form.agent_real_price" placeholder="单位分"></el-input>
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
import { listOrderDraw, orderRechargeExcel, drawOrderCallback, orderRechargeToSuccess, orderRechargeQueryMore } from '@/api/service'
import { parseTime } from '@/utils/index'
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
          new Date('2019-05-29').getTime(),
          '{y}-{m}-{d}'
        ),
        create_time__lte: parseTime(
          new Date().getTime(),
          '{y}-{m}-{d}'
        ),
        status: '',
        data_type: '0',
        notify_merchant: '',
        channel_id: '0',
        way_type: '0'
      },
      rules: {
        ali_order_no: [
          { required: true, message: '支付宝订单号必填' },
          { validator: contaisTszf }
        ],
        draw_time: [
          { required: true, message: '支付时间必填' }
        ],
        agent_real_price: [
          { required: true, message: '实收金额必填' },
          { validator: isInteger }
        ]
      },
      statusMap: { '0': '支付成功', '1': '支付失败', '2': '待支付' },
      callbackStatusMap: { '0': '回调成功', '1': '回调失败', '2': '初始化'},
      confirmTypeMap: { '0': '系统确认', '1': '后台确认' },
      dataTypeMap: { '0': '创建时间', '1': '支付时间', '2': '完成时间' },
      channelStatusMap: { '0': 'C2C', '1': 'ALI-01', '2': '3RD-LUYU' },
      channelMap: { '0': '支付宝', '1': '微信', '2': '银行卡' },
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
    this.fetchData()
  },
  methods: {
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
      this.toSuccDialogShow = true
    },
    doOrderSuccess() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          orderRechargeToSuccess(this.form).then(response => {
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
          return this.channelStatusMap[v.channel_id]
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
          this.doCallback({ orderNo: this.multipleSelection[i].order_no, type: 1 })
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


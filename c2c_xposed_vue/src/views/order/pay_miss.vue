<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="日期选择">
        <el-date-picker v-model="queryParams.pay_time__gte" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" style="width:180px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.pay_time__lte" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" style="width:180px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="queryParams.way_type" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款账户">
        <el-select v-model="queryParams.res_id" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in resourceMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter()">搜 索</el-button>
        <!-- <el-button type="primary" @click="handleDownload()" v-if="this.urls.includes('/order/pay/excel/')" :loading="downloadLoading">导出</el-button>
        <el-button type="warning" @click="handleCallbackBatch()"  v-if="this.urls.includes('/order/pay/callback/')"  :loading="callbackLoading">批量回调</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange"  @cell-click="selectItem" border stripe fit highlight-current-row size="small">
      <el-table-column type="selection" width="60" align="center" fixed>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{scope.row.create_time}}
        </template>
      </el-table-column>
      <el-table-column label="支付时间" width="140" align="center">
        <template slot-scope="scope">
          {{scope.row.pay_time}}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          {{ channelMap[''+scope.row.way_type] }}
        </template>
      </el-table-column>
      <el-table-column label="收款账户" align="center">
        <template slot-scope="scope">
          {{resourceMap[''+scope.row.res_id]}}
        </template>
      </el-table-column>
      <el-table-column label="机器人ID" align="center">
        <template slot-scope="scope">
          {{scope.row.robot_no}}
        </template>
      </el-table-column>
      <el-table-column label="订单金额(元)" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.money !== null">{{$priceFormat(scope.row.money.toFixed(2))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center">
        <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.is_done == 0 ? 'danger' : 'success'">{{scope.row.is_done == 0 ? '未处理' : '已处理'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          {{scope.row.update_time}}
        </template>
      </el-table-column>
      <el-table-column label="平台订单号" align="center">
        <template slot-scope="scope">
          {{scope.row.order_no}}
        </template>
      </el-table-column>
      <el-table-column label="外部订单号" align="center">
        <template slot-scope="scope">
          {{scope.row.out_order_no}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleSucc(scope.row)" size="mini">确认</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px; display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[10,20,40]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="确认订单" :visible.sync="toSuccDialogShow" width="25%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="平台订单号" prop="out_order_no">
          <el-input v-model="form.order_no" placeholder="平台订单号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="支付时间" prop="pay_time">
          <el-date-picker v-model="form.pay_time" type="datetime" :editable="false" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择支付时间">
          </el-date-picker>
        </el-form-item> -->
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
import { listTpResourceApiSelectList, listOrderMiss, orderMissSucc } from '@/api/service'
export default {
    name: 'PayMiss',
    computed: {
        ...mapGetters([
        'urls'
        ])
    },
    data(){
        return {
            channelMap: { 1: '支付宝', 2: '微信', 3: '银行卡', 4: '云闪付' },
            resourceMap: {},
            list: null,
            total: null,
            listLoading: false,
            multipleSelection: [],
            queryParams: {
                page: 1,
                limit: 20,
            },
            toSuccDialogShow: false,
            submitting: false,
            form: {},
            rules: {
                order_no: [
                    {required: true, message: '平台订单号必填'}
                ]
            }
        }
    },
    created(){
        this.getResourceMap()
        this.fetchData()
    },
    methods: {
        handleSucc(row) {
            this.form = Object.assign({}, row)
            this.toSuccDialogShow = true
        },
        doOrderSuccess() {
        this.$refs.form.validate(valid => {
            if (valid) {
                this.submitting = true
                orderMissSucc(this.form).then(response => {
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
                .catch((err) => {
                    this.submitting = false
                })
            }
        })
        },
        getResourceMap () {
            listTpResourceApiSelectList().then(res => {
                res.data.items.map(el => {
                this.$set(this.resourceMap, ''+el.id, el.res_name);
                })
            }).catch(() => {})
        },
        handleFilter() {
            this.queryParams.page = 1
            this.fetchData()
        },
        fetchData() {
            this.listLoading = true
            listOrderMiss(this.queryParams).then(response => {
                this.list = response.data.items
                this.total = response.data.total
                this.listLoading = false
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        selectItem(row, column, cell, event) {
            if (column.type === 'selection' || column.property === 'merchant_id') {
                this.$refs.multipleTable.toggleRowSelection(row)
            }
        },
        handleSizeChange(val) {
            this.queryParams.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParams.page = val
            this.fetchData()
        },
    }
}
</script>

<style>

</style>

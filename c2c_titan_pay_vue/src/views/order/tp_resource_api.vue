<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="账户名称">
        <el-input v-model="queryParams.res_name__contains" size="mini" placeholder="账户名称"></el-input>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="queryParams.pay_way" size="mini" clearable style="width:180px" placeholder="全部" :loading="selectLoading">
          <el-option v-for="(value, key) in payWayMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="耗材状态">
        <el-select v-model="queryParams.status" size="mini" clearable style="width:180px" placeholder="全部" :loading="selectLoading">
          <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleCreate">新 增</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px;">
        <!-- <el-button type="primary" size="small" @click="handleMerchantBan(0)">批量启用</el-button> -->
        <el-button type="warning" size="small" @click="handleMerchantBan(1)">批量禁用</el-button>
    </el-row>
    <el-table  
        :cell-style="cellStyle"
        :data="list" 
        v-loading.body="listLoading" 
        element-loading-text="拼命加载中" 
        @selection-change="handleSelectionChange"  
        border 
        stripe 
        fit 
        highlight-current-row 
        size="small">
      <el-table-column type="selection" width="60" align="center" fixed>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商户ID:">
                    <span>{{ props.row.res_out_id }}</span>
                </el-form-item>
                <el-form-item label="KEY 秘钥:" v-if="urls.includes('/order/tp_resource_api/allow/')">
                    <span>{{ props.row.res_out_key }}</span>
                </el-form-item>
                <el-form-item label="appid(仅微信需要):" v-if="urls.includes('/order/tp_resource_api/allow/')">
                    <span>{{ props.row.res_out_appid }}</span>
                </el-form-item>
            </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="账户ID" align="center" width="60px"></el-table-column>
      <el-table-column prop="res_name" label="账户名称" align="center"></el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          {{ payWayMap[''+scope.row.pay_way] }}
        </template>
      </el-table-column>
      <el-table-column label="交易额" align="center">
        <template slot-scope="scope">
          {{$priceFormat((scope.row.max_money?scope.row.max_money:0).toFixed(2))}}(已用<span :class="scope.row.max_money <= scope.row.today_money?'red':''">{{$priceFormat((scope.row.today_money?scope.row.today_money:0).toFixed(2))}}</span>)
        </template>
      </el-table-column>
      <el-table-column label="成本费率" align="center">
        <template slot-scope="scope">
          {{scope.row.cost_rate}}%
        </template>
      </el-table-column>
      <el-table-column prop="risk_day" label="结算账期" align="center">
        <template slot-scope="scope">
          T+{{scope.row.risk_day}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="耗材状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.max_money <= scope.row.today_money" size="mini" type="danger">已达限额</el-tag>
          <el-tag v-else size="mini" :type="scope.row.status | statusFilter"> {{ statusMap[''+scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center" width="100">
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" align="center">
      </el-table-column>
      <el-table-column prop="reload_time" label="重载时间" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleMerchantBan(0, scope.row)" size="mini">启用资源</el-button>
          <el-button type="warning" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click.native="deleteMerchantBan(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="130px">
        <el-form-item label="企业账户名称" prop="res_name">
          <el-input v-if="dialogStatus=='create'" v-model="form.res_name" placeholder="2-8中文字符" ></el-input>
          <el-input v-else v-model="form.res_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="pay_way">
            <el-select v-model="form.pay_way" size="small" placeholder="请选择支付方式">
            <el-option v-for="(value, key) in payWayMap" :key="key" :label="value" :value="key">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="企业账户ID" prop="res_out_id">
          <el-input v-model="form.res_out_id" placeholder="商户ID" ></el-input>
        </el-form-item>
        <el-form-item label="KEY 秘钥" prop="res_out_key">
          <el-input v-model="form.res_out_key" placeholder="KEY 秘钥" ></el-input>
        </el-form-item>
        <el-form-item label="appid(微信需要)" prop="res_out_appid" :required="form.pay_way == 2">
          <el-input v-model="form.res_out_appid" placeholder="appid(仅微信需要)" ></el-input>
        </el-form-item>
        <el-form-item label="交易限额" prop="max_money">
          <el-input v-model="form.max_money" placeholder="请输入交易限额"></el-input>
        </el-form-item>
        <el-form-item label="成本费率" prop="cost_rate">
          <el-input v-model="form.cost_rate" max="100" min="0" placeholder="请输入成本费率">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="结算账期" prop="risk_day">
          <el-input v-model="form.risk_day" placeholder="请输入结算账期"></el-input>
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
import { listTpResourceApiList, addTpResourceApiList, editTpResourceApiList, statusTpResourceApiList, deleteTpResourceApiList } from '@/api/service'
export default {
    name: 'Channel',
    data(){
        var rateRule = (rule, value, callback) => {
          if (value > 100 || value < 0) {
            callback(new Error('费率范围只能在0~100之间'));
          } if (isNaN(Number(value))) {
            callback(new Error('请输入正确的数值'));
          } else {
            callback();
          }
        };
        var appIDRule = (rule, value, callback) => {
          if (this.form.pay_way == 2) {
            if (value == "" || value == null) {
              callback(new Error('请输入appid'));
            } else {
              callback();
            }
          } else {
            callback();
          }
        };
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
        const isInteger2 = (rule, value, callback) => {
          if (value !== undefined && value !== '') {
            if (/^\-(.*)/.test(value)) {
              callback(new Error('请填写正数'))
            } else if (isNaN(Number(value))) {
              callback(new Error('请填正确数值'))
            } else{
              callback()
            }
          } else {
            callback()
          }
        }
        return {
            list: [],
            total: null,
            listLoading: false,
            queryParams: {
                page: 1,
                limit: 10
            },
            selectLoading: false,
            multipleSelection:[],
            form: {},
            submitting: false,
            dialogStatus: '',
            createVisible: false,
            channelMap:{'0':'自有渠道', '1': '第三方渠道'},
            payWayMap: {'1':'支付宝', '2': '微信', '3':'银行卡', '4': '云闪付'},
            statusMap:{'0':'启用', '1': '禁用'},
            titleMap: {'create': '添加账户', 'update': '修改账户'},
            rules: {
                res_name:[
                    {required: true, message: '请输入企业账户名称', trigger: 'blur'}
                ],
                res_out_id:[
                    {required: true, message: '请输入企业账户ID', trigger: 'blur'}
                ],
                pay_way:[
                  {required: true, message: '请选择支付方式', trigger: 'change'}
                ],
                res_out_appid :[
                    {validator: appIDRule, trigger: 'blur'}
                ],
                res_name:[
                    {required: true, message: '请输入商户ID', trigger: 'blur'}
                ],
                res_out_key:[
                    {required: true, message: '请输入KEY秘钥', trigger: 'blur'}
                ],
                max_money:[
                    {required: true, message: '请输入交易限额', trigger: 'blur'},
                    {validator: isInteger}
                ],
                cost_rate:[
                    {required: true, message: '请输入成本费率', trigger: 'blur'},
                    {validator: rateRule}
                ],
                risk_day:[
                    {required: true, message: '请输入结算账期', trigger: 'blur'},
                    {validator: isInteger2}
                ],
                status:[
                    {required: true, message: '请选择渠道状态', trigger: 'change'}
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'urls'
        ])
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
        handleSizeChange(val) {
            this.queryParams.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParams.page = val
            this.fetchData()
        },
        handleFilter(){
            this.queryParams.page = 1
            this.fetchData()
        },
        handleCreate() {
            this.form = {}
            this.dialogStatus = 'create'
            this.createVisible = true
        },
        handleUpdate(row) {
            this.form = Object.assign({}, row)
            this.form.status = '' + this.form.status
            this.form.pay_way = '' + this.form.pay_way
            this.dialogStatus = 'update'
            this.createVisible = true
        },
        doCreate(){
            this.$refs.form.validate(validate => {
                if(!validate) return;
                this.submitting = true
                addTpResourceApiList(this.form).then(response => {
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
                editTpResourceApiList(this.form).then(response => {
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
        handleMerchantBan(st, item) { // st = 0 表示要启用
            if (item) this.multipleSelection.push(item)
            if (this.multipleSelection.length === 0) {
                this.$notify({
                    title: '操作提示',
                    message: '请先选择要修改的选项',
                    type: 'info',
                    duration: 1000
                })
                return
            }
            const cmsg = st === 0 ? '启用耗材资源，请确认！' : '批量停用耗材资源，请确认！'
            this.$confirm(cmsg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    this.doBan({ id: this.multipleSelection[i].id, status: st }, st)
                }
                this.multipleSelection = [];
                this.handleFilter()
            }).catch(() => {
              this.multipleSelection = [];
            })
        },
        doBan(data, st) {
            statusTpResourceApiList(data).then(response => {
                if (response.code === 0) {
                  this.$notify({
                      title: '成功',
                      message: st === 0 ? '启用成功' : '停用成功',
                      type: 'success',
                      duration: 2000
                  })
                } else {
                  this.$notify({
                      title: '失败',
                      message: response.msg,
                      type: 'error',
                      duration: 0
                  })
                }
                this.handleFilter()
            })
        },
        deleteMerchantBan(item) { 
            const cmsg = '即将删除支付耗材『 '+item.res_name+' 』,请确认!'
            this.$confirm(cmsg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              deleteTpResourceApiList({delete_id: item.id}).then(response => {
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
        fetchData(){
            this.listLoading = true
            listTpResourceApiList(this.queryParams).then(response => {
                this.list = response.data.items
                this.total = response.data.total
                this.listLoading = false
            })
        }
    }
}
</script>

<style scoped>
  .red{color: red}
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  }
</style>

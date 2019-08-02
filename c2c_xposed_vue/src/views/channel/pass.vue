<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="渠道类型">
        <el-select v-model="queryParams.channel_type" size="mini" clearable style="width:120px" placeholder="全部" @change="channelTypeChange">
          <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属渠道">
        <!-- <el-input v-model="queryParams.way_name" placeholder="请输入渠道名称"></el-input> -->
        <el-select v-model="queryParams.channel_id" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in nameMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道名称">
        <el-input v-model="queryParams.way_name" placeholder="请输入通道名称"></el-input>
      </el-form-item>
      <el-form-item label="通道类别">
        <el-select v-model="queryParams.is_pay" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="queryParams.way_type" size="mini" clearable style="width:120px" placeholder="全部">
          <el-option v-for="(value, key) in payWayMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleCreate">新 增</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px;">
        <el-button type="primary" size="small" @click="handleMerchantBan(0)">批量启用通道</el-button>
        <el-button type="warning" size="small" @click="handleMerchantBan(1)">批量禁用通道</el-button>
    </el-row>
    <el-table 
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
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="适配器地址:">
                    <span>{{ props.row.adapter }}</span>
                </el-form-item>
                <el-form-item label="充值TOKEN:">
                    <span>{{ props.row.pay_key }}</span>
                </el-form-item>
                <el-form-item label="转账TOKEN:">
                    <span>{{ props.row.draw_key }}</span>
                </el-form-item>
                <el-form-item label="渠道服务器地址:">
                    <span>{{ props.row.allow_ip }}</span>
                </el-form-item>
            </el-form>
        </template>
      </el-table-column> -->
      <el-table-column prop="id" label="通道ID" align="center"></el-table-column>
      <el-table-column label="渠道类型" align="center">
        <template slot-scope="scope">
          {{channelMap[scope.row.channel_type]}}
        </template>
      </el-table-column>
      <el-table-column label="所属渠道" align="center">
        <template slot-scope="scope">
          {{nameMap[scope.row.channel_id]}}
        </template>
      </el-table-column>
      <el-table-column prop="way_name" label="通道名称" align="center"></el-table-column>
      <el-table-column label="通道类别" align="center">
        <template slot-scope="scope">
          {{payMap[scope.row.is_pay]}}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          {{payWayMap[scope.row.way_type]}}
        </template>
      </el-table-column>
      <el-table-column label="交易额" align="center">
        <template slot-scope="scope">
          {{scope.row.max_money}}(已用<span :class="scope.row.max_money == scope.row.money?'red':''">{{scope.row.money}}</span>)
        </template>
      </el-table-column>
      <el-table-column label="费率" align="center">
        <template slot-scope="scope">
          {{scope.row.way_rate}}%
        </template>
      </el-table-column>
      <el-table-column prop="weight.way_weight" label="权重" align="center"></el-table-column>
      <el-table-column prop="status" label="通道状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter"> {{ statusMap[''+scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center" width="100">
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" align="center" width="140">
      </el-table-column>
      <el-table-column prop="reload_time" label="重载时间" align="center" width="140">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click.native="deleteChannelWayBan(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="渠道类型" prop="channel_type" v-if="dialogStatus=='create'">
            <el-select v-model="form.channel_type" clearable placeholder="全部" @change="channelTypeChange">
                <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="key">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所属渠道" prop="channel_id">
            <el-select v-if="dialogStatus=='create'" v-model="form.channel_id" clearable placeholder="全部" :loading="nameLoading">
                <el-option v-for="(value, key) in nameMap" :key="key" :label="value" :value="key">
                </el-option>
            </el-select>
            <el-select v-else v-model="form.channel_id" disabled placeholder="全部">
                <el-option v-for="(value, key) in nameMap" :key="key" :label="value" :value="key">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="通道名称">
          <el-input v-model="form.way_name" placeholder="请输入通道名称"></el-input>
        </el-form-item>
        <el-form-item label="通道CODE" prop="way_code" v-if="dialogStatus=='create'">
          <el-input v-model="form.way_code" placeholder="请输入通道CODE"></el-input>
        </el-form-item>
        <el-form-item label="通道类别" prop="is_pay">
            <el-select v-model="form.is_pay" clearable placeholder="请选择通道类别">
                <el-option v-for="(value, key) in payMap" :key="key" :label="value" :value="key">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="way_type">
            <el-select v-model="form.way_type" clearable placeholder="请选择支付方式">
                <el-option v-for="(value, key) in payWayMap" :key="key" :label="value" :value="key">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="交易限额" prop="max_money">
          <el-input v-model="form.max_money" placeholder="请输入交易限额">
          </el-input>
        </el-form-item>
        <el-form-item label="费率" prop="way_rate">
          <el-input v-model="form.way_rate" placeholder="请输入费率">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="权重系数" prop='way_weight'>
          <el-input v-model="form.way_weight" placeholder="请输入权重系数"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-select v-model="form.status">
            <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
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
import { listSelectChannel, listWay, addWay, editWay, deleteWay, editWayStatus } from '@/api/service'
export default {
    name: 'Channel',
    data(){
        var rateRule = (rule, value, callback) => {
          if (value > 100 || value < 0) {
            callback(new Error('费率范围只能在0~100之间'));
          } else {
            callback();
          }
        };
        var weightRule = (rule, value, callback) => {
          if (value > 100 || value < 0) {
            callback(new Error('权重范围只能在0~100之间'));
          } else {
            callback();
          }
        };
        return {
            list: [],
            total: null,
            listLoading: false,
            queryParams: {
                page: 1,
                limit: 20
            },
            multipleSelection:[],
            form: {},
            submitting: false,
            dialogStatus: '',
            createVisible: false,
            nameLoading: false,
            nameMap: {},
            channelMap:{'0':'自有渠道', '1': '第三方渠道'},
            payMap: {'1':'充值', '0': '提现'},
            payWayMap: { 1: '支付宝', 2: '微信', 3: '银行卡', 4: '云闪付' },
            statusMap:{'0':'启用', '1': '禁用'},
            titleMap: {'create': '添加渠道', 'update': '修改渠道'},
            rules: {
                channel_type:[
                    {required: true, message: '请选择渠道类型', trigger: 'change'}
                ],
                channel_id:[
                    {required: true, message: '请选择所属渠道', trigger: 'change'}
                ],
                is_pay:[
                    {required: true, message: '请选择通道类别', trigger: 'change'}
                ],
                way_type:[
                    {required: true, message: '请选择支付方式', trigger: 'change'}
                ],
                max_money:[
                    {required: true, message: '请输入交易限额', trigger: 'blur'}
                ],
                way_rate:[
                    {required: true, message: '请输入费率', trigger: 'blur'},
                    {validator: rateRule, trigger: 'blur'}
                ],
                way_weight:[
                  {required: true, message: '请输入权重系数', trigger: 'blur'},
                  {validator: weightRule, trigger: 'blur'}
                ],
                status:[
                    {required: true, message: '请选择通道状态', trigger: 'change'}
                ],
                way_code:[
                    {required: true, message: '请输入通道CODE', trigger: 'blur'}
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
        this.getMapList()
        this.fetchData()
    },
    methods: {
        channelTypeChange(val) {
            this.getMapList({channel_type: val})
        },
        getMapList(params = {}) {
            this.nameLoading = true;
            listSelectChannel(params).then(response => {
                this.nameMap = {}
                response.data.items.map(e => {
                    this.nameMap[''+e.id] = e.channel_name
                })
                this.nameLoading = false;
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
            this.form.channel_id = '' + this.form.channel_id
            this.form.is_pay = '' + this.form.is_pay
            this.form.way_type = '' + this.form.way_type
            this.form.way_weight = '' + this.form.weight.way_weight
            this.dialogStatus = 'update'
            this.createVisible = true
        },
        doCreate(){
            this.$refs.form.validate(validate => {
                if(!validate) return;
                this.submitting = true
                addWay(this.form).then(response => {
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
                editWay(this.form).then(response => {
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
            editWayStatus(data).then(response => {
                this.$notify({
                    title: '成功',
                    message: st === 0 ? '启用成功' : '停用成功',
                    type: 'success',
                    duration: 2000
                })
                this.handleFilter()
            })
        },
        deleteChannelWayBan(item) { 
          const cmsg = '即将删除通道『 '+item.way_name+' 』,请确认!'
          this.$confirm(cmsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            deleteWay({delete_id: item.id}).then(response => {
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
            listWay(this.queryParams).then(response => {
                this.list = response.data.items
                this.total = response.data.total
                this.listLoading = false
            })
        }
    }
}
</script>

<style scoped>

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 20%;
  }
.red{color: red}
</style>

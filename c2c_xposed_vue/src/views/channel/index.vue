<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="渠道类型">
        <el-select v-model="queryParams.channel_type" size="mini" clearable style="width:180px" placeholder="全部" @change="selectTypeChange">
          <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道名称">
        <el-select v-model="queryParams.channel_name" size="mini" clearable style="width:180px" placeholder="全部" :loading="selectLoading">
          <el-option v-for="(value, key) in nameMap" :key="key" :label="value" :value="value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleCreate">新 增</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px;">
        <el-button type="primary" size="small" @click="handleMerchantBan(0)">批量启用渠道</el-button>
        <el-button type="warning" size="small" @click="handleMerchantBan(1)">批量禁用渠道</el-button>
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
      <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="适配器地址:">
                    <span>{{ props.row.adapter }}</span>
                </el-form-item>
                <!-- <el-form-item label="渠道分配商户ID:">
                    <span>{{ props.row.allow_ip }}</span>
                </el-form-item> -->
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
      </el-table-column>
      <el-table-column label="渠道类型" align="center">
        <template slot-scope="scope">
          {{channelMap[scope.row.channel_type]}}
        </template>
      </el-table-column>
      <el-table-column prop="channel_name" label="渠道名称" align="center"></el-table-column>
      <el-table-column label="今日充值额" align="center">
        <template slot-scope="scope">
          {{scope.row.pay_max}}(已用<span :class="scope.row.pay_max == scope.row.pay_today?'red':''">{{scope.row.pay_today}}</span>)
        </template>
      </el-table-column>
      <el-table-column label="今日转账额" align="center">
        <template slot-scope="scope">
          {{scope.row.draw_max}}(已用<span :class="scope.row.draw_max == scope.row.draw_today?'red':''">{{scope.row.draw_today}}</span>)
        </template>
      </el-table-column>
      <el-table-column label="今日收支差" align="center">
        <template slot-scope="scope">
          {{scope.row.diff_max}}(已用<span :class="scope.row.diff_max == (scope.row.pay_today-scope.row.draw_today)?'red':''">{{(scope.row.pay_today-scope.row.draw_today)}}</span>)
        </template>
      </el-table-column>
      <el-table-column prop="status" label="渠道状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter"> {{ statusMap[''+scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pay_status" label="充值渠道状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.pay_status | statusFilter"> {{ statusMap[''+scope.row.pay_status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="draw_status" label="转账渠道状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.draw_status | statusFilter"> {{ statusMap[''+scope.row.draw_status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center" width="100">
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" align="center">
      </el-table-column>
      <el-table-column prop="reload_time" label="重载时间" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click.native="deleteChannelBan(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="渠道名称" prop="channel_name" size="small">
          <el-input v-if="dialogStatus=='create'" v-model="form.channel_name" placeholder="2-8中文字符" ></el-input>
          <el-input v-else v-model="form.channel_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="渠道类型" prop="channel_type" size="small">
            <el-select v-model="form.channel_type" clearable placeholder="请选择渠道类型">
              <el-option v-for="(value, key) in channelMap" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="渠道代码" prop="channel_code" v-if="dialogStatus =='create'" size="small">
          <el-input v-model="form.channel_code" placeholder="请输入渠道代码"></el-input>
        </el-form-item>
        <el-form-item label="渠道分配商户ID" prop="code_from_channel" size="small">
          <el-input v-model="form.code_from_channel" placeholder="请输入渠道代码"></el-input>
        </el-form-item>
        <el-form-item label="最高允许收支差" prop="diff_max" size="small">
          <el-input v-model="form.diff_max" placeholder="请输入收支差"></el-input>
        </el-form-item>
        <el-form-item label="当日充值限额" prop="pay_max" size="small">
          <el-input v-model="form.pay_max" placeholder="请输入当日充值限额"></el-input>
        </el-form-item>
        <el-form-item label="当日转账限额" prop="draw_max" size="small">
          <el-input v-model="form.draw_max" placeholder="请输入当日转账限额"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop='status' size="small">
          <el-select v-model="form.status">
            <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值渠道状态" prop='pay_status' size="small">
          <el-select v-model="form.pay_status">
            <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转账渠道状态" prop='draw_status' size="small">
          <el-select v-model="form.draw_status">
            <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适配器地址" prop='adapter' size="small">
          <el-input v-model="form.adapter" placeholder="请输入适配器地址"></el-input>
        </el-form-item>
        <!-- <el-form-item label="渠道分配商户ID" size="small">
          <el-input v-model="form.adapter" placeholder="请输入渠道分配商户ID"></el-input>
        </el-form-item> -->
        <el-form-item label="充值token" size="small">
          <el-input v-model="form.pay_key" placeholder="请输入token"></el-input>
        </el-form-item>
        <el-form-item label="提现token" size="small">
          <el-input v-model="form.draw_key" placeholder="请输入token"></el-input>
        </el-form-item>
        <el-form-item label="渠道服务器地址" prop='allow_ip' size="small">
          <el-input v-model="form.allow_ip" placeholder="请输入渠道服务器IP"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false" size="small">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="doCreate" :loading="submitting" size="small">确 定</el-button>
        <el-button v-else type="primary" @click="doUpdate" :loading="submitting" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listChannel, addChannel, editChannel, deleteChannel, editChannelStatus, listSelectChannel } from '@/api/service'
export default {
    name: 'Channel',
    data(){
        return {
            list: [],
            total: null,
            listLoading: false,
            queryParams: {
                page: 1,
                limit: 20
            },
            selectLoading: false,
            multipleSelection:[],
            form: {},
            submitting: false,
            dialogStatus: '',
            createVisible: false,
            nameMap: {},
            channelMap:{'0':'自有渠道', '1': '第三方渠道'},
            statusMap:{'0':'启用', '1': '禁用'},
            titleMap: {'create': '添加渠道', 'update': '修改渠道'},
            rules: {
                channel_name:[
                    {required: true, message: '请输入渠道名称', trigger: 'blur'}
                ],
                channel_type:[
                    {required: true, message: '请选择渠道类型', trigger: 'change'}
                ],
                channel_code:[
                    {required: true, message: '请选择渠道代码', trigger: 'blur'}
                ],
                code_from_channel:[
                    {required: true, message: '请选择渠道分配商户ID', trigger: 'blur'}
                ],
                diff_max:[
                    {required: true, message: '请输入最高收支差', trigger: 'blur'}
                ],
                pay_max:[
                    {required: true, message: '请输入当日充值限额', trigger: 'blur'}
                ],
                draw_max:[
                    {required: true, message: '请输入当日转账限额', trigger: 'blur'}
                ],
                status:[
                    {required: true, message: '请选择渠道状态', trigger: 'change'}
                ],
                pay_status:[
                    {required: true, message: '请选择充值渠道状态', trigger: 'change'}
                ],
                draw_status:[
                    {required: true, message: '请选择转账渠道状态', trigger: 'change'}
                ],
                adapter:[
                    {required: true, message: '请输入适配器地址', trigger: 'blur'}
                ],
                pay_key:[
                    {required: true, message: '请输入充值token', trigger: 'blur'}
                ],
                draw_key:[
                    {required: true, message: '请输入提现token', trigger: 'blur'}
                ],
                allow_ip: [
                    {required: true, message: '请输入渠道服务器地址', trigger: 'blur'}
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
        selectTypeChange(val){
            this.getMapList({channel_type: val})
        },
        getMapList(data = {}) {
            this.selectLoading = true
            listSelectChannel(data).then(response => {
                this.nameMap = {}
                response.data.items.map(e => {
                    this.nameMap[''+e.id] = e.channel_name
                })
                this.selectLoading = false
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
            this.form.pay_status = '' + this.form.pay_status
            this.form.draw_status = '' + this.form.draw_status
            this.form.channel_type = '' + this.form.channel_type
            this.dialogStatus = 'update'
            this.createVisible = true
        },
        doCreate(){
            this.$refs.form.validate(validate => {
                if(!validate) return;
                this.submitting = true
                addChannel(this.form).then(response => {
                    this.createVisible = false
                    this.$notify({
                        title: response.code === 0 ? '添加成功' : '操作失败',
                        message: response.msg,
                        type: response.code === 0 ? 'success' : 'error',
                        duration: response.code === 0 ? 2000 : 0
                    })
                    this.submitting = false
                    this.getMapList()
                    this.handleFilter()
                })
            })
        },
        doUpdate(){
            this.$refs.form.validate(valid => {
                if (!valid) return;
                this.submitting = true
                editChannel(this.form).then(response => {
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
            editChannelStatus(data).then(response => {
                this.$notify({
                    title: '成功',
                    message: st === 0 ? '启用成功' : '停用成功',
                    type: 'success',
                    duration: 2000
                })
                this.handleFilter()
            })
        },
        deleteChannelBan(item) { 
          const cmsg = '即将删除渠道『 '+item.channel_name+' 』,请确认!'
          this.$confirm(cmsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            deleteChannel({delete_id: item.id}).then(response => {
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
            listChannel(this.queryParams).then(response => {
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

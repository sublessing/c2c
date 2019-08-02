<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="账号名称">
        <el-input v-model="queryParams.res_name__contains" size="mini" placeholder="账号名称"></el-input>
      </el-form-item>
      <el-form-item label="账号类型">
        <el-select v-model="queryParams.way_type" size="mini" clearable style="width:180px" placeholder="全部" :loading="selectLoading">
          <el-option v-for="(value, key) in payWayMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理名称">
        <el-select v-model="queryParams.agent_id" size="mini" clearable style="width:180px" placeholder="全部" :loading="selectLoading">
          <el-option v-for="(value, key) in agentMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号状态">
        <el-select v-model="queryParams.is_ban" size="mini" clearable style="width:180px" placeholder="全部" :loading="selectLoading">
          <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登陆状态">
        <el-select v-model="queryParams.is_login" size="mini" clearable style="width:180px" placeholder="全部" :loading="selectLoading">
          <el-option label="未登录" value="0">
          </el-option>
          <el-option label="已登录" value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密保手机">
        <el-input v-model="queryParams.phone" size="mini" clearable style="width:180px" placeholder="密保手机"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" @click="handleCreate" v-if="roleIds.includes(3)">新 增</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px;">
        <el-button type="primary" size="small" @click="handleMerchantBan(0)">批量启用</el-button>
        <el-button type="warning" size="small" @click="handleMerchantBan(1)">批量禁用</el-button>
        <el-button type="primary" size="small" @click="handleUpdateMaxMoney()">批量修改充值限额</el-button>
        <el-button type="warning" size="small" @click="updateFailedCount()">批量清理失败次数</el-button>
    </el-row>
    <el-table 
        :cell-style="cellStyle"
        :data="list" 
        v-loading.body="listLoading" 
        element-loading-text="拼命加载中" 
        @selection-change="handleSelectionChange"  
        border 
        fit 
        highlight-current-row 
        size="small">
      <el-table-column type="selection" width="60" align="center" fixed>
      </el-table-column>
      <el-table-column prop="id" label="ID" align="center" width="60px"></el-table-column>
      <el-table-column prop="res_name" label="账号名称" width="100px" align="center"></el-table-column>
      <el-table-column prop="robot_no" label="机器人ID" width="100px" align="center"></el-table-column>
      <el-table-column label="代理名称" align="center">
        <template slot-scope="scope">
          {{ agentMap[''+scope.row.agent_id] }}
        </template>
      </el-table-column>
      <el-table-column label="账号类型" align="center">
        <template slot-scope="scope">
          {{ payWayMap[''+scope.row.way_type] }}
        </template>
      </el-table-column>
      <el-table-column prop="login_name" label="登陆名" width="100" align="center"></el-table-column>
      <el-table-column prop="login_password" label="登陆密码" width="120px" align="center"></el-table-column>
      <el-table-column prop="phone" label="密保手机" width="100" align="center"></el-table-column>
      <el-table-column prop="qr" label="二维码链接" width="200" align="center"></el-table-column>
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
      <el-table-column prop="fail_count" label="连续失败次数" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.way_type == 4">-</span>
          <span v-else>{{ scope.row.fail_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登陆状态" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.is_login | loginFilter"> {{ scope.row.is_login == 0 ? '未登录' : '已登陆' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" width="140" align="center">
      </el-table-column>
      <el-table-column prop="reload_time" label="重载时间" width="140" align="center">
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click.native="deleteMerchantBan(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" @click.native="addCache(scope.row)" size="mini">使用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="130px">
        <el-form-item label="账号名称" prop="res_name">
          <el-input v-if="dialogStatus=='create'" v-model="form.res_name" placeholder="2-8中文字符" ></el-input>
          <el-input v-else v-model="form.res_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="账号类型" prop="way_type">
            <el-select v-if="dialogStatus=='create'" v-model="form.way_type" size="small" placeholder="请选择账号类型">
              <el-option v-for="(value, key) in payWayMap" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
            <el-select v-else v-model="form.way_type" size="small" placeholder="请选择账号类型" disabled>
              <el-option v-for="(value, key) in payWayMap" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="登陆名" prop="login_name">
          <el-input v-if="dialogStatus=='create'" v-model="form.login_name" placeholder="登陆名" ></el-input>
          <el-input v-else v-model="form.login_name" placeholder="登陆名" disabled></el-input>
        </el-form-item>
        <el-form-item label="登陆密码" prop="login_password">
          <el-input v-model="form.login_password" placeholder="登陆密码" ></el-input>
        </el-form-item>
        <el-form-item label="密保手机" prop="phone">
          <el-input v-if="dialogStatus=='create'" v-model="form.phone" placeholder="密保手机" ></el-input>
          <el-input v-else v-model="form.phone" placeholder="密保手机" disabled></el-input>
        </el-form-item>
        <el-form-item label="二维码链接">
          <el-input v-model="form.qr" placeholder="二维码链接" ></el-input>
        </el-form-item>
        <el-form-item label="每日充值限额" prop="max_money" v-if="dialogStatus=='create'">
          <el-input v-model="form.max_money" placeholder="每日充值限额" ></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop='is_ban' v-if="dialogStatus=='create'">
          <el-select v-model="form.is_ban" size="small">
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
    
    <el-dialog title="删除资源" :visible.sync="delDialog" width="30%" v-draggable>
      <el-form class="small-space" :model="delForm" ref="form" label-position="left" label-width="130px">
        <el-form-item label="理由">
          <el-input v-model="delForm.memo" placeholder="请输入理由"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delBan" :loading="delSubmitting">确 定</el-button>
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
import { listTpResourceApiList, addTpResourceApiList, editTpResourceApiList, updateResourceMaxMoney, updateResourceFailedCount, statusTpResourceApiList, deleteTpResourceApiList, statusResourceCache } from '@/api/service'
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
          if (this.form.way_type == 2) {
            if (value == "" || value == null) {
              callback(new Error('请输入appid'));
            } else {
              callback();
            }
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
            selectLoading: false,
            multipleSelection:[],
            form: {},
            delForm: {},
            moneyForm: {},
            delDialog: false,
            submitting: false,
            delSubmitting: false,
            moneyDialog: false,
            moneySubmitting: false,
            dialogStatus: '',
            createVisible: false,
            channelMap:{'0':'自有渠道', '1': '第三方渠道'},
            payWayMap: {'1':'支付宝', '2': '微信', '3':'银行卡', '4': '云闪付'},
            WayMap: {'0':'转账', '1': '充值'},
            statusMap:{'0':'启用', '1': '禁用'},
            titleMap: {'create': '添加账户', 'update': '修改账户'},
            rules: {
                res_name:[
                    {required: true, message: '请输入账户名称', trigger: 'blur'}
                ],
                robot_no:[
                    {required: true, message: '请输入机器人ID', trigger: 'blur'}
                ],
                way_type:[
                  {required: true, message: '请选择账号类型', trigger: 'change'}
                ],
                login_name:[
                  {required: true, message: '请输入登录名', trigger: 'blur'}
                ],
                login_password:[
                    {required: true, message: '请输入登录密码', trigger: 'blur'}
                ],
                phone:[
                    {required: true, message: '请输入密保手机', trigger: 'blur'}
                ],
                max_money:[
                    {required: true, message: '请输入每日充值限额', trigger: 'blur'}
                ],
                is_ban:[
                    {required: true, message: '请选择状态', trigger: 'change'}
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
          'roleIds',
          'urls',
          'agentMap'
        ])
    },
    filters: {
      statusFilter(status) {
        const map = { '0': 'success', '1': 'danger', '2': 'warning' }
        return map[status]
      },
      loginFilter(status) {
        const map = { '1': 'success', '0': 'danger' }
        return map[status]
      },
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
            this.form.is_ban = '' + this.form.is_ban
            this.form.way_type = '' + this.form.way_type
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
            statusTpResourceApiList(data).then(response => {
                this.$notify({
                    title: '成功',
                    message: st === 0 ? '启用成功' : '停用成功',
                    type: 'success',
                    duration: 2000
                })
                this.handleFilter()
            })
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
        moneyBan () {
          this.moneySubmitting = true;
          for (let i = 0; i < this.multipleSelection.length; i++) {
              updateResourceMaxMoney({ id: this.multipleSelection[i].id, max_money: this.moneyForm.max_money }).then(response => {
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
        deleteMerchantBan(item) { 
          this.delForm = {};
          this.delForm.id = item.id;
          this.delDialog = true;
        },
        delBan () {
          this.delSubmitting = true;
          deleteTpResourceApiList(this.delForm).then(response => {
              this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
              })
              this.delSubmitting = false;
              this.delDialog = false;
              this.handleFilter()
          })
          .catch(() => {
              this.delSubmitting = false;
              this.delDialog = false;
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
        },
        addCache(item) { 
          const cmsg = '即将添加资源『 '+item.res_name+' 』到缓存,请确认!'
          this.$confirm(cmsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            statusResourceCache({id: item.id}).then(response => {
                this.$notify({
                    title: '成功',
                    message: '操作成功',
                    type: 'success',
                    duration: 2000
                })
                this.handleFilter()
            })
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
              updateResourceFailedCount({id: this.multipleSelection[i].id}).then(response => {
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
</style>

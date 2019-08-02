<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" size="small">
      <el-form-item label="用户名">
        <el-input v-model="queryParams.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" size="small" clearable>
          <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
        <el-button type="primary" @click="handleCreate" v-if="hasRole || urls.includes('/auth/user/curd/')">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row size="small">
      <el-table-column prop="id" align="center" label='ID' width="95">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="100">
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter">{{statusOptions[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          {{scope.row.roles|rolesFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注">
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="140">
      </el-table-column>
      <el-table-column prop="login_time" label="登录时间" width="140">
      </el-table-column>
      <el-table-column prop="ip" label="登录IP" width="160">
      </el-table-column>
      <el-table-column prop="auth_ip" label="授权IP">
      </el-table-column>
      <el-table-column prop="google_key" label="登录key" width="150">
      </el-table-column>
      <el-table-column prop="google_key2" label="支付key" width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" width="400" fixed="right" v-if="hasRole || urls.includes('/auth/user/curd/')">
        <template slot-scope="scope">
          <el-button v-if="!isAdmin(scope.row.id)" type="success" @click.native="handleAuth(scope.row)" size="mini" icon="el-icon-check">授权</el-button>
          <el-button v-if="!isAdmin(scope.row.id)" type="info" @click.native="handlePassword(scope.row)" size="mini" icon="el-icon-refresh">重置密码</el-button>
          <el-button v-if="!isAdmin(scope.row.id)" type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button v-if="!isAdmin(scope.row.id)" type="success" @click.native="handleGuanlian(scope.row)" size="mini" icon="el-icon-refresh">关联</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container" style="margin-top: 15px; display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-if="dialogStatus=='create'" v-model="form.username"></el-input>
          <el-input v-else v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input v-model="form.password" placeholder="如果不修改密码,请不要填写">
            <el-button slot="append" @click="generateKey2" >随机生成</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" size="small">
            <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" placeholder="请填写备注"></el-input>
        </el-form-item>
        <el-form-item label="授权ip">
          <el-input v-model="form.auth_ip" placeholder="多个以|隔开"></el-input>
        </el-form-item>
        <el-form-item label="登录Key" prop='google_key'>
          <el-input v-model="form.google_key" placeholder="16位大写字母">
            <el-button slot="append" @click="generateKey" >随机生成</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="支付Key" prop='google_key'>
          <el-input v-model="form.google_key2" placeholder="16位大写字母">
            <el-button slot="append" @click="generateGK2" >随机生成</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="doCreate" :loading="submitting">确 定</el-button>
        <el-button v-else type="primary" @click="doUpdate" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="授权" :visible.sync="authVisible" width="30%" v-draggable>
      <div class="filter-container">
        当前用户:
        <el-tag v-if="currentUser" type="danger" size="mini">{{currentUser.username}}</el-tag>
      </div>
      <el-tree class="scroll-bar" :props="defaultProps" :data="treeData" show-checkbox node-key="id" :default-checked-keys="roles" ref="tree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAuth" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="关联" :visible.sync="guanlianVisible" size="mini" v-draggable>
      <div class="filter-container">
        当前用户:
        <el-tag v-if="currentUser" type="danger" size="mini">{{currentUser.username}}</el-tag>
      </div>
      <el-tree :props="defaultProps" :data="merchantTreeData" show-checkbox node-key="id" :default-checked-keys="merchantIds" ref="merchantTree">
      </el-tree>
      <el-tree :props="defaultProps" :data="agentTreeData" show-checkbox node-key="id" :default-checked-keys="agentIds" ref="agentTree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="guanlianVisible = false">取 消</el-button>
        <el-button type="primary" @click="doGuanlian" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listUser, getUser, addUser, updateUser, authUser, resetUserPassword, guanlianAgentAndMerchant } from '@/api/auth'

export default {
  computed: {
    ...mapGetters([
      'merchantMap',
      'agentMap',
      'roleIds',
      'token',
      'urls'
    ]),
    hasRole () {
      return this.roleIds.includes(1)
    }
  },
  data() {
    return {
      merchantList: [],
      agentList: [],
      list: null,
      total: null,
      listLoading: true,
      submitting: false,
      guanlianVisible: false,
      queryParams: {
        page: 1,
        limit: 40,
        username: '',
        status: '0'
      },
      dialogStatus: '',
      titleMap: { update: '编辑', create: '创建' },
      createVisible: false,
      form: {},
      rules: {
        username: [
          { required: true, message: '用户名必填' }
        ],
        password: [
          { max: 32, message: '最长32位' },
          { min: 6, message: '最短6位' }
        ],
        status: [
          { required: true, message: '请选择状态' }
        ],
        google_key: [
          { max: 16, message: '16位' },
          { min: 16, message: '16位' }
        ],
        memo: [
          { max: 10, message: '最长10位' }
        ]
      },
      authVisible: false,
      statusOptions: { 0: '启用', 1: '禁用' },
      currentUser: null,
      roles: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      agentIds: [],
      merchantIds: [],
      agentTreeData: [],
      merchantTreeData: [],
      agentChildren: [],
      merchantChildren: []
    }
  },
  filters: {
    rolesFilter(roles) {
      let r = ''
      for (let i = 0; i < roles.length; i++) {
        r += roles[i].name + ','
      }
      return r
    }
  },
  created() {
    // alert(this.$root.$options.filters.toThousandslsFilter(10000000))
    for (let key in this.merchantMap) {
      this.merchantChildren.push({ id: key, label: this.merchantMap[key] })
    }
    for (let key in this.agentMap) {
      this.agentChildren.push({ id: key, label: this.agentMap[key] })
    }
    this.fetchData()
  },
  methods: {
    isAdmin (id) {
      return this.roleIds.includes(id) || this.token == id || id == 1
    },
    generateKey() {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      var str = ''
      for (let i = 0; i < 16; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      this.$set(this.form, 'google_key', str)
    },
    generateKey2() {
      const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      var str = ''
      var weishu = 8
      for (let i = 0; i < weishu; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      this.$set(this.form, 'password', str)
    },
    generateGK2() {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      var str = ''
      for (let i = 0; i < 16; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      this.$set(this.form, 'google_key2', str)
    },
    fetchData() {
      this.listLoading = true
      listUser(this.queryParams).then(response => {
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
      this.form.status = '' + this.form.status
      this.dialogStatus = 'update'
      this.createVisible = true
    },
    handleAuth(row) {
      this.listLoading = true
      this.currentUser = row
      getUser(row.id).then(response => {
        this.roles = response.data.ids
        this.treeData = response.data.treeData
        this.listLoading = false
        this.authVisible = true
      })
    },
    handleGuanlian(row) {
      this.currentUser = row
      this.agentIds = (row.agentIds + '').split(',')
      this.merchantIds = (row.merchantIds + '').split(',')
      this.merchantTreeData = [{
        id: 'xx',
        label: '商户',
        children: this.merchantChildren
      }]
      this.agentTreeData = [{
        id: 'xx',
        label: '代理',
        children: this.agentChildren
      }]
      this.guanlianVisible = true
    },
    handlePassword(row) {
      this.$confirm(`重置密码，用户【${row.username}】，请确认！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetUserPassword(row.id).then(response => {
          this.$notify({
            title: '重置密码',
            message: '新密码:' + response.data.pwd,
            type: 'success',
            duration: 0
          })
          // this.handleFilter()
        })
      })
    },

    doCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.password === undefined || this.form.password === '') {
            this.$notify({
              title: '缺少参数',
              message: '密码必填!',
              type: 'error',
              duration: 0
            })
            return false
          }
          this.submitting = true
          addUser(this.form).then(response => {
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
    doUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          updateUser(this.form).then(response => {
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
    doAuth() {
      const ids = this.$refs.tree.getCheckedKeys()
      this.submitting = true
      authUser(this.currentUser.id, ids).then(response => {
        this.authVisible = false
        this.$notify({
          title: response.code === 0 ? '成功' : '操作失败',
          message: response.msg,
          type: response.code === 0 ? 'success' : 'error',
          duration: response.code === 0 ? 2000 : 0
        })
        this.submitting = false
        this.handleFilter()
      })
    },
    doGuanlian() {
      var merchantIds = this.$refs.merchantTree.getCheckedKeys()
      var agentIds = this.$refs.agentTree.getCheckedKeys()
      if (merchantIds.length > 0) {
        merchantIds = (merchantIds + '').replace('xx,', '')
      }
      if (agentIds.length > 0) {
        agentIds = (agentIds + '').replace('xx,', '')
      }
      this.submitting = true
      guanlianAgentAndMerchant(this.currentUser.id, merchantIds, agentIds).then(response => {
        this.guanlianVisible = false
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
  }
}
</script>

<style scoped>
.scroll-bar {
  min-height: 200px;
  overflow-y: auto;
  max-height: 600px;
}
</style>



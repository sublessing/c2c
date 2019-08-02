<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" size='mini'>
      <el-form-item label="角色名">
        <el-input v-model="queryParams.name" placeholder="角色名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
        <el-button type="primary" @click="handleCreate" v-if="hasRole || urls.includes('/auth/role/curd/')">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row size="small" >
      <el-table-column align="center" label='ID' width="90">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="角色名">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{scope.row.memo}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300" v-if="hasRole || urls.includes('/auth/role/curd/')">
        <!-- <template slot-scope="scope"> -->
        <template slot-scope="scope" v-if="!isAdmin(scope.row.id)">
          <el-button type="success" @click.native="handleAuth(scope.row)" size="mini" icon="el-icon-check">授权</el-button>
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click.native="doDelete(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container" style="margin-top: 15px; display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="doCreate" :loading="submitting">确 定</el-button>
        <el-button v-else type="primary" @click="doUpdate" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色授权" :visible.sync="dialogAuthVisible" size="mini" v-draggable>
      <div class="filter-container">
        当前角色:<el-tag type="danger" size="mini">{{form.name}}</el-tag>
      </div>
      <el-tree :props="defaultProps" :data="treeData" show-checkbox node-key="id" :default-checked-keys="permissions" ref="tree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAuth">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listRole, getRole, addRole, updateRole, deleteRole, authRole } from '@/api/auth'

export default {
  computed: {
    ...mapGetters([
      'roleIds',
      'urls',
      'token'
    ]),
    hasRole () {
      return this.roleIds.includes(1)
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      submitting: false,
      queryParams: {
        page: 1,
        limit: 40,
        name: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogAuthVisible: false,
      titleMap: { update: '编辑', create: '创建' },
      form: {},
      rules: {
        name: [
          { required: true, message: '权限名称必填' }
        ]
      },
      permissions: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.resetForm()
    this.fetchData()
  },
  methods: {
    isAdmin (id) {
      return id == 1 || this.token == id
    },
    resetForm() {
      this.form = {
        id: '',
        name: '',
        memo: ''
      }
    },
    fetchData() {
      this.listLoading = true
      listRole(this.queryParams).then(response => {
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
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleAuth(row) {
      this.listLoading = true
      this.form.id = row.id
      this.form.name = row.name
      getRole(row.id).then(response => {
        this.permissions = response.data.ids
        this.treeData = response.data.treeData
        this.listLoading = false
        this.dialogAuthVisible = true
      })
    },
    doCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          addRole(this.form).then(response => {
            this.dialogFormVisible = false
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
          updateRole(this.form).then(response => {
            this.dialogFormVisible = false
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
    doDelete(row) {
      this.$confirm(`你确定要删除【${row.name}】吗，请确认！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(response => {
          this.$notify({
            title: response.code === 0 ? '成功' : '操作失败',
            message: response.msg,
            type: response.code === 0 ? 'success' : 'error',
            duration: response.code === 0 ? 2000 : 0
          })
          this.handleFilter()
        })
      })
    },
    doAuth() {
      const ids = this.$refs.tree.getCheckedKeys()
      authRole(this.form.id, ids).then(response => {
        this.dialogAuthVisible = false
        this.$notify({
          title: response.code === 0 ? '成功' : '操作失败',
          message: response.msg,
          type: response.code === 0 ? 'success' : 'error',
          duration: response.code === 0 ? 2000 : 0
        })
      })
    }
  }
}
</script>

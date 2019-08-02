<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="small">
      <el-form-item label="ID">
        <el-input v-model="queryParams.id" placeholder="ID"></el-input>
      </el-form-item>
      <el-form-item label="权限名">
        <el-input v-model="queryParams.name__contains" placeholder="权限名"></el-input>
      </el-form-item>
      <el-form-item label="URL">
        <el-input v-model="queryParams.url__contains" placeholder="权限URL"></el-input>
      </el-form-item>
      <el-form-item label="父节点">
        <el-input v-model="queryParams.parent_id" placeholder="父节点"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
        <el-button type="primary" v-if="hasRole || urls.includes('/auth/permission/curd/')" @click="handleCreate">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row size="small">
      <el-table-column prop="id" align="center" width="95" label='ID'>
      </el-table-column>
      <el-table-column prop="name" label="权限名" width="180">
      </el-table-column>
      <el-table-column prop="parent_id" label="父节点" width="95">
      </el-table-column>
      <el-table-column prop="url" label="URL" width="250">
      </el-table-column>
      <el-table-column prop="router" label="路由">
      </el-table-column>
      <el-table-column prop="sort_id" label="排序" width="95">
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" v-if="hasRole || urls.includes('/auth/permission/curd/')" >
        <template slot-scope="scope">
          <el-button type="primary"  @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click.native="handleDelete(scope.row)" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container" style="margin-top: 15px; display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="70px" size="small">
        <el-form-item label="权限名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="是查询吗">
          <el-switch v-model="form.is_query" active-text="是" inactive-text="非">
          </el-switch>
        </el-form-item>
        <el-form-item label="父节点">
          <el-input v-model="form.parent_id"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="router" >
          <el-input type="textarea" autosize v-model="form.router"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort_id" >
          <el-input v-model="form.sort_id"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="doCreate" :loading="submitting">确 定</el-button>
        <el-button v-else type="primary" @click="doUpdate" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listPermission, addPermission, updatePermission, deletePermission } from '@/api/auth'

export default {
  computed: {
    ...mapGetters([
      'roleIds',
      'urls'
    ]),
    hasRole() {
      return this.roleIds.includes(1)
    }
  },
  data() {
    const validateBoth = (rule, value, callback) => {
      if ((this.form.url !== '' && this.form.router !== '') && (this.form.url !== null && this.form.router !== null)) {
        callback(new Error('url和router不能同时存在'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      total: null,
      listLoading: true,
      submitting: false,
      queryParams: {
        page: 1,
        limit: 20,
        name__contains: '',
        url__contains: '',
        parent_id: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      titleMap: { update: '编辑', create: '创建' },
      form: {},
      rules: {
        name: [
          { required: true, message: '权限名必填' }
        ],
        url: [
          { validator: validateBoth }
        ],
        router: [
          { validator: validateBoth }
        ],
        sort_id: [
          { required: true, message: '排序字段必填' }
        ]
      }
    }
  },
  created() {
    this.resetForm()
    this.fetchData()
  },
  methods: {
    resetForm() {
      this.form = {
        id: '',
        name: '',
        url: '',
        is_query: 1,
        parent_id: '',
        router: '',
        sort_id: ''
      }
    },
    fetchData() {
      this.listLoading = true
      listPermission(this.queryParams).then(response => {
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
      this.form.sort_id = '' + this.form.sort_id
      this.form.parent_id = '' + this.form.parent_id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    doCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addPermission(this.form).then(response => {
            this.dialogFormVisible = false
            this.submitting = true
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
          updatePermission(this.form).then(response => {
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
    handleDelete(row) {
      this.$confirm(`你确定要删除【${row.name}】吗，请确认！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePermission(row.id).then(response => {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.handleFilter()
        })
      })
    }
  }
}
</script>

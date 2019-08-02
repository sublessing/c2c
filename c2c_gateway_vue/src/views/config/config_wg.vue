<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="网关IP">
        <el-input v-model="queryParams.gw_ip" placeholder="请输入网关IP" style="width:280px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">搜 索</el-button>
        <el-button type="primary" @click="handleCreate">新 增</el-button>
        <!-- <el-button type="warning" @click="reload">重 载</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中"  border stripe fit highlight-current-row size="small">
      <el-table-column prop="gw_id" label="网关ID" align="center">
      </el-table-column>
      <el-table-column prop="gw_ip" label="网关IP" align="center">
      </el-table-column>
      <el-table-column label="状态" align="center" width="60" >
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter">{{ statusMap[''+scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" align="center" width="160" >
      </el-table-column>
      <!-- <el-table-column prop="reload_time" label="重载时间" align="center" width="160" >
      </el-table-column> -->
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="doEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="doDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="网关ID" prop="gw_id" v-if="dialogStatus === 'create'">
          <el-input v-model="form.gw_id" placeholder="请输入网关ID"></el-input>
        </el-form-item>
        <el-form-item label="网关IP" prop="gw_ip">
          <el-input v-model="form.gw_ip" placeholder="请输入网关IP"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-select v-model="form.status">
            <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.memo" placeholder="请输入备注"></el-input>
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
import { resetConfig } from '@/api/stat'
import { listGateway, addGateway, editGateway, delGateway, reloadGateway, listSelectChannel } from '@/api/service'

export default {
  computed: {
    ...mapGetters([
      'urls'
    ])
  },
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 20
      },
      titleMap: {'create': '添加AP', 'update': '修改AP'},
      dialogStatus: 'create',
      statusMap:{'0':'启用', '1': '禁用'},
      createVisible: false,
      submitting: false,
      reseting: false,
      list: null,
      total: 0,
      listLoading: true,
      form: {},
      rules: {
        gw_id: [
          { required: true, message: '请填写网关ID' }
        ],
        gw_ip: [
          { required: true, message: '请填写网关IP' }
        ],
        status: [
          { required: true, message: '请选择状态' }
        ],
      }
    }
  },
  created() {
    this.fetchData()
  },
  filters: {
    statusFilter(status) {
      const map = { '2': 'danger','1': 'danger', '0': 'success' }
      return map[status]
    }
  },
  methods: {
    handleSizeChange(val) {
      this.queryParams.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      listGateway(this.queryParams).then(response => {
        this.list = response.data.items;
        this.total = response.data.total
        this.listLoading = false
      })
    },
    doCreate () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          addGateway(this.form).then(response => {
            this.submitting = false
            this.$notify({
              title: response.code === 0 ? '成功' : '操作失败',
              message: response.msg,
              type: response.code === 0 ? 'success' : 'error',
              duration: response.code === 0 ? 2000 : 0
            })
            if (response.code === 0) {
              this.fetchData()
            }
            this.createVisible = false
          })
        }
      })
    },
    doUpdate () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          editGateway(this.form).then(response => {
            this.submitting = false
            this.$notify({
              title: response.code === 0 ? '成功' : '操作失败',
              message: response.msg,
              type: response.code === 0 ? 'success' : 'error',
              duration: response.code === 0 ? 2000 : 0
            })
            if (response.code === 0) {
              this.fetchData()
            }
            this.createVisible = false
          })
        }
      })
    },
    handleCreate () {
      this.form = {}
      this.dialogStatus = 'create'
      this.createVisible = true
    },
    doEdit(row) {
      this.form = Object.assign({}, row)
      this.form.status = '' + this.form.status
      this.dialogStatus = 'update'
      this.createVisible = true
    },
    reload() {
      this.$confirm('您确定重载AP配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reseting = true
        reloadGateway().then(response => {
          this.$notify({
            title: response.code === 0 ? '重载成功' : '重载失败',
            message: response.msg,
            type: response.code === 0 ? 'success' : 'error',
            duration: response.code === 0 ? '1000' : 0
          })
          this.reseting = false
          this.fetchData()
        })
      })
    },
    doDel (row) {
      this.$confirm('您确定删除 '+row.gw_ip+' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGateway(row).then(response => {
          this.$notify({
            title: response.code === 0 ? '删除成功' : '删除失败',
            message: response.msg,
            type: response.code === 0 ? 'success' : 'error',
            duration: response.code === 0 ? '1000' : 0
          })
          this.fetchData()
        })
      })
    }
  }
}
</script>


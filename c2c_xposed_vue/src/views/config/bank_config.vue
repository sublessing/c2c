<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="银行名称">
        <el-input v-model="queryParams.bank_name__contains" placeholder="银行名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
        <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" border stripe fit highlight-current-row size="small">
     <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center">
      </el-table-column>
      <el-table-column prop="bank_name" label="银行名称" align="center">
      </el-table-column>
      <el-table-column prop="bank_code" label="银行简称" align="center">
      </el-table-column>
      <el-table-column  prop="memo" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="handleUpdate(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" style="margin-top: 15px;display: flex;justify-content: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParams.page" :page-sizes="[20,40,60]" :page-size="queryParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="createVisible" width="25%" v-draggable>
      <el-form class="small-space" :model="form" ref="form" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="银行名称" prop='bank_name'>
          <el-input v-model="form.bank_name" placeholder="银行名称"></el-input>
        </el-form-item>
        <el-form-item label="银行简称" prop='bank_code'>
          <el-input v-model="form.bank_code" placeholder="银行简称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.memo" placeholder="备注"></el-input>
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
import { listBankConfig, addBankConfig, editBankConfig } from '@/api/service'
export default {
    name: 'BankConfig',
    data () {
        return {
            queryParams: {
                page: 1,
                limit: 20
            },
            listLoading: false,
            list: [],
            total: 0,
            titleMap: {'create': '添加', 'update': '修改'},
            dialogStatus: 'create',
            createVisible: false,
            form: {},
            submitting: false,
            rules: {
                bank_name: [
                    {required: true, message: '银行名称必填'}
                ],
                bank_code: [
                    {required: true, message: '银行简称必填'}
                ]
            },
            multipleSelection: []
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        handleFilter() {
            this.queryParams.page = 1
            this.fetchData()
        },
        fetchData() {
            this.listLoading = true
            listBankConfig(this.queryParams).then(response => {
                this.list = response.data.items
                this.total = response.data.total
                this.listLoading = false
            })
        },
        handleCreate() {
            this.form = {}
            this.dialogStatus = 'create'
            this.createVisible = true
        },
        doCreate() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitting = true
                    addBankConfig(this.form).then(response => {
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
        handleUpdate(row) {
            this.form = Object.assign({}, row)
            this.dialogStatus = 'update'
            this.createVisible = true
        },
        doUpdate() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitting = true
                    editBankConfig(this.form).then(response => {
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
        handleSizeChange(val) {
            this.queryParams.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParams.page = val
            this.fetchData()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
    }
}
</script>

<style>

</style>

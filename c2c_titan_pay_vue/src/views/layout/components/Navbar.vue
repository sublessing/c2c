<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb></breadcrumb>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <svg-icon icon-class="user" />{{name}}
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown" size="small">
          <el-dropdown-item style="padding:0px;">
            <div @click="handlePassword" style="text-align: center; width: 100%;  min-width: 150px;">修改密码</div>
          </el-dropdown-item>
          <el-dropdown-item divided style="padding:0px;">
            <div @click="logout" style="text-align: center; width: 100%;  min-width: 150px;">退出</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>

    <el-dialog title="修改密码" :visible.sync="updateVisible" width="30%" v-draggable>
      <el-form class="small-space" :model="form" label-position="left" label-width="80px">
        <el-form-item label="老密码">
          <el-input type="password" v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码">
          <el-input type="password" v-model="form.newPwd1"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdate" :loading="updating" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { editUserPassword } from '@/api/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
    ])
  },
  data() {
    return {
      form: {
        oldPwd: '',
        newPwd: '',
        newPwd1: ''
      },
      updating: false,
      updateVisible: false
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    handlePassword() {
      this.form = {}
      this.updateVisible = true
    },
    doUpdate() {
      if (this.form.newPwd === undefined || this.form.newPwd === undefined || this.form.oldPwd === undefined) {
        this.$notify({
          title: '提交信息不完整',
          message: '请输入完整信息',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (this.form.newPwd !== this.form.newPwd1) {
        this.$notify({
          title: '修改密码',
          message: '输入的新密码不一致',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.updating = true
      editUserPassword(this.form).then(response => {
        this.updating = false
        this.$notify({
          title: '修改密码',
          message: response.msg,
          type: response.code === 0 ? 'success' : 'error',
          duration: response.code === 0 ? 2000 : 0
        })
        this.updateVisible = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.el-dropdown-menu__item--divided:before{margin:0px;}
.el-dropdown-menu.el-popper.user-dropdown{margin-top:0px; }
</style>


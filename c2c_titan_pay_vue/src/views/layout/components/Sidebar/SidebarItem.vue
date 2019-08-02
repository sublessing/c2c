<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">

      <router-link v-if="!item.hidden && item.onlyOne" :to="item.children[0] | toPath(routeMap)" :key="item.children[0].id">
        <el-menu-item :index="item.children[0].name" class='submenu-title-noDropdown'>
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else-if="!item.hidden" :index="item.name" :key="item.id">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </template>
        <template v-for="child in item.children">
          <template v-if="!child.hidden">
            <sidebar-item class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>
            <router-link v-else :to="child | toPath(routeMap)" :key="child.id">
              <el-menu-item :index="child.name">
                <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarItem',
  computed: {
    ...mapGetters([
      'routeMap'
    ])
  },
  props: {
    routes: {
      type: Array
    }
  }
}
</script>

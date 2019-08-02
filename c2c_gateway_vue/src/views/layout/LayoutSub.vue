<template>
  <transition name="fade" mode="out-in">
    <div>2</div>
    <!-- <keep-alive :include='cachedViews'>
      <router-view></router-view>
    </keep-alive> -->
  </transition>
</template>

<script>
export default {
  name: 'LayoutSub',
  computed: {
    cachedViews() {
      return this.$store.state.app.cachedViews
    }
  }
}
</script>

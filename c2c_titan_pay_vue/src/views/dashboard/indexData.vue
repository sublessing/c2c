<template>
  <div class="dashboard-container">
    <pannel-group></pannel-group>
    <chart-group></chart-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pannelGroup from './components/pannelGroup'
import chartGroup from './components/chartGroup'
export default {
  name: 'indexData',
  components: { pannelGroup, chartGroup },
  computed: {
    ...mapGetters([
      'name',
      'roleIds'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>


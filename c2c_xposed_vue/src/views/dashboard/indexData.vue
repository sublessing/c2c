<template>
  <div class="dashboard-container">
    <template v-if="!roleIds.includes(3)">
      <pannel-group></pannel-group>
      <chart-group></chart-group>
    </template>
    <template v-else>
      <agent-index></agent-index>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pannelGroup from './components/pannelGroup'
import chartGroup from './components/chartGroup'
import agentIndex from './components/agentIndex'
export default {
  name: 'indexData',
  components: { pannelGroup, chartGroup, agentIndex },
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


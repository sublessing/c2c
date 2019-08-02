<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" label-width="80px" size="mini">
      <el-form-item label="统计日期">
        <el-date-picker v-model="queryParams.sdate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:150px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="代理ID">
        <el-input v-model="queryParams.agent_id__list" placeholder="多个代理使用都会号隔开" style="width:400px;"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleFilterByAgentIds">按代理ID查询</el-button>
        <el-button type="primary" @click="handleFilter">按汇总数据查询</el-button>
      </el-form-item>
    </el-form>
    <div id="mychart" style="height:500px; width:100%;" v-loading.body="chartLoading">
    </div>
    <el-table :data="lastData" element-loading-text="拼命加载中" border stripe fit highlight-current-row size="small" v-loading.body="tableLoading" @sort-change="handleSort" :default-sort="{prop: 'succ_rate', order: 'descending'}">
      <el-table-column label="代理类型" align="center">
        <template slot-scope="scope">
          {{typeMap[scope.row.agent_type]}}
        </template>
      </el-table-column>
      <el-table-column prop="agent_id" label="代理ID" align="center">
      </el-table-column>
      <el-table-column prop="login_name" label="代理账号" align="center">
      </el-table-column>
      <el-table-column prop="succ_rate" label="完成率" align="center" sortable="custom">

      </el-table-column>
      <el-table-column prop="succ_count" label="完成订单数" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="over_count" label="超时订单数" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="lost_count" label="放弃订单数" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="grab_count" label="总抢单数" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="arrange_count" label="总分配订单数" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="duration_avg" label="平均完成时长（秒）" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="sdate_time" label="最新统计时间" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import echarts from 'echarts'
import { parseTime } from '@/utils/index'
import { jkAgentSuccRate, jkAgentNewest } from '@/api/jk'
export default {
  data() {
    return {
      typeMap: { 0: '内部代理', 1: '外部代理', 2: '虚拟用户' },
      lastData: null,
      chartLoading: false,
      tableLoading: false,
      queryParams: {
        agent_id__list: '',
        sdate: parseTime(new Date().getTime(), '{y}-{m}-{d}'),
        searchType: 0 // 0:按数据汇总查询; 1: 按agentId查
      },
      chart: null,
      legendData: [],
      seriesData: [],
      xAxisData: []
    }
  },
  mounted() {
    this.handleFilter() // 默认按汇总分类查
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    fetchDataNewest() { // 获取每个代理的最新数据
      this.tableLoading = true
      jkAgentNewest(this.queryParams).then(response => {
        this.tableLoading = false
        this.lastData = response.data.items
      })
    },
    handleFilter() { // 按汇总分类查
      if (this.queryParams.sdate === '' || this.queryParams.sdate === null) {
        this.$notify({
          title: '参数错误',
          message: '统计时间不能为空!',
          type: 'error',
          duration: 2000
        })
        return false
      }
      this.queryParams.searchType = 0
      this.fetchDataHuiZong()
      this.fetchDataNewest()
    },
    fetchDataHuiZong() {
      // 1.x轴需要的时间数据; 2.legend需要的对象; 3.每个对象对应的list值
      this.chartLoading = true
      jkAgentSuccRate(this.queryParams).then(response => {
        this.seriesData = []
        this.legendData = response.data.legendData
        this.xAxisData = response.data.xAxisData
        const y100Values = response.data.y100Values
        const y0Values = response.data.y0Values
        const y1Values = response.data.y1Values
        this.seriesData.push({ name: '全部代理汇总', type: 'line', data: y100Values })
        this.seriesData.push({ name: '外部代理汇总', type: 'line', data: y1Values })
        this.seriesData.push({ name: '内部代理汇总', type: 'line', data: y0Values })
        this.chartLoading = false
        this.initChart()
      })
    },
    handleFilterByAgentIds() { // 按代理id查
      if (this.queryParams.sdate === '' || this.queryParams.sdate === null) {
        this.$notify({
          title: '参数错误',
          message: '统计时间不能为空!',
          type: 'error',
          duration: 2000
        })
        return false
      }
      if (this.queryParams.agent_id__list === '' || this.queryParams.agent_id__list === null) {
        this.$notify({
          title: '参数错误',
          message: '请填写代理ID!',
          type: 'error',
          duration: 2000
        })
        return false
      }
      this.queryParams.searchType = 1
      this.fetchDataByAgentIds()
      this.fetchDataNewest()
    },
    fetchDataByAgentIds() {
      // 1.x轴需要的时间数据; 2.legend需要的对象; 3.每个对象对应的list值
      this.chartLoading = true
      jkAgentSuccRate(this.queryParams).then(response => {
        this.seriesData = []
        this.chart.dispose()
        this.chartLoading = false
        if (response.code === 0) {
          this.legendData = response.data.legendData
          this.xAxisData = response.data.xAxisData
          const list = response.data.items // 该日代理制图数据
          this.seriesData = list
          this.initChart()
        } else {
          this.$notify({
            title: '统计失败',
            message: response.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('mychart'))
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params, ticket, callback) {
            var res = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              res +=
                '<br/>' + params[i].seriesName + ': ' + (params[i].value * 100).toFixed(2) + '%' + ' (' + params[i].data.ed + ')'
            }
            return res
          }
        },
        legend: {
          left: '3%',
          data: this.legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: true },
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          type: 'value',
          scale: true,
          max: 1,
          min: 0,
          splitNumber: 5,
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: function(v) {
              return v * 100 + '%'
            }
          }
        },
        series: this.seriesData
      }
      this.chart.setOption(option)
    },
    handleSort({ column, prop, order }) {
      console.log(prop, order)
      this.queryParams.sort_order = order
      this.queryParams.sort_name = prop
      this.fetchDataNewest()
    }
  }
}
</script>

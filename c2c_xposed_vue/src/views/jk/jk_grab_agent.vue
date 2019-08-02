<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" label-width="80px" size="mini">
      <el-form-item label="统计日期">
        <el-date-picker v-model="queryParams.sdate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:150px;">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleFilter">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="mychart" style="height:500px; width:100%;" v-loading.body="chartLoading">
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { parseTime } from '@/utils/index'
import { jkAgentCount } from '@/api/jk'
export default {
  data() {
    return {
      lastData: null,
      chartLoading: false,
      queryParams: {
        sdate: parseTime(new Date().getTime(), '{y}-{m}-{d}')
      },
      chart: null,
      legendData: [],
      seriesData: [],
      xAxisData: [],
      option: {}
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
    handleFilter() { // 按汇总分类查
      this.fetchDataHuiZong()
    },
    fetchDataHuiZong() {
      // 1.x轴需要的时间数据; 2.legend需要的对象; 3.每个对象对应的list值
      this.chartLoading = true
      jkAgentCount(this.queryParams).then(response => {
        this.seriesData = []
        this.legendData = response.data.legendData
        console.log(this.legendData)
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
    initChart() {
      this.chart = echarts.init(document.getElementById('mychart'))
      this.option = {
        tooltip: {
          trigger: 'axis'
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
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: this.seriesData
      }
      this.chart.setOption(this.option)
    }
  }
}
</script>

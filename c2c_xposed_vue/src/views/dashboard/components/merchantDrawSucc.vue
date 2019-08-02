<template>
  <div class="app-container">
    <div id="mds" style="width:680px; height:350px;" v-loading="chartLoading">
    </div>
  </div>
</template>

<script>
//  商户提现
import echarts from 'echarts'
import { jkMerchantDrawSucc } from '@/api/jk'
export default {
  data() {
    return {
      chartLoading: false,
      timer: null,
      queryParams: {
        last24: 1,
        searchType: 0, // 0:按数据汇总查询
        type: 1 // 1:提现
      },
      chart: null,
      legendData: [],
      seriesData: [],
      xAxisData: []
    }
  },
  mounted() {
    this.fetchDataHuiZong() // 默认按汇总分类查
    this.timer = setInterval(this.fetchDataHuiZong, 50 * 1000)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    fetchDataHuiZong() {
      // 1.x轴需要的时间数据; 2.legend需要的对象; 3.每个对象对应的list值
      this.chartLoading = true
      jkMerchantDrawSucc(this.queryParams).then(response => {
        this.seriesData = []
        this.legendData = response.data.legendData
        this.xAxisData = response.data.xAxisData
        // const y100Values = response.data.y100Values
        const y0Values = response.data.y0Values
        const y1Values = response.data.y1Values
        // this.seriesData.push({ name: '全部商户汇总', type: 'line', data: y100Values })
        // this.seriesData.push({ name: '系统商户汇总', type: 'line', data: y1Values })
        // this.seriesData.push({ name: '普通商户汇总', type: 'line', data: y0Values })
        this.chartLoading = false
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('mds'))
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
          left: '5%',
          top: 30,
          data: this.legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        title: {
          text: '商户提现成功率',
          left: 'center',
          textStyle: {
            color: '#ccc'
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
    }
  }
}
</script>

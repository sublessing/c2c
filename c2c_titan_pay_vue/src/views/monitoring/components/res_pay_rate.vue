<template>
  <div class="app-container">
    <!-- <el-form :inline="true" :model="queryParams" size="mini">
      <el-form-item label="统计日期">
        <el-date-picker v-model="queryParams.day__gte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:130px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="25px">
        <el-date-picker v-model="queryParams.day__lte" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="" style="width:130px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜 索</el-button>
      </el-form-item>
    </el-form> -->
    <div id="rpr" style="width:680px; height:250px;" v-loading="listLoading">
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { successRateResPay } from '@/api/service'
import { parseTime } from '@/utils/index'
export default {
    name: 'ResPaySucc',
    data() {
        return {
            xAxisData: [],
            yAxisData: {},
            seriesData: [],
            listLoading: false,
            namMap: {'all': '全部商户汇总'}
        }
    },
    computed: {
      ...mapGetters([
        'merchantMap',
        'queryParams'
      ])
    },
    created(){
        this.fetchData()
        this.timer = setInterval(this.fetchData, 60 * 1000*2)
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
        handleFilter(){
            this.queryParams.page = 1
            this.fetchData()
        },
        fetchData(){
            this.listLoading = true
            this.queryParams.day__gte = parseTime(new Date(this.queryParams.day__gte).getTime(), '{y}-{m}-{d}')+' 00:00:00'
            this.queryParams.day__lte = parseTime(new Date(this.queryParams.day__lte).getTime(), '{y}-{m}-{d}')+' 23:59:59'
            successRateResPay(this.queryParams).then(response => {
                this.seriesData = []
                this.legendData = [];
                this.xAxisData = response.data.xAxisData.map(e => e+':00:00');
                this.yAxisData = response.data.yAxisData
                for (var name in response.data.yAxisData) {
                  var seriesName = "";
                  for (var nameItem of response.data.yAxisData[''+name]) {
                    if (nameItem.res_name) {
                      this.legendData.push(nameItem.res_name)
                      seriesName = nameItem.res_name;
                      break;
                    }
                  }
                  this.seriesData.push({
                    name: seriesName,
                    type: 'line',
                    data: response.data.yAxisData[name].map(el => {
                      el.value = el.pay_rate?(el.pay_rate*100).toFixed(2)*1:0;
                      return el;
                    })
                    // .map(el => (el.pay_rate?(el.pay_rate*100).toFixed(2)*1:0))
                  })
                }
                this.listLoading = false
                this.intiChart()
            })
        },
        intiChart(){
          this.chart = echarts.init(document.getElementById('rpr'))
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
                    '<br/>' + params[i].seriesName + ': ' + (params[i].data.order_num?params[i].data.order_num:0) + ' | ' + (params[i].data.order_succ_num?params[i].data.order_succ_num:0) + ' （' + params[i].value.toFixed(2) + '%）'
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
              text: '耗材充值成功率',
              left: 'center',
              textStyle: {
                color: '#ccc'
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.xAxisData,
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#626262',
                  fontSize: '10',
                },
                formatter: (val) => {
                  let arr = val.split(' ')
                  if (/^(\d+):(.*)/.test(arr[1])) {
                    var h = RegExp.$1
                    if (h == '00') {
                      val = arr[0]
                    } else {
                      val = h
                    }
                  }
                  return val;
                }
              }
            },
            yAxis: {
              type: 'value'
            },
            series: this.seriesData
          }
          this.chart.setOption(option, true)
          this.$emit('connectChart');
        }
    }
}
</script>

<style>

</style>

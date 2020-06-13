<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'数据统计'" :thirdNav="'数据报表'"></Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div id="eachrtsRef" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    const myEcharts = echarts.init(document.getElementById('eachrtsRef'))
    const { data: res } = await this.$http.get('reports/type/1')

    if (res.meta.status !== 200) return this.$msg.error('获取数据失败')
    // 获取的数据与要合并的样式数据
    const reslult = _.merge(res.data, this.options)
    myEcharts.setOption(reslult)
  },
  methods: {},
  components: {
    Breadcrumb
  }
}
</script>

<style>
</style>

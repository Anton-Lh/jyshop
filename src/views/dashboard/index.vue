<template>
    <div class="dashboard-container">
        <!-- <div class="dashboard-text">欢迎{{ name }}，登录成功！</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div> -->
        <el-col :span="24">
            <el-card shadow="hover">
                <echart :chartData="echartData.video"
                        :isAxisChart="false"
                        style="height: 280px"></echart>
            </el-card>
            <el-card shadow="hover">
                <el-card shadow="hover">
                    <echart :chartData="echartData.user"
                            style="height: 260px"></echart>
                </el-card>
            </el-card>
            <el-card shadow="hover">
                <echart :chartData="echartData.order"
                        style="height: 260px"></echart>
            </el-card>
        </el-col>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import Echart from './EChart'
export default {
    components: {
        Echart
    },
    name: 'Dashboard',
    data () {
        return {
            echartData: {
                order: {
                    xData: [],
                    series: []
                },
                user: {
                    xData: [],
                    series: []
                },
                video: {
                    series: []
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'name',
            'roles'
        ])
    },
    mounted () {
        this.getEchart()
    },
    methods: {
        getEchart () {

            this.echartData.video.series.push({
                data: [
                    { value: 335, name: '直接访问' },
                    { value: 310, name: '总和客户' },
                    { value: 234, name: '新增客户' },
                    { value: 135, name: '卡券数量' }
                ],
                type: 'pie'
            })
            this.echartData.order.xData.push(
                {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }
            )
            this.echartData.order.series.push(
                {
                    name: '直接访问',
                    type: 'bar',
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: '总访问量',
                    type: 'bar',
                    stack: '广告',
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '新增客户',
                    type: 'bar',
                    stack: '广告',
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: '已用卡券',
                    type: 'bar',
                    barWidth: 5,
                    stack: '搜索引擎',
                    data: [620, 732, 701, 734, 1090, 1130, 1120]
                },


            )
            this.echartData.user.xData.push(
                {
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }
            )
            this.echartData.user.series.push({
                name: '直接访问',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
                {
                    name: '总和客户',
                    type: 'line',
                    stack: '总量',
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '新增客户',
                    type: 'line',
                    stack: '总量',
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: '卡券数量',
                    type: 'line',
                    stack: '总量',
                    data: [320, 332, 301, 334, 390, 330, 320]
                })
        }
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
.el-card {
  margin-bottom: 20px;
}
</style>

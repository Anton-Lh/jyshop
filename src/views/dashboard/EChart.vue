<template>
    <div style="height: 100%"
         ref="echart">
        echart
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    props: {
        chartData: {
            type: Object,
            //使用default 设置空对象    
            default () {
                return {
                    xData: [],
                    series: []
                }
            }
        },
        isAxisChart: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        options () {
            return this.isAxisChart ? this.axisOption : this.normalOption
        },

    },
    watch: {
        // 监听数据时候变化 是的话处理
        chartData: {
            handler (nval, oval) {
                // 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
                this.$nextTick(() => {
                    this.initChart()
                    console.log(`2222`, nval, oval)
                });
            },
            immediate: true,
            deep: true
        }
    },
    data () {
        return {
            echart: null,
            axisOption: {
                // 图标提示
                legend: {
                    textStyle: {
                        color: '#333'
                    }
                },
                // 图表偏移设置
                grid: {
                    left: '20%'
                },
                // X坐标轴提示
                tooltip: {
                    trigger: 'axis'
                },
                // X轴
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLine: {
                        lineStyle: {
                            color: '#17b3a3'
                        }
                    },
                    axisLabel: {
                        color: '#333'
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#17b3a3'
                            }
                        }
                    }
                ],
                // 循环随机颜色
                color: [
                    '#2ec7c9',
                    '#b6a2de',
                    '#5ab1ef',
                    '#ffb980',
                    '#d87a80',
                    '#8d98b3',
                    '#e5cf0d',
                    '#97b552',
                    '#95706d',
                    '#dc69aa',
                    '#07a2a4',
                    '#9a7fd1',
                    '#588dd5',
                    '#f5994e',
                    '#c05050',
                    '#59678c',
                    '#c9ab00',
                    '#7eb00a',
                    '#6f5553',
                    '#c14089'
                ],
                series: []
            },
            // 无Y轴 
            normalOption: {
                tooltip: {
                    trigger: 'item'
                },
                color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
                series: []
            }
        }
    },
    methods: {
        // 判断数据进来是否初始化
        initChart () {
            // 图表进来时先处理数据
            this.initChartData()
            //   如果数据存在直接存储进来
            if (this.echart) {
                // this.echart.setOption(this.normalOption)
                this.echart.setOption(this.options)
            } else {
                this.echart = echarts.init(this.$refs.echart)
                this.echart.setOption(this.options)
            }
        },
        // 传入的图表数据处理，因图表类型不一样
        initChartData () {
            if (this.isAxisChart) {
                this.axisOption.xAxis.data = this.chartData.xData[0].data
                this.axisOption.series = this.chartData.series
            } else {
                this.normalOption.series = this.chartData.series
            }
        },
        // 计算ECHARTS自适应
        resizeChart () {
            this.echart ? this.echart.resize() : ''
        }
    },
    mounted () {
        window.addEventListener('resize', this.resizeChart)
    },
    destroyed () {
        window.removeEventListener('resize', this.resizeChart)
    }
}
</script>

<style lang="scss" scoped></style>

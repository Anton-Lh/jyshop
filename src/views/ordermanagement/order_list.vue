<template>
    <div class="containerPublic orderManagement">
        <div class="form-block">
            <!-- v-model.trim 自动过滤前后空格 -->
            <span>名称:</span>
            <el-input class="input-width"
                      v-model="search.name"></el-input>
            <span>状态:</span>
            <el-select v-model="search.value"
                       placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <span class="demonstration">选择日期</span>
            <el-date-picker v-model="search.time"
                            type="datetime"
                            placeholder="选择日期时间">

            </el-date-picker>
            <div class="button-block"
                 style="display: inline-block;margin-left: 30px;">
                <el-button type="primary"
                           size="medium"
                           @click="curPage=1;getInfo ()">搜索</el-button>
                <el-button type="info"
                           size="medium"
                           @click="resetSearchForm()">重置</el-button>

            </div>
        </div>

        <el-table :data="tableData"
                  style="width: 100%"
                  stripe
                  :header-cell-style="{textAlign:'center',background: '#f5f5f5',height: '40px',color:'#555555'} "
                  :cell-style="{textAlign: 'center'}">
            <el-table-column prop="order"
                             label="订单号">
            </el-table-column>
            <el-table-column prop="name"
                             label="收件人">
            </el-table-column>
            <el-table-column prop="phone"
                             label="联系方式">
            </el-table-column>
            <el-table-column prop="address"
                             label="地址">
            </el-table-column>
            <el-table-column prop="logistics"
                             label="物流公司">
            </el-table-column>
            <el-table-column prop="order"
                             label="物流号">
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    {{scope.row.status=="1"?'已下单':scope.row.status=="2"?'已发货':'已完成'}}
                    <!-- <span v-if="scope.row.status=='1'">已下单</span>
                        <span v-else>发货</span> -->
                </template>
            </el-table-column>
            <el-table-column prop="date"
                             label="建立时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success"
                               v-on:click="edit(scope.$index, scope.row)"
                               size="small">查看</el-button>
                    <el-button type="danger"
                               v-on:click="del(scope.$index, scope.row)"
                               size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="订单详情"
                   :close-on-click-modal="false"
                   center
                   @close="colse_rule()"
                   :visible.sync="editOrder_show">

            <el-row>
                <el-col :span="24">
                    <span>订单编号:
                        <b>2</b>
                    </span>
                </el-col>
                <el-col :span="12">
                    <span>收货人:
                        <b>2</b>
                    </span>
                </el-col>
                <el-col :span="12">
                    <span>联系电话:
                        <b>2</b>
                    </span>
                </el-col>
                <el-col :span="24">
                    <span>收获地址:
                        <b>2</b>
                    </span>
                </el-col>
                <el-col :span="24">
                    <span>商品规格:
                        <b>2</b>
                    </span>
                </el-col>
                <div v-if="rowData.status=='1'">
                    <el-col :span="12">
                        <span>物流公司:
                            <b>2</b>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <span>物流单号:
                            <b>2</b>
                        </span>
                    </el-col>
                    <el-col :span="24">
                        <span>物流状态:
                            <b>2</b>
                        </span>
                    </el-col>
                </div>
                <el-col :span="24">
                    <span>订单时间:
                        <b>2</b>
                    </span>
                </el-col>

            </el-row>
            <div slot="footer"
                 class="dialog-footer">
                <span v-if="rowData.status=='1'||rowData.status=='2'">
                    <el-button type="primary"
                               @click="confirm_order()">{{rowData.status=="1"?'发货':'确认'}}</el-button>

                    <el-button style="display:inline-block;margin-left:10px"
                               @click="editOrder_show=false">取消</el-button>
                </span>

            </div>
        </el-dialog>
        <!-- <div class="pagination-container">
                <el-pagination :current-page="curPage"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :page-sizes="[20]"
                               :page-size="page_size"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div> -->
    </div>

</template>
<script>
import moment from 'moment'
export default {
    data () {
        return {
            search: {
                name: '',
                status: '',
                time: ''
            },
            editOrder_show: false,
            rowData: {},
            options: [{
                value: '1',
                label: '已下单'
            }, {
                value: '2',
                label: '已发货'
            },
            {
                value: '3',
                label: '已完成'
            }],
            tableData: [{
                order: '9800882011233',
                phone: '13266578905',
                address: '金平区武侯路',
                logistics: '顺丰',
                status: "1",
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                order: '7800662011553',
                phone: '13266578905',
                address: '昌金区幸福路',
                logistics: '韵达',
                status: "2",
                date: '2016-05-04',
                name: '王中虎',
                address: '上海市普陀区金沙江路 1517 弄'
            },
            {
                order: '7800662011553',
                phone: '13266578905',
                address: '昌金区幸福路',
                logistics: '百世',
                status: "3",
                date: '2016-05-04',
                name: '王大虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }]
        }
    },
    mounted () {

    },
    methods: {
        edit (index, row) {
            console.log(row)
            this.rowData = row;
            this.editOrder_show = true
        },
        del (index, row) {
            console.log(row)
        },
        colse_rule () {

        },
        confirm_order () {
            cnnsole.log(`111`)
        },
    }
}
</script>

<style  lang="scss" scoped>
.orderManagement {
  padding: 30px 20px;
}
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.button-block {
  display: inline-block;
  .el-button {
    width: 100px;
  }
}
.demo-ruleForm {
  .el-select {
    display: block;
    position: relative;
  }
}
.form-block {
  margin-bottom: 100px;
  span {
    &:first-child {
      margin-bottom: 35px;
    }
    display: inline-block;
    width: 70px;
    margin-bottom: 20px;
  }
  .el-table th {
    padding: 8px 0;
  }

  /deep/ .el-pagination {
    white-space: nowrap;
    background: #fff;
    padding: 32px 16px;
    color: #303133;
    font-weight: 700;
  }
  /deep/ .el-button--success {
    background-color: #56a962;
    &:hover {
      background-color: #43b556;
    }
  }
  /deep/.el-button--primary {
    background-color: #428fda;
    &:hover {
      background-color: #65acf5;
    }
  }
  .input-width {
    width: 250px;
    margin-right: 30px;
  }
  .el-select {
    margin-right: 40px;
  }
}
.el-dialog__body {
  & > span {
    display: inline-block;
    width: 100px;
    margin-bottom: 20px;
  }

  .input-width {
    width: 200px;
    margin-right: 40px;
  }
}
.dialog-footer {
  text-align: center;
}
.el-col-12 {
  margin-bottom: 20px;
  width: 43.5%;
  span {
    display: inline-block;
    margin-right: 10px;
  }
}
.el-col-24 {
  text-align: left;
  width: 475px;
  margin: 15px 0 15px 70px;
}
.mt-40 {
  margin-top: 40px;
}
.mb-40 {
  margin-bottom: 40px;
}
/deep/ .el-table .cell {
  text-align: center;
}
/deep/ .el-dialog__body {
  text-align: center;
}
/deep/ .el-table {
  text-align: center;
  margin: 0 auto;
}
/deep/ .el-table .cell {
  text-align: center;
}

/deep/.form-block {
  margin-bottom: 30px;
}
/deep/ .el-table tr {
  cursor: pointer;
}
/deep/.el-form-item {
  width: 350px;
  display: inline-block;
}
</style>

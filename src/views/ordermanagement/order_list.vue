<template>
    <div class="containerPublic orderManagement">
        <div class="form-block">
            <!-- v-model.trim 自动过滤前后空格 -->
            <span>订单编号:</span>
            <el-input class="input-width"
                      v-model="search.order_number"></el-input>
            <span>商品状态:</span>
            <el-select v-model="search.order_status"
                       placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
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
            <el-table-column prop="order_number"
                             label="订单号">
            </el-table-column>
            <el-table-column prop="receive_person"
                             label="收件人">
            </el-table-column>
            <el-table-column prop="receive_phone"
                             label="联系方式">
            </el-table-column>
            <el-table-column prop="receive_address"
                             label="地址">
            </el-table-column>
            <el-table-column prop="logistics_company"
                             label="物流公司">
            </el-table-column>
            <el-table-column prop="logistics_number"
                             label="物流号">
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    {{scope.row.order_status=="1"?'未出货':scope.row.order_status=="2"?'已出货':'已完成'}}
                </template>
            </el-table-column>
            <el-table-column prop="addtimeStr"
                             label="建立时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success"
                               v-on:click="edit(scope.$index, scope.row)"
                               size="small">查看</el-button>

                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="订单详情"
                   :close-on-click-modal="false"
                   center
                   @close="colse_rule('ruleForm')"
                   :visible.sync="editOrder_show">
            <el-row>
                <el-col :span="12">
                    <span>订单编号:</span>
                    <b>{{rowData.order_number}}</b>
                </el-col>
                <el-col :span="12">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;收货人:</span>
                    <b>{{rowData.receive_person}}</b>
                </el-col>
                <el-col :span="12">
                    <span>联系电话:</span>
                    <b>{{rowData.receive_phone}}</b>
                </el-col>
                <el-col :span="12">
                    <span>收货地址:</span>
                    <b>{{rowData.receive_address}}</b>
                </el-col>
                <el-col :span="12">
                    <span>邮编:</span>
                    <b>{{rowData.postcode}}</b>
                </el-col>
                <div v-if="rowData.order_status=='2'">
                    <el-col :span="12">
                        <span>物流公司: </span>
                        <b>{{rowData.logistics_company}}</b>
                    </el-col>
                    <el-col :span="12">
                        <span>物流单号:</span>
                        <b>{{rowData.logistics_number}}</b>
                    </el-col>
                    <el-col :span="12">
                        <span>订单状态:</span>
                        <b v-if="rowData.order_status=='1'">未发货</b>
                        <b v-else>已发货</b>
                    </el-col>
                </div>
                <el-col :span="12">
                    <span>订单时间:</span>
                    <b>{{rowData.addtimeStr}}</b>
                </el-col>
                <el-col :span="24">
                    <span>订单备注:</span>
                    <b>{{rowData.remarks}}</b>
                </el-col>
                <el-col :span="24">
                    <div v-show="rowData.order_status=='1'">
                        <el-form :model="ruleForm"
                                 :rules="rules"
                                 ref="ruleForm"
                                 label-width="100px"
                                 class="demo-ruleForm">
                            <el-form-item label="物流公司:"
                                        
                                          prop="logistics_company">
                                <el-input v-model="ruleForm.logistics_company"></el-input>
                            </el-form-item>
                            <el-form-item label="物流单号:"
                                          prop="logistics_number">
                                <el-input v-model="ruleForm.logistics_number"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>

            </el-row>
            <div slot="footer"
                 class="dialog-footer">
                <span v-if="rowData.order_status=='1'">
                    <el-button type="primary"
                               @click="confirm_order('ruleForm')">{{rowData.order_status=="1"?'发货':'确认'}}</el-button>

                    <el-button style="display:inline-block;margin-left:10px"
                               @click="editOrder_show=false">取消</el-button>
                </span>

            </div>
        </el-dialog>
        <div class="pagination-container">
            <el-pagination :current-page="curPage"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :page-sizes="[20]"
                           :page-size="page_size"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>

</template>
<script>
import moment from 'moment'
import { getOrder, editOrder } from '@/api/order'
import { resolve } from 'q';
export default {
    data () {
        return {
            curPage: 1,
            page_size: 20,
            total: 0,
            search: {
                order_number: '',
                order_status: ''
            },
            ruleForm: {
                logistics_number: '',
                logistics_company: '',
            },
            rules: {
                logistics_number: [
                    { required: true, message: '请输入物流单号', trigger: 'blur' },
                    { min: 1, max: 24, message: '长度在 1 到 24 个字符', trigger: 'blur' }
                ],
                logistics_company: [
                    { required: true, message: '请选择物流公司', trigger: 'blur' },
                    { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
                ]
            },
            editOrder_show: false,
            options: [{
                value: '1',
                label: '未出货'
            }, {
                value: '2',
                label: '已出货'
            }],
            tableData: [],
            rowData: {}
        }
    },
    mounted () {
        this.getInfo()
    },
    methods: {
        getInfo () {
            let params = {
                page_index: this.curPage,
                page_size: this.page_size,
                total: this.total,
                order_number: this.search.order_number,
                order_status: this.search.order_status == '' ? 0 : this.search.order_status
            }
            return new Promise((resolve, reject) => {
                getOrder(params).then(res => {
                    const data = res.data
                    if (data.Result) {
                        this.tableData = data.Data
                        this.total = res.data.PageInfo.TotalCount;
                    } else {
                        this.$message.error(data.Message)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        edit (index, row) {
            console.log(row)
            this.rowData = row;
            this.editOrder_show = true
        },
        colse_rule (formName) {
            this.$refs[formName].resetFields();
        },
        confirm_order (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        order_status: 2,
                        id: this.rowData.id,
                        logistics_number: this.ruleForm.logistics_number,
                        logistics_company: this.ruleForm.logistics_company
                    }
                    return new Promise((resolve, reject) => {
                        editOrder(params).then(res => {
                            const data = res.data
                            if (data.Result) {
                                this.editOrder_show = false
                                this.$message.success('出货成功')
                                this.getInfo()
                            } else {
                                this.$message.error(data.Message)
                            }
                        }).catch(error => {
                            reject(error)
                        })
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetSearchForm () {
            this.curPage = 1
            this.search.order_number = ''
            this.search.order_status = ''
            this.rowData = {}
            this.getInfo()
        },
        // 每页显示条数操作
        handleSizeChange (val) {
            this.page_size = val
            this.curPage = 1
            this.getInfo()
        },
        // 分页操作
        handleCurrentChange (val) {
            this.curPage = val
            this.getInfo()
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
  width: 46.5%;
  text-align: left;
  span {
    display: inline-block;
    margin-right: 10px;
  }
}
.el-col-24 {
  text-align: left;
  //   margin: 15px 0 15px 100px;
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

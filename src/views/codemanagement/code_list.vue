<template>
    <div class="containerPublic ticket_idManagement">
        <div class="form-block">
            <!-- v-model.trim 自动过滤前后空格 -->
            <span>名称:</span>
            <el-input class="input-width"
                      v-model="search.ticket_id_number"></el-input>
            <div class="button-block"
                 style="display: inline-block;margin-left: 30px;">
                <el-button type="primary"
                           size="medium"
                           @click="curPage=1;getInfo ()">搜索</el-button>
                <el-button type="danger"
                           size="medium"
                           @click="newAddticket_id_show=true">新建</el-button>
                <el-button type="info"
                           size="medium"
                           @click="resetSearchForm()">重置</el-button>

            </div>
        </div>
        <el-dialog title="二维码新增"
                   :close-on-click-modal="false"
                   center
                   @close="colse_rule('ruleForm')"
                   :visible.sync="newAddticket_id_show">
            <h3>二维码生成信息</h3>
            <el-form :model="ruleForm"
                     :rules="rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="选择客户"
                              prop="t_customer_name_id">
                    <el-select v-model="ruleForm.t_customer_name_id"
                               filterable
                               placeholder="请选择客户">
                        <el-option v-for="item in customer_static"
                                   :key="item.id"
                                   :label="item.label"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择卡券"
                              prop="ticket_id">
                    <el-select v-model="ruleForm.ticket_id"
                               filterable
                               placeholder="请选择卡券">
                        <el-option v-for="item in coupons_static"
                                   :key="item.id"
                                   :label="item.label"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择商品">
                    <el-select v-model="ruleForm.goods_ids "
                               multiple
                               filterable
                               placeholder="请选择商品">
                        <el-option v-for="item in goods_static"
                                   :key="item.id"
                                   :label="item.label"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择背景图"
                              prop="bgimg_id">
                    <el-select v-model="ruleForm.bgimg_id"
                               filterable
                               placeholder="请选择背景图">
                        <el-option v-for="item in bgimg_static"
                                   :key="item.id"
                                   :label="item.label"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效日期"
                              style="width: 88%;"
                              prop="date">
                    <el-date-picker v-model="ruleForm.date"
                                    type="daterange"
                                    style="width: 100%;"
                                    value-format="yyyy-MM-dd"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <span>
                    <el-button type="primary"
                               @click="confirm_ticket_id('ruleForm')">确定</el-button>
                    <el-button style="display:inline-block;margin-left:10px"
                               @click="newAddticket_id_show=false">取消</el-button>
                </span>
            </div>
        </el-dialog>
        <el-table :data="tableData"
                  style="width: 100%"
                  stripe
                  :header-cell-style="{textAlign:'center',background: '#f5f5f5',height: '40px',color:'#555555'} "
                  :cell-style="{textAlign: 'center'}">
            <el-table-column width="60"
                             height="60"
                             label="图片">
                <template slot-scope="scope">
                    <el-popover placement="right"
                                :open-delay="300"
                                transition="fade-in-linear"
                                trigger="hover"
                                v-if="scope.row.qrcode_img"
                                style="text-align:center">
                        <div style="width:150px;height:150px;display:flex; align-items: center;justify-content: center">
                            <img :src="process+scope.row.qrcode_img"
                                 style="width:120px;height:120px">
                        </div>
                        <span slot="reference"><img style="width:40px;height:40px"
                                 :src="process+scope.row.qrcode_img"></span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="ticket_name"
                             label="卡券名称">
            </el-table-column>
            <el-table-column prop="customer_name"
                             label="客户数量">
            </el-table-column>
            <el-table-column prop="customer_count"
                             label="客户数量">
            </el-table-column>
            <el-table-column prop="goods_count"
                             label="商品数量">
            </el-table-column>
            <el-table-column prop="backgroundimg_name"
                             label="背景图名称">
            </el-table-column>
            <el-table-column prop="addtimeStr"
                             label="创建时间">
            </el-table-column>
            <el-table-column prop="order_number"
                             label="操作">
                <template slot-scope="scope">
                    <el-button type="danger"
                               v-on:click="DelEcode( scope.row)"
                               size="small">删除</el-button>
                    <el-button type="success"
                               v-on:click="ImportExcel(scope.row)"
                               size="small">导出</el-button>
                </template>
            </el-table-column>
        </el-table>

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
import moment from 'moment';
import { GetTCustomerNameAll } from '@/api/customer';
import { GetTTicketAll } from '@/api/coupons';
import { GetTGoodsAll } from '@/api/goods';
import { geteCodeList, addEcode, delEcode, excelApi } from '@/api/ecode';
import { getTBgimgAll } from '@/api/backgroundmap';
import { reject } from 'q';

export default {
    name: "",
    data () {
        return {
            curPage: 1,
            page_size: 20,
            total: 0,
            search: {
                ticket_id_number: '',
            },
            ruleForm: {
                date: [],
                bgimg_id: '',
                goods_ids: [],
                ticket_id: '',
                t_customer_name_id: ''
            },
            pickerOptions: {

            },
            process: null,
            rules: {
                date: { required: true, message: '请选择日期', trigger: 'change' },
                t_customer_name_id: [
                    { required: true, message: '请选择客户', trigger: 'change' }
                ],
                ticket_id: [
                    { required: true, message: '请选择卡券', trigger: 'change' }
                ],

                bgimg_id: [
                    { required: true, message: '请选择背景图', trigger: 'change' }
                ],

            },
            tableData: [],
            newAddticket_id_show: false,
            rowData: {},
            customer_static: [],
            coupons_static: [],
            bgimg_static: [],
            goods_static: []
        }
    },
    mounted () {
        this.getInt()
        this.getInfo()
    },
    methods: {
        getInt () {
            // 客户
            GetTCustomerNameAll().then(res => {
                const data = res.data
                // console.log('客户', data)
                if (data.Result) {
                    data.Data.forEach(item => {
                        this.customer_static.push({
                            id: item.id,
                            label: item.customer_name
                        })
                    })
                } else {
                    this.$message.error(data.Message)
                }
            })
            // 卡券
            GetTTicketAll().then(res => {
                const data = res.data
                // console.log('卡券', data)
                if (data.Result) {
                    data.Data.forEach(item => {
                        this.coupons_static.push({
                            id: item.id,
                            label: item.ticket_name
                        })
                    })
                } else {
                    this.$message.error(data.Message)
                }
            })
            // 商品
            GetTGoodsAll().then(res => {
                const data = res.data
                // console.log('商品', data)
                if (data.Result) {
                    data.Data.forEach(item => {
                        this.goods_static.push({
                            id: item.id,
                            label: item.goods_name
                        })
                    })
                } else {
                    this.$message.error(data.Message)
                }
            })
            // 背景图
            getTBgimgAll().then(res => {
                const data = res.data
                // console.log('背景图', data)
                if (data.Result) {
                    data.Data.forEach(item => {
                        this.bgimg_static.push({
                            id: item.id,
                            label: item.bg_name
                        })
                    })
                } else {
                    this.$message.error(data.Message)
                }
            })
        },
        getInfo () {
            let params = {
                page_index: this.curPage,
                page_size: this.page_size,
                total: this.total,
                ticket_name: this.search.ticket_name,
                // 判断当前搜索时间数组长度
            }
            return new Promise((resolve, reject) => {
                geteCodeList(params).then(res => {
                    const data = res.data
                    if (data.Result) {
                        console.log(res)
                        this.process = process.env.BASE_API
                        this.total = res.data.PageInfo.TotalCount;
                        this.tableData = data.Data
                    } else {
                        this.$message(data.Message)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        confirm_ticket_id (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleForm)
                    let params = {
                        t_customer_name_id: this.ruleForm.t_customer_name_id,
                        bgimg_id: this.ruleForm.bgimg_id,
                        ticket_id: this.ruleForm.ticket_id,
                        goods_ids: this.ruleForm.goods_ids,
                        start_time: this.ruleForm.date[0],
                        end_time: this.ruleForm.date[1]
                        // 判断当前搜索时间数组长度
                    }
                    console.log(params)
                    return new Promise((resolve, reject) => {
                        addEcode(params).then(res => {
                            const data = res.data
                            if (data.Result) {
                                console.log(res)
                                this.newAddticket_id_show = false
                                this.$message.success("增加成功")
                                this.getInfo()
                            } else {
                                this.$message(data.Message)
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
        DelEcode (row) {
            this.$confirm('此操作将永久删除该券码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return new Promise((resolve, reject) => {
                    delEcode({ id: row.id }).then(res => {
                        const data = res.data
                        console.log(data)
                        if (data.Result) {
                            this.getInfo();
                            this.$message.success(data.Message)
                        } else {
                            this.$message.error(data.Message)
                        }
                    }).catch(error => {
                        reject(error)
                    })
                })
            }).catch(() => {
                return
            })
        },
        ImportExcel (row) {
            return new Promise((resolve, reject) => {
                excelApi(row).then(res => {
                    console.log(res);
                    if (res.data) {
                        window.location.href = process.env.BASE_API + res.data;
                        this.$message.success("导出Excel成功！");
                        var alink = document.createElement("a");
                        alink.href = process.env.BASE_API + row.qrcode_img;
                        alink.download = "二维码";
                        alink.click();
                    } else {
                        this.$message.error("无导出！");
                    }
                    // resolve();
                })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        colse_rule (formName) {
            this.$refs[formName].resetFields();
            this.ruleForm.goods_ids = []
        },

        resetSearchForm () {
            this.search.ticket_id_number = ''
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
.ticket_idManagement {
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
 
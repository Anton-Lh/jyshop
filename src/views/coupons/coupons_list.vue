<template>
    <div class="containerPublic assetManagement">
        <div class="form-block">
            <!-- v-model.trim 自动过滤前后空格 -->
            <span>名称:</span>
            <el-input class="input-width"
                      v-model="search.name"></el-input>

            <div class="button-block"
                 style="display: inline-block;margin-left: 30px;">
                <el-button type="primary"
                           size="medium"
                           @click="curPage=1;getInfo ()">搜索</el-button>
                <el-button type="info"
                           size="medium"
                           @click="resetSearchForm()">重置</el-button>
                <el-button type="danger"
                           size="medium"
                           @click="newAddassets_show=true">新建卡券</el-button>
            </div>

        </div>
        <el-dialog :title="coupons_title"
                   :close-on-click-modal="false"
                   center
                   @close="colse_rule('ruleForm')"
                   :visible.sync="newAddassets_show">
            <el-form :model="ruleForm"
                     :rules="rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm ">

                <el-form-item label="名称"
                              class="couponstype"
                              prop="ticket_name">
                    <el-input placeholder="价格就是名称,例：300"
                              v-model.trim="ruleForm.ticket_name"></el-input>
                </el-form-item>
                <el-form-item label="产品"
                              class="couponstype"
                              prop="goods_ids">
                    <el-select v-model="ruleForm.goods_ids"
                               filterable
                               multiple
                               @change="handeltype"
                               style="width: 250px;"
                               placeholder="请选择类型">
                        <el-option v-for="item in goodsAll"
                                   :key="item.id"
                                   :label="item.goods_name"
                                   :value="item.id"></el-option>

                    </el-select>
                </el-form-item>

            </el-form>
            <el-table :data="goods_list"
                      stripe
                      class="goodstable"
                      style="width: 100%">
                <el-table-column prop="name"
                                 label="已选产品">
                </el-table-column>
            </el-table>
            <div slot="footer"
                 class="dialog-footer">
                <span v-if="coupons_status=='1'">
                    <el-button type="primary"
                               @click="submitNewassets(1,'ruleForm')">确定</el-button>
                </span>
                <span v-else>
                    <el-button type="primary"
                               @click="submitPreservation(2,'ruleForm')">保存</el-button>
                </span>
                <el-button style="display:inline-block;margin-left:10px"
                           @click="newAddassets_show=false">取消</el-button>
            </div>
        </el-dialog>

        <el-table :data="tableData"
                  style="width: 100%"
                  stripe
                  :header-cell-style="{textAlign:'center',background: '#f5f5f5',height: '40px',color:'#555555'} "
                  :cell-style="{textAlign: 'center'}">

            <el-table-column prop="id"
                             label="序号">
            </el-table-column>
            <el-table-column prop="ticket_name"
                             label="卡券名称">
            </el-table-column>
            <el-table-column prop="goods_count"
                             label="商品总数">
            </el-table-column>
            <el-table-column prop="addtime"
                             label="创建时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success"
                               v-on:click="edit(scope.$index, scope.row)"
                               size="small">编辑</el-button>
                    <el-button type="danger"
                               v-on:click="del(scope.$index, scope.row)"
                               size="small">删除</el-button>
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
// 时间戳过滤
import moment from 'moment'
import { getCoupons, delCoupons, addCoupons, editCoupons } from '@/api/coupons'
import { allGoods, tikcetGoods } from '@/api/goods'
import { resolve, reject } from 'q';

export default {
    name: 'coupons_list',
    data () {
        return {
            curPage: 1,
            page_size: 20,
            total: 0,
            coupons_title: '卡券新增',
            coupons_status: '1',
            goods_list: [],
            tableData: [],
            ruleForm: {
                ticket_name: '',
                goods_ids: [],
            },
            rules: {
                ticket_name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                ],
                goods_ids: [
                    { required: true, message: '请选择产品', trigger: 'change' },
                ],
            },
            goodsAll: [],
            rowData: {},
            newAddassets_show: false,
            search: {
                name: '',
            }
        }
    },
    filters: {
        formatTime (val) {
            if (val == 0) return ""
            return moment(val).format('YYYY-MM-DD HH:mm:ss')
        },
        // 截取字符
        subStr (val) {
            return val.substring(val.lastIndexOf('/') + 1)
        }
    },
    created () {
        this.getInt()
        this.getInfo()
    },
    methods: {
        getInt () {
            allGoods({ goods_name: '' }).then(res => {
                let Data = res.data.Data
                Data.forEach(item => {
                    this.goodsAll.push({
                        id: item.id,
                        goods_name: item.goods_name
                    })
                })

            })
        },
        getInfo () {
            let params = {
                page_index: this.curPage,
                page_size: this.page_size,
                total: this.total,
                ticket_name: this.search.name,
                // 判断当前搜索时间数组长度
            }
            return new Promise((resolve, reject) => {
                getCoupons(params).then(res => {
                    const data = res.data;
                    if (data.Result) {
                        this.tableData = res.data.Data;
                        this.total = res.data.PageInfo.TotalCount;
                    } else {
                        this.$message.error(data.Message)
                    }
                }).catch(error => {
                    reject(error)
                })
            })


        },
        resetSearchForm () {
            this.search = {
                name: '',
            }
            this.curPage = 1
            this.getInfo();
        },
        handeltype (val) {
            console.log(val)
            this.goods_list = []
            val.forEach(it => {
                this.goodsAll.forEach(item => {
                    if (it == item.id) {
                        this.goods_list.push({ name: item.goods_name })
                    }
                })
            })
        },
        async edit (index, row) {
            // this.rowData = {};
            // this.rowData = row;
            const res = await tikcetGoods({ id: row.id })
            if (res.data.Result) {
                this.rowData = row
                let data = res.data.Data
                this.coupons_title = '卡券编辑'
                this.coupons_status = '2'
                this.ruleForm.ticket_name = row.ticket_name;
                data.forEach(item => {
                    this.ruleForm.goods_ids.push(item.id)
                    this.goods_list.push({ name: item.goods_name })
                })
                //  goods_ids
                this.newAddassets_show = true
            }

        },
        del (index, row) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return new Promise((resolve, reject) => {
                    delCoupons(row).then(res => {
                        const data = res.data
                        if (data.Result) {
                            this.getInfo();
                            this.$message.success(data.Message)
                        } else {
                            this.$message.error(data.Message)
                        }
                        resolve()
                    })
                        .catch(error => {
                            reject(error)
                        })
                })
            }).catch(() => {
                return
            })
        },
        submitNewassets (type, formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        ticket_name: this.ruleForm.ticket_name,
                        goods_ids: this.ruleForm.goods_ids
                    }
                    return new Promise((resolve, reject) => {
                        addCoupons(data).then(res => {
                            const data = res.data
                            if (data.Result) {
                                this.getInfo();
                                this.newAddassets_show = false
                                this.$message.success('添加成功')
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
        submitPreservation (type, formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        id: this.rowData.id,
                        ticket_name: this.ruleForm.ticket_name,
                        goods_ids: this.ruleForm.goods_ids
                    }
                    return new Promise((resolve, reject) => {
                        editCoupons(data).then(res => {
                            const data = res.data
                            if (data.Result) {
                                this.getInfo();
                                this.newAddassets_show = false
                                this.$message.success('编辑成功')
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


        colse_rule (formName) {
            this.$refs[formName].resetFields();
            this.rowData = {}
            this.coupons_title = '卡券新增'
            this.coupons_status = '1'
            this.ruleForm.ticket_name = ''
            this.ruleForm.goods_ids = []
            this.goods_list = []
        },

    }
}

</script>
<style   rel="stylesheet/scss" lang="scss" scoped>
.assetManagement {
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
.row-bg {
  margin-bottom: 30px;
}
.el-col-12 {
  margin-bottom: 20px;
  width: 43.5%;
  span {
    display: inline-block;
    margin-right: 10px;
  }
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
.goodstable {
  max-height: 300px;
  overflow: auto;
}
/deep/.couponstype {
  .el-form-item__content {
    height: 41px;
    overflow-x: hidden;
  }
}
</style>
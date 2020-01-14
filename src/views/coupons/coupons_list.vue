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
        <el-dialog title="卡券新增"
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
                              prop="name">
                    <el-input placeholder="价格就是名称,例：300"
                              v-model.trim="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="产品"
                              prop="type">
                    <el-select v-model="ruleForm.type"
                               multiple
                               @change="handeltype"
                               style="width: 250px;"
                               placeholder="请选择类型">
                        <el-option label="固定资产"
                                   value="固定资产"></el-option>
                        <el-option label="耗品"
                                   value="耗品"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <span>
                    <el-button type="primary"
                               @click="submitNewassets(2,'ruleForm')">确定</el-button>
                </span>

                <el-button style="display:inline-block;margin-left:10px"
                           @click="newAddassets_show=false">取消</el-button>
            </div>
        </el-dialog>

        <!-- <el-dialog :title="cartitle"
                   :close-on-click-modal="false"
                   center
                   @close="colse_rule2('ruleForm2')"
                   :visible.sync="confrim_assets_detail_show">
            <el-row style="margin-left: 50px;margin-bottom: 10px;">
                <el-col :span="12">
                    <span>编号:</span>
                    <b>{{rowData.ref}}</b>
                </el-col>
                <el-col :span="12">
                    <span>名称:</span>
                    <b>{{rowData.name}}</b>
                </el-col>
                <el-col :span="12">
                    <span>类型:</span>
                    <b>{{rowData.type_value}}</b>
                </el-col>
                <el-col :span="12">
                    <span>类别:</span>
                    <b>{{rowData.category}}</b>
                </el-col>
                <el-col :span="12">
                    <span>规格:</span>
                    <b>{{rowData.spec}}</b>
                </el-col>
                <el-col :span="12">
                    <span>颜色:</span>
                    <b>{{rowData.color}}</b>
                </el-col>

            </el-row>

            <div slot="footer"
                 v-if="rowData.status==1"
                 class="dialog-footer">
                <el-button type="primary"
                           @click="confirmStorage('ruleForm2')">入库</el-button>
                <el-button type="default"
                           @click="confrim_assets_detail_show=false">取消</el-button>
            </div>
        </el-dialog> -->
        <!-- 图片预览 -->
        <!-- <el-dialog :visible.sync="dialogVisible_pic"
                   style="text-align:center;"
                   size="tiny">
            <img :src="dialogImageUrl"
                 alt="">
        </el-dialog> -->
        <el-table :data="tableData"
                  style="width: 100%"
                  stripe
                  :header-cell-style="{textAlign:'center',background: '#f5f5f5',height: '40px',color:'#555555'} "
                  :cell-style="{textAlign: 'center'}"
                  @row-click="handleNum">

            <el-table-column prop="id"
                             label="序号">
            </el-table-column>
            <el-table-column prop="name"
                             label="卡券名称">
            </el-table-column>
            <el-table-column prop="account"
                             label="产品名称">
            </el-table-column>
            <el-table-column prop="addtime"
                             label="创建时间">
            </el-table-column>

        </el-table>
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
// 时间戳过滤
import moment from 'moment'
import { getList } from '@/api/user'
// import { getassets, getassetslist, postassetslist, putassetsWarehousing, putsubmitWarehousing } from '../../request'
export default {
    name: 'assetManagement',

    data () {
        return {
            curPage: 1,
            page_size: 20,
            total: 0,
            base_status: [],
            base_supplier: [],
            base_type: [],
            base_category: [],
            tableData: [],
            base_location: [],
            dialogImageUrl: '',
            totalPrice: 0,
            permission_button: {},
            ruleForm: {
                name: '',
                type: '',

                fileList: []
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择产品', trigger: 'change' },
                ],
            },

            dialogVisible_pic: false,

            options: [{
                value: '1',
                label: '已确认'
            }, {
                value: '2',
                label: '待确认'
            }],
            rowData: {},
            newAddassets_show: false,
            confrim_assets_detail_show: false,
            cartitle: '',
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
        this.getInfo()
        // this.getInt()
    },
    methods: {
        getInt () {

        },
        getInfo () {
            let params = {
                page: this.curPage,
                page_size: this.page_siz,
                total: this.total,
                name: this.search.name,
                // 判断当前搜索时间数组长度
            }
            getList(params).then(res => {
                if (res.status == 200) {
                    this.tableData = res.data.Data
                    console.log(`成功数据`, this.tableData)

                }
            })
            // getassetslist(params).then(res => {
            //     if (res.error == 0) {
            //         console.log(`列表`, res)
            //         this.tableData = res.data.data
            //         this.permission_button = res.data.permission_button
            //         this.total = res.data.total
            //     }

            // })


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
        },
        addNewassets (type, formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(type, this.ruleForm)
                    let params = {
                        save_type: type,
                        ref: this.ruleForm.ref,
                        name: this.ruleForm.name,
                        type: this.ruleForm.type == "固定资产" ? 1 : 2,
                        category: this.ruleForm.category,
                        spec: this.ruleForm.spec,
                        color: this.ruleForm.color,
                    }
                    console.log(params)



                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitNewassets (type, formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        save_type: type,
                        name: this.ruleForm.name,
                        type: this.ruleForm.type
                        // type: this.ruleForm.type == "固定资产" ? 1 : 2,
                    }
                    console.log(`data`, data)
                    // putsubmitWarehousing({ id: this.rowData.id, data }).then(res => {
                    //     if (res.error == 0) {
                    //         console.log(res)
                    //         this.getInfo()
                    //         this.newAddassets_show = false
                    //     }
                    // })


                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        confirmStorage (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleForm2)
                    let _flag = false
                    if (this.ruleForm2.purchase_quantity == 0) {
                        this.$message.warning('采购数量不可为0')
                        _flag = true
                    }
                    if (!_flag) {
                        let data = {
                            asset_location_id: this.ruleForm2.asset_location_id,
                            supplier_contacts: this.ruleForm2.supplier_contacts,
                            supplier: this.ruleForm2.supplier,
                            supplier_phone: this.ruleForm2.supplier_phone,
                            purchase_at: this.ruleForm2.purchase_at / 1000,
                            purchase_quantity: this.ruleForm2.purchase_quantity,
                            purchase_price: this.ruleForm2.purchase_price
                        }
                        console.log(data)
                        // putassetsWarehousing({ id: this.rowData.id, data }).then(res => {
                        //     if (res.error == 0) {
                        //         this.getInfo()
                        //         this.confrim_assets_detail_show = false
                        //         this.$message.success("入库成功")
                        //     }
                        // })
                    }

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
            this.ruleForm.spec = ""
            this.ruleForm.color = ""
            this.ruleForm.ref = ""
            this.ruleForm.name = ""
            this.ruleForm.type = ""
            this.ruleForm.category = ""
            this.ruleForm.fileList = []
            this.rowData = {}
        },
        colse_rule2 (formName) {
            this.$refs[formName].resetFields();
            this.totalPrice = 0
            this.ruleForm2.purchase_at = ''
        },
        handleNum (row) {
            this.rowData = {};
            this.rowData = row;
            if (row.status == 0) {
                this.newAddassets_show = true
                this.ruleForm.ref = this.rowData.ref
                this.ruleForm.name = this.rowData.name
                this.ruleForm.type = this.rowData.type_value
                this.ruleForm.category = this.rowData.category
                this.ruleForm.spec = this.rowData.spec
                this.ruleForm.color = this.rowData.color
                this.newAddassets_show = true


            } else {
                this.confrim_assets_detail_show = true
            }
            this.cartitle = row.status == 0 ? "新建入库" : '入库详情'
            console.log(`111`, row)
            if (row.status == 1) {
                this.totalPrice = row.purchase_quantity * row.purchase_price
            }

            // let params = row.id
            // console.log("查看接单状态", this.rowData.shipment_info);
        }
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
</style>
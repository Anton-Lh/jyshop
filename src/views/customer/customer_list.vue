<template>
    <div class="containerPublic assetManagement">
        <div class="form-block">
            <!-- v-model.trim 自动过滤前后空格 -->

            <span>状态:</span>
            <el-select v-model="search.status"
                       placeholder="请选择">
                <el-option v-for="item in base_status"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key">
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
                <el-button type="danger"
                           size="medium"
                           @click="newAddassets_show=true">新增客户</el-button>
            </div>

        </div>
        <el-dialog title="客户新增"
                   :close-on-click-modal="false"
                   center
                   @close="colse_rule('ruleForm')"
                   :visible.sync="newAddassets_show">
            <el-form :model="ruleForm"
                     :rules="rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="客户名称"
                              prop="name">
                    <el-input placeholder="请输入名称"
                              v-model.trim="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="客户数量"
                              prop="number">
                    <el-input placeholder="请输入数量"
                              type="number"
                              v-model.trim="ruleForm.number"></el-input>
                </el-form-item>
            </el-form>

            </el-table>

            <div slot="footer"
                 class="dialog-footer">
                <span>
                    <el-button type="primary"
                               @click="submitNewassets('ruleForm')">确定</el-button>
                </span>

                <el-button style="display:inline-block;margin-left:10px"
                           @click="newAddassets_show=false">取消</el-button>
            </div>
        </el-dialog>

        <el-table :data="tableData"
                  style="width: 100%"
                  stripe
                  :header-cell-style="{textAlign:'center',background: '#f5f5f5',height: '40px',color:'#555555'} "
                  :cell-style="{textAlign: 'center'}"
                  @row-click="handleNum">
            <el-table-column prop="name"
                             label="客户名称">
            </el-table-column>
            <el-table-column prop="account"
                             label="账号">
            </el-table-column>
            <el-table-column prop="password"
                             label="密码">
            </el-table-column>
            <el-table-column prop="status"
                             label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==0">未兑换</span>
                    <span v-else>已兑换</span>
                </template>
            </el-table-column>
            <el-table-column prop="account"
                             label="收货地址">
            </el-table-column>
            <el-table-column prop="addtime"
                             label="注册时间">
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
import { getList, addList } from '@/api/user'

export default {
    name: 'assetManagement',

    data () {
        return {
            curPage: 1,
            page_size: 20,
            total: 0,
            base_status: [],
            tableData: [],
            dialogImageUrl: '',
            ruleForm: {
                name: '',
                number: ''
            },
            rules: {
                name: [
                    { required: true, message: '名称不可为空', trigger: 'blur' }
                ],
                number: [
                    { required: true, message: '数量不可以为空', trigger: 'blur' }
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
            search: {
                status: '',
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
                    console.log(`成功数据`, res.data)

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
                status: '',
            }
            this.curPage = 1
            this.getInfo();
        },
        handeltype (val) {
            console.log(val)
        },

        submitNewassets (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        name: this.ruleForm.name,
                        number: this.ruleForm.number,

                    }
                    console.log(`data`, data)
                    addList(data).then(res => {
                        if (res.status == 200) {
                            console.log('成功的数据', res)
                            this.newAddassets_show = false
                            this.getInfo();
                        }
                    })
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
            // let _flag = false
            // this.ruleForm.name.forEach(item => {
            //     if (item.username == "") {
            //         this.$message.closeAll()
            //         this.$message.warning('客户名称不能为空')
            //         _flag = true
            //     }

            // })
            // if (!_flag) {
            //     console.log(this.ruleForm.name)
            // }
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
            this.ruleForm.name = ""
            this.ruleForm.number = ""
            this.rowData = {}
        },

        handleNum (row) {
            this.rowData = {};
            console.log(`111`, row)
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
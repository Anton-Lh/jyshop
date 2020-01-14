<template>
    <div class="containerPublic assetManagement">
        <div class="form-block">
            <!-- v-model.trim 自动过滤前后空格 -->

            <span>背景图名称:</span>
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
                           @click="newAddassets_show=true">新增背景</el-button>
            </div>

        </div>
        <el-dialog title="新增背景图"
                   :close-on-click-modal="false"
                   center
                   @close="colse_rule('ruleForm')"
                   :visible.sync="newAddassets_show">
            <el-form :model="ruleForm"
                     :rules="rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="首页背景"
                              prop="pic_name">
                    <el-input placeholder="请输入名称"
                              v-model.trim="ruleForm.pic_name"></el-input>
                </el-form-item>
                <el-form-item label="首页背景"
                              prop="homepic">
                    <div class="imgBox">
                        <el-upload class="avatar-uploader"
                                   action="https://api.doudot.cn/api/Attachment/upload"
                                   list-type="picture-card"
                                   :limit="1"
                                   :data="fileData"
                                   :file-list="fileList"
                                   :on-success="handleAvatarSuccess"
                                   :before-upload="beforeAvatarUpload"
                                   :on-preview="handlePictureCardPreview"
                                   :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <span>(建议尺寸325*640)</span>
                    </div>
                </el-form-item>
                <el-form-item label="首页轮播"
                              prop="homepiclist">

                    <div class="imgBox2">
                        <el-upload class="avatar-uploader"
                                   action="https://api.doudot.cn/api/Attachment/upload"
                                   list-type="picture-card"
                                   :limit="6"
                                   :data="fileData"
                                   :file-list="fileList"
                                   :on-success="handleAvatarSuccess"
                                   :before-upload="beforeAvatarUpload"
                                   :on-preview="handlePictureCardPreview"
                                   :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <span>最多上传6张(建议尺寸325*325)</span>

                    </div>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%"
                     :src="dialogImageUrl"
                     alt="">
            </el-dialog>
            <div slot="footer"
                 class="dialog-footer">
                <span>
                    <el-button type="primary"
                               @click="submitNewassets">确定</el-button>
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
                             label="序号">
            </el-table-column>
            <el-table-column prop="account"
                             label="背景图名称">
            </el-table-column>
            <el-table-column prop="password"
                             label="缩略图">
            </el-table-column>
            <el-table-column prop="status"
                             label="状态">
            </el-table-column>
            <el-table-column prop="创建时间"
                             label="注册时间">
            </el-table-column>
            <!-- @click="edit(scope.$index, scope.row)" -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <span>编辑</span>
                    <span>删除</span>
                </template>
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
import { quillConfig } from '@/utils/quill-config'
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
            fileList: [],
            fileData: {
                category: "make"
            },
            dialogVisible: false,
            ruleForm: {
                homepic: '',
                pic_name: '',
                homepiclist: []
            },
            rules: {
                homepic: [
                    { required: true, message: '请先上传首页背景', trigger: 'blur' }
                ],
                pic_name: [
                    { required: true, message: '名称不可为空', trigger: 'blur' }
                ],
                homepiclist: [
                    { required: true, message: '请先上传首页轮播图', trigger: 'blur' }
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
                status: '',
            }
            this.curPage = 1
            this.getInfo();
        },
        handeltype (val) {
            console.log(val)
        },

        submitNewassets () {
            let _flag = false
            this.ruleForm.name.forEach(item => {
                if (item.username == "") {
                    this.$message.closeAll()
                    this.$message.warning('客户名称不能为空')
                    _flag = true
                }

            })
            if (!_flag) {
                console.log(this.ruleForm.name)
            }
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
            this.hideUpload = false
            this.fileList = []
            this.ruleForm = {
                homepic: '',
                homepiclist: []
            }
            this.rowData = {}
        },

        handleNum (row) {
            this.rowData = {};
            console.log(`111`, row)
            // let params = row.id
            // console.log("查看接单状态", this.rowData.shipment_info);
        },
        // 上传图片

        handleAvatarSuccess (res, file) {
            console.log(`成功`, res)
            this.imageUrl = URL.createObjectURL(file.raw);
            // this.ruleForm.homepic = res.data.file_path;
        },
        beforeAvatarUpload (file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isJPG && !isPNG) {
                this.$message.error('请上传JPG格式图片!');
            }
            if (!isLt5M) {
                this.$message.error('上传图片大小不能超过 5MB!');
            }
            return (isJPG || isPNG) && isLt5M;
        },
        handleRemove (file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview (file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    }
}

</script>
<style   rel="stylesheet/scss" lang="scss" scoped>
.assetManagement {
  padding: 30px 20px;
}
.imgBox {
  width: 80px;
  height: 80px;
  overflow: hidden;
}
.imgBox2 {
  width: 600px;
  text-align: left;
  height: 80px;
}
.imgBox3 {
  overflow: hidden;
}
/deep/.el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  line-height: 80px;
  vertical-align: top;
}

/deep/.el-upload-list--picture-card {
  /deep/.el-upload-list__item {
    width: 80px;
    height: 80px;
  }
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
    width: 100px;
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
  display: block;
}
</style>
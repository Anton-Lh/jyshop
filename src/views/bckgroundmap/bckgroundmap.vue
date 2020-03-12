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
                        <el-upload action=''
                                   :on-change="getFile"
                                   :limit="1"
                                   :fileList="ruleForm.fileList"
                                   :before-upload="beforeAvatarUpload"
                                   :on-preview="handlePictureCardPreview"
                                   :on-remove="handleRemove"
                                   list-type="picture-card"
                                   :auto-upload="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>

                    </div>

                </el-form-item>
                <span class="txt_style">(建议尺寸1334 头部banner 250 底部 460)</span>

            </el-form>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%"
                     :src="dialogImageUrl"
                     alt="">
            </el-dialog>
            <div slot="footer"
                 class="dialog-footer">
                <span v-if="bgstatus==0">
                    <el-button type="primary"
                               @click="submitNewassets('ruleForm')">确定</el-button>
                </span>
                <span v-else>
                    <el-button type="primary"
                               @click="submitEdit('ruleForm')">编辑</el-button>
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
            <el-table-column prop="bg_name"
                             label="背景图名称">
            </el-table-column>
            <el-table-column height="60"
                             label="图片">
                <template slot-scope="scope">
                    <el-popover placement="right"
                                :open-delay="300"
                                transition="fade-in-linear"
                                trigger="hover"
                                v-if="scope.row.bg_images_url"
                                style="text-align:center">
                        <div style="width:150px;height:150px;display:flex; align-items: center;justify-content: center">
                            <img :src="process+scope.row.bg_images_url"
                                 style="width:120px;height:120px">
                        </div>
                        <span slot="reference"><img style="width:40px;height:40px"
                                 :src="process+scope.row.bg_images_url"></span>
                    </el-popover>
                </template>
            </el-table-column>
            <!-- @click="edit(scope.$index, scope.row)" -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <span @click="Editbgimg(scope.row)">编辑</span>
                    <span @click="Delbgimg(scope.row)">删除</span>
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
import { getbgimg, addbgimg, updatebgimg, delbgimg } from '@/api/backgroundmap'
export default {
    name: 'bckgroundmap',
    data () {
        return {
            curPage: 1,
            page_size: 20,
            total: 0,
            tableData: [],
            dialogImageUrl: '',
            dialogVisible: false,
            ruleForm: {
                homepic: "",
                bankimg: '',
                fileList: [],
                pic_name: '',
            },
            rules: {
                homepic: [
                    { required: true, message: '请先上传首页背景', trigger: 'blur' }
                ],
                pic_name: [
                    { required: true, message: '名称不可为空', trigger: 'blur' }
                ],
            },
            dialogVisible_pic: false,
            rowData: {},
            process: null,
            newAddassets_show: false,
            bgstatus: 0,
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
    },
    methods: {
        getInfo () {
            return new Promise((resolve, reject) => {
                getbgimg({
                    page_index: this.curPage,
                    page_size: this.page_size,
                    bg_name: this.search.name,
                }).then(res => {
                    const data = res.data;
                    if (data.Result) {
                        this.process = process.env.BASE_API
                        this.tableData = res.data.Data;
                        this.total = res.data.PageInfo.TotalCount;
                    }
                }).catch(error => {
                    reject(error);
                });
            })
        },
        resetSearchForm () {
            this.search = {
                name: '',
            }
            this.curPage = 1
            this.getInfo();
        },
        submitNewassets (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        bg_name: this.ruleForm.pic_name,
                        bg_images_url: this.ruleForm.homepic,
                    }
                    return new Promise((resolve, reject) => {
                        addbgimg(params).then(res => {
                            const data = res.data;
                            if (data.Result) {
                                this.$message.success('新增成功')
                                this.newAddassets_show = false
                                this.getInfo();
                            }
                        }).catch(error => {
                            reject(`失败的`, error);
                        });
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 点击编辑
        Editbgimg (row) {
            this.rowData = {};
            this.rowData = row
            if (this.rowData.bg_images_url != "") {
                this.bgstatus = 1
                this.ruleForm.pic_name = this.rowData.bg_name
                this.ruleForm.homepic = this.rowData.bg_images_url
                this.ruleForm.fileList = [{ name: this.rowData.bg_name, url: process.env.BASE_API + this.rowData.bg_images_url }]
            }
            this.newAddassets_show = true
        },
        // 提交编辑
        submitEdit () {
            let params = {
                id: this.rowData.id,
                bg_name: this.ruleForm.pic_name,
                bg_images_url: this.ruleForm.homepic,
            }
            return new Promise((resolve, reject) => {
                updatebgimg(params).then(res => {
                    const data = res.data;
                    if (data.Result) {
                        this.$message.success('编辑成功')
                        this.newAddassets_show = false
                        this.getInfo();
                    }
                }).catch(error => {
                    reject(`失败的`, error);
                });
            })
        },
        // 点击删除
        Delbgimg (row) {
            this.$confirm('此操作将永久删除该背景图, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return new Promise((resolve, reject) => {
                    delbgimg(row)
                        .then(res => {
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
            this.newAddassets_show = false
            this.ruleForm.fileList = []
            this.ruleForm.homepic = ''
            this.ruleForm.pic_name = ''
            this.bgstatus = 0
            this.rowData = {}
        },

        // 上传图片
        getFile (file, fileList) {
            if (this.beforeAvatarUpload(file)) {
                this.getBase64(file.raw).then(res => {
                    this.ruleForm.homepic = res;
                });
            }
        },
        getBase64 (file) {
            return new Promise(function (resolve, reject) {
                let reader = new FileReader();
                let imgResult = "";
                reader.readAsDataURL(file);
                reader.onload = function () {
                    imgResult = reader.result;
                };
                reader.onerror = function (error) {
                    reject(error);
                };
                reader.onloadend = function () {
                    resolve(imgResult);
                };
            });
        },
        beforeAvatarUpload (file) {
            let flag = true;
            const isJPG = file.raw.type === "image/jpeg";
            const isPNG = file.raw.type === "image/png";
            const isLt5M = file.raw.size / 1024 / 1024 < 5;
            if (!isJPG && !isPNG) {
                flag = false;
                this.$message.error("请上传JPG或PNG格式图片!");
                this.ruleForm.homepic = '';
                this.ruleForm.fileList = []
            }
            if (!isLt5M) {
                flag = false;
                this.$message.error("上传图片大小不能超过 5MB!");
                this.ruleForm.homepic = '';
                this.ruleForm.fileList = []
            }
            return flag;
        },
        handleRemove (file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview (file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
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
.txt_style {
  text-align: left;
  width: 75%;
  display: inline-block;
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
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
                           @click="curPage=1;getInfo()">搜索</el-button>
                <el-button type="info"
                           size="medium"
                           @click="resetSearchForm()">重置</el-button>
                <el-button type="danger"
                           size="medium"
                           @click="newAddassets_show=true">新增商品</el-button>
            </div>

        </div>
        <el-dialog title="新增商品"
                   :close-on-click-modal="false"
                   center
                   @close="colse_rule('ruleForm')"
                   :visible.sync="newAddassets_show">
            <el-form :model="ruleForm"
                     :rules="rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="商品名称"
                              prop="goods_name">
                    <el-input placeholder="请输入名称"
                              v-model.trim="ruleForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="单位"
                              prop="goods_unit">
                    <el-input placeholder="请输入单位"
                              v-model.trim="ruleForm.goods_unit"></el-input>
                </el-form-item>
                <el-form-item label="库存数量"
                              prop="stock_number">
                    <el-input placeholder="请输入库存数量"
                              type="number"
                              v-model.trim="ruleForm.stock_number"></el-input>
                </el-form-item>
                <!-- 添加个状态开关 -->

                <el-form-item label="商品轮播">
                    <div class="imgBox2">
                        <el-upload class="avatar-uploader"
                                   :action="uploadUrl"
                                   list-type="picture-card"
                                   :limit="6"
                                   :file-list="fileList"
                                   :on-success="handleAvatarSuccess"
                                   :before-upload="beforeAvatarUpload"
                                   :on-preview="handlePictureCardPreview"
                                   :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <span c>最多上传6张(建议尺寸325*325)</span>

                    </div>
                </el-form-item>
                <el-form-item label="简介:"
                              style="width: 100%;padding-top: 20px;"
                              prop="goods_introduce">

                    <div class="quill_content">
                        <quill-editor v-model="ruleForm.goods_introduce"
                                      ref="QuillEditor"
                                      :options="quillOption"
                                      @blur="onEditorBlur($event)"
                                      @focus="onEditorFocus($event)"
                                      @change="onEditorChange($event)">
                        </quill-editor>
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
            <el-table-column type="index"
                             label="序号">
            </el-table-column>
            <el-table-column prop="goods_name"
                             label="商品名称">
            </el-table-column>
            <el-table-column prop="goods_unit"
                             label="商品单位">
            </el-table-column>
            <el-table-column prop="stock_number"
                             label="商品数量">
            </el-table-column>
            <el-table-column prop="password"
                             label="商品简介">
            </el-table-column>
            <el-table-column prop="goods_status"
                             label="状态">
            </el-table-column>
            <el-table-column prop="addtimeStr"
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
import { getList, deletePollPicture } from "@/api/goods";
import { quillEditor } from "vue-quill-editor"
import quillConfig from '@/utils/quill-config.js'

export default {
    name: 'assetManagement',
    components: {
        quillEditor,
    },
    data () {
        return {
            curPage: 1,
            page_size: 20,
            total: 0,
            tableData: [],
            dialogImageUrl: '',
            fileList: [],
            quillOption: quillConfig,
            dialogVisible: false,
            ruleForm: {
                goods_name: '',
                goods_unit: '',
                goods_introduce: '',
                stock_number: 0,
                goods_status: 0,
                goods_poll_img: ''
            },
            alreadyFileList: [],
            uploadUrl: process.env.BASE_API + "/api/Goods/PollPicture",
            rules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                stock_number: [
                    { required: true, message: '请输入库存数量', trigger: 'blur' }
                ],
                goods_unit: [
                    { required: true, message: '请输入商品单位', trigger: 'blur' }
                ],
                goods_introduce: [
                    { required: true, message: '请输入商品简介', trigger: 'blur' }
                ]
            },
            dialogVisible_pic: false,

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
    },
    methods: {
        getInfo () {
            return new Promise((resolve, reject) => {
                getList({
                    page_index: this.curPage,
                    page_size: this.page_size,
                    goods_name: this.search.name,
                }).then(res => {
                    const data = res.data;
                    if (data.Result) {
                        this.tableData = res.data.Data;
                        this.total = res.data.PageInfo.TotalCount;
                    }
                }).catch(error => {
                    reject(error);
                });
            })
        },

        resetSearchForm () {
            this.search.name = ''
            this.curPage = 1
            this.getInfo();
        },
        submitNewassets (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = this.ruleForm
                    console.log(`data`, data)

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
            this.hideUpload = false
            this.fileList = []
            this.rowData = {}
        },

        handleNum (row) {
            this.rowData = {};
        },
        // 上传图片
        handleAvatarSuccess (res, file) {
            this.alreadyFileList.push({ uid: file.uid, path: res });
            this.imageUrl = URL.createObjectURL(file.raw);
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
            for (var i = 0; i < this.alreadyFileList.length; i++) {
                if (this.alreadyFileList[i].uid == file.uid) {
                    let pram = this.alreadyFileList[i].path;
                    //相同uid时，删除服务器中对应的图片
                    return new Promise((resolve, reject) => {
                        deletePollPicture({ file: pram }).then(res => {
                            this.$message.success("删除成功");
                            resolve(res);
                        }).catch(error => {
                            reject(error);
                        });
                    });
                }
            }
        },
        handlePictureCardPreview (file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 编辑文本
        onEditorBlur () { }, // 失去焦点事件
        onEditorFocus () { }, // 获得焦点事件
        onEditorChange () { }, // 内容改变事件
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

// 富文本
.quill_content {
  width: 670px;
}
/deep/.ql-snow .ql-picker {
  height: 100%;
}
/deep/.ql-container {
  height: 400px;
}
/deep/p {
  // display: flex;
  // margin-top: 10px;
  // border: 1px solid #dddddd;
  // padding: 20px 0;
  text-indent: 15px;
  img {
    max-width: 870px;
  }
  /deep/u {
    text-decoration: underline;
  }
  /deep/ s {
    text-decoration: line-through;
  }
}
</style>
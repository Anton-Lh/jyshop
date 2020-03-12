<template>
    <el-card :style="cardH">
        <div>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input v-model="user_name"
                              placeholder="用户名"
                              clearable />
                </el-col>
                <el-col :span="16">
                    <el-button type="primary"
                               @click="getSearchList">搜索</el-button>
                    <el-button type="danger"
                               @click="addDialogVisible = true">添加账户</el-button>
                </el-col>
            </el-row>
        </div>
        <div id="borders">
            <el-table :data="userList"
                      border
                      style="width: 100%;margin-top:20px;">
                <el-table-column property="UserName"
                                 label="用户名"></el-table-column>
                <el-table-column property="AddTimeStr"
                                 label="加入时间"></el-table-column>
                <el-table-column fixed="right"
                                 label="操作"
                                 min-width="300">
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
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="pageSizes"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
        <div>
            <el-dialog title="编辑"
                       :visible.sync="editdialogVisible"
                       width="30%">
                <el-form v-bind:model="userItem"
                         label-position="left"
                         label-width="90px">
                    <el-row v-bind:gutter="10">
                        <el-col v-bind:span="18">
                            <el-form-item label="用户名："
                                          label-width="70px">
                                <el-input v-model="userItem.UserName"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-bind:gutter="10">
                        <el-col v-bind:span="18">
                            <el-form-item label="密码："
                                          label-width="70px">
                                <el-input v-model="updatePwd"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer"
                     class="dialog-footer">
                    <el-button @click="close">关 闭</el-button>
                    <el-button type="primary"
                               @click="savemenu">保 存</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog title="添加"
                       :visible.sync="addDialogVisible"
                       width="30%">
                <el-form v-bind:model="addUserItem"
                         v-bind:rules="addRules"
                         ref="addUserItem"
                         label-position="left"
                         label-width="90px">
                    <el-row v-bind:gutter="10">
                        <el-col v-bind:span="18">
                            <el-form-item label="用户名："
                                          prop="UserName"
                                          label-width="80px">
                                <el-input v-model="addUserItem.UserName"
                                          placeholder="请输入用户名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-bind:gutter="10">
                        <el-col v-bind:span="18">
                            <el-form-item label="密码："
                                          prop="Password"
                                          label-width="80px">
                                <el-input type="password"
                                          v-model="addUserItem.Password"
                                          placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer"
                     class="dialog-footer">
                    <el-button @click="closeAdd">关 闭</el-button>
                    <el-button type="primary"
                               @click="saveAdd">保 存</el-button>
                </div>
            </el-dialog>
        </div>
    </el-card>
</template>
<script>
import { getUserListApi, updateApi, deleteApi, addApi } from "@/api/user";
import {
    showFullScreenLoading,
    tryHideFullScreenLoading
} from "@/utils/request";
export default {
    name: "userList",
    data () {
        return {
            user_name: "",
            userItem: {},
            updatePwd: "",
            addUserItem: {
                UserName: "",
                Password: ""
            },
            userList: [],
            pageSizes: [5, 15, 25, 35],
            currentPage: 1,
            pageSize: 5,
            total: 0,
            editdialogVisible: false,
            addDialogVisible: false,
            addRules: {
                UserName: [
                    { required: true, trigger: "blur", message: "此项不能为空" }
                ],
                Password: [{ required: true, trigger: "blur", message: "此项不能为空" }]
            }
        };
    },
    computed: {
        cardH () {
            const h =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;
            return {
                height: h - 94 + "px",
                overflow: "auto"
            };
        }
    },
    mounted () {
        showFullScreenLoading();
        this.getList();
        tryHideFullScreenLoading();
    },
    methods: {
        handleSizeChange (val) {
            this.pageSize = val;
            this.getList();
        },
        handleCurrentChange (val) {
            this.currentPage = val;
            this.getList();
        },
        getSearchList () {
            this.currentPage = 1;
            this.getList();
        },
        edit (index, row) {
            // 编辑
            this.userItem = row;
            this.editdialogVisible = true;
        },
        del (index, row) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        deleteApi(row)
                            .then(res => {
                                const data = res.data;
                                if (data.Result) {
                                    this.getList();
                                    this.$message.success(data.Message);
                                } else {
                                    this.$message.error(data.Message);
                                }
                                resolve();
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                })
                .catch(() => {
                    return;
                });
        },
        saveAdd () {
            this.$refs.addUserItem.validate(valid => {
                if (valid) {
                    this.addUserItem.AddUser = this.$store.getters.userid;
                    var postData = this.addUserItem;
                    return new Promise((resolve, reject) => {
                        addApi(postData)
                            .then(res => {
                                const data = res.data;
                                if (data.Result) {
                                    this.$message.success(data.Message);
                                    this.closeAdd();
                                } else {
                                    this.$message.error("保存失败");
                                }
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        close () {
            this.userItem = {};
            this.updatePwd = "";
            this.editdialogVisible = false;
            this.getList();
        },
        closeAdd () {
            this.addUserItem = {
                UserName: "",
                Password: ""
            };
            this.addDialogVisible = false;
            this.$refs.addUserItem.resetFields();
            this.getList();
        },
        savemenu () {
            if (!this.updatePwd) {
                this.$message.error("请输入修改密码");
                return;
            }
            return new Promise((resolve, reject) => {
                var postData = {
                    ID: this.userItem.ID,
                    Password: this.updatePwd
                };
                updateApi(postData)
                    .then(res => {
                        const data = res.data;
                        if (data.Result) {
                            this.$message.success(data.Message);
                            this.close();
                        } else {
                            this.$message.error("保存失败");
                        }
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        getList: function () {
            var that = this;
            return new Promise((resolve, reject) => {
                getUserListApi({
                    UserName: this.user_name,
                    page_index: this.currentPage,
                    page_size: this.pageSize
                })
                    .then(res => {
                        const data = res.data;
                        if (data.Result) {
                            that.userList = data.Data;
                            this.total = data.PageInfo.TotalCount;
                        }
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
.avatar-uploader {
  .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
.avatar-uploader {
  .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px !important;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

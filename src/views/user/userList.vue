<template>
    <el-card :style='cardH'>
    <div>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="user_name" placeholder="用户名" clearable />
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="getSearchList">搜索</el-button>
          <el-button type="primary" @click="addDialogVisible = true">添加账户</el-button>
        </el-col>
      </el-row>
    </div>
        <div id="borders">
        <el-table :data="userList" border style="width: 100%;margin-top:20px;" >
            <el-table-column property="UserName" label="用户名" ></el-table-column>
            <el-table-column label="角色">
                <template slot-scope="scope">
                    <span v-if="scope.row.Type == '0'">超级管理员</span>
                    <span v-else-if="scope.row.Type == '1'">总公司</span>
                    <span v-else-if="scope.row.Type == '2'">团队</span>
                    <span v-else-if="scope.row.Type == '3'">老师</span>
                </template>
            </el-table-column>
            <el-table-column label="名字">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.LiveState == '0'" type="danger">关闭</el-tag>
                    <el-tag v-else type="success">开启</el-tag>
                </template>
            </el-table-column>
             <el-table-column label="状态">
                <template slot-scope="scope" >
                    <el-tag v-if="scope.row.LiveState == '0'"  >正常</el-tag>
                    <el-tag  v-else >失效</el-tag>
                </template>
            </el-table-column>
            <el-table-column property="AddTimeStr" label="加入时间"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="300">
                <template slot-scope="scope">
                    <el-button type="success" v-on:click="edit(scope.$index, scope.row)" size="small">编辑</el-button>
                    <el-button type="danger" v-on:click="del(scope.$index, scope.row)" size="small">删除</el-button>
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
          <el-dialog title="编辑" :visible.sync='editdialogVisible' width="30%">
              <el-form v-bind:model="userItem" label-position="left" label-width="90px">
                  <el-row v-bind:gutter="10">
                    <el-col v-bind:span="18">
                        <el-form-item label="用户名：" label-width="70px">
                            <el-input v-model="userItem.UserName" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-bind:gutter="10">
                    <el-col v-bind:span="18">
                        <el-form-item label="类型：" label-width="70px">
                            <el-input v-if="userItem.Type == '0'" placeholder="超级管理员" :disabled="true"></el-input>
                            <el-input v-if="userItem.Type == '1'" placeholder="总公司" :disabled="true"></el-input>
                            <el-input v-if="userItem.Type == '2'" placeholder="团队" :disabled="true"></el-input>
                            <el-input v-if="userItem.Type == '3'" placeholder="老师" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                      <el-col>
                          <el-form-item label="开启直播：" label-width="82px">
                              <el-switch
                                v-model="switchController"
                                active-value= '1'
                                active-text="开启"
                                inactive-value= '0'
                                inactive-text="关闭"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                              </el-switch>
                          </el-form-item>
                      </el-col>
                  </el-row>
              </el-form>
              <div slot='footer' class='dialog-footer'>
                <el-button @click='close'>关 闭</el-button>
                <el-button type='primary' @click='savemenu'>保 存</el-button>
              </div>
          </el-dialog>
      </div>
      <div>
          <el-dialog title="添加" :visible.sync='addDialogVisible' width="30%">
               <el-form v-bind:model="addUserItem" v-bind:rules="addRules" ref="addUserItem" label-position="left" label-width="90px">
                   <el-row v-bind:gutter="10">
                    <el-col v-bind:span="18">
                        <el-form-item label="用户名：" prop="UserName" label-width="80px">
                            <el-input v-model="addUserItem.UserName" placeholder="请输入用户名" ></el-input>
                        </el-form-item>
                    </el-col>
                   </el-row>
                   <el-row v-bind:gutter="10">
                    <el-col v-bind:span="18">
                        <el-form-item label="密码：" prop="Password" label-width="80px">
                            <el-input type="password" v-model="addUserItem.Password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>  
                  <el-row v-bind:gutter="10">
                    <el-col v-bind:span="18">
                        <el-form-item label="类型：" prop="Type" label-width="80px">
                            <el-select v-model="addUserItem.Type" placeholder="请选择">
                                <el-option
                                v-for="item in addType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                  </el-row>
                   <el-row v-bind:gutter="10">
                    <el-col v-bind:span="18">
                        <el-form-item label="教师：" prop="TeacherID" label-width="80px">
                            <el-select v-model="addUserItem.TeacherID" placeholder="请选择">
                                <el-option
                                v-for="item in teacherList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                  </el-row>
               </el-form>
               <div slot='footer' class='dialog-footer'>
                <el-button @click='closeAdd'>关 闭</el-button>
                <el-button type='primary' @click='saveAdd'>保 存</el-button>
              </div>
          </el-dialog>
      </div>
    </el-card>
</template>
<script>
import{ getUserListApi, updateLiveStateApi, deleteApi, addApi } from '@/api/user'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/request'
export default {
    name: 'userList',
    data(){
        return{
            user_name: '',
            userItem: {},
            addUserItem:{
                UserName:'',
                Password:'',
                Type:'',
                LiveState:'0',
                AddUser:0,
                TeacherID:''
            },
            userList: [],
            teacherList: [],
            addType:[{value:'1',label:'总公司'},{value:'2',label:'团队'},{value:'3',label:'老师'}],
            pageSizes: [5, 15, 25, 35],
            currentPage: 1,
            pageSize: 5,
            total: 0,
            switchController:'',
            editdialogVisible: false,
            addDialogVisible: false,
            addRules: {
                UserName:[{ required: true, trigger: 'blur', message: '此项不能为空' }],
                Password:[{ required: true, trigger: 'blur', message: '此项不能为空' }],
                Type:[{ required: true, trigger: 'change', message: '请选择类型' }],
                TeacherID:[{ required: true, trigger: 'change', message: '请选择教师' }]
            }
        }
    },
    computed: {
        cardH() {
        const h =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight
        return {
            height: h - 94 + 'px',
            overflow: 'auto'
        }
        }
    },
    mounted() {
        showFullScreenLoading()
        this.getList()
        this.getTeacherList()
        tryHideFullScreenLoading()
    },
    methods:{
        handleSizeChange(val) {
        console.log(val)
        this.pageSize = val
        this.getList()
        },
        handleCurrentChange(val) {
        this.currentPage = val
        this.getList()
        },
        getSearchList() {
        this.currentPage = 1
        this.getList()
        },
        edit(index, row) { // 编辑
            this.userItem = row
            this.switchController = this.userItem.LiveState.toString()
            this.editdialogVisible = true
        },
        del(index, row){
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return new Promise((resolve, reject) => {
                    deleteApi(row)
                    .then(res => {
                        const data = res.data
                        if (data.Result) {
                        this.getList()
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
        saveAdd() {
            this.$refs.addUserItem.validate(valid => {
                if(valid){
                    this.addUserItem.AddUser = this.$store.getters.userid
                    var postData = this.addUserItem 
                    return new Promise((resolve, reject) => {
                        addApi(postData).then(res => {
                            const data = res.data
                            if(data.Result){
                                this.$message.success(data.Message)
                                this.closeAdd()
                            }else{
                                this.$message.error('保存失败')
                            }
                        }).catch(error => {
                            reject(error)
                        })
                    })
                }else{
                    console.log('error submit!!')
                    return false
                }
            })
        },
        close() {
            this.userItem = {}
            this.switchController= ''
            this.editdialogVisible = false
            this.getList()
        },
        closeAdd() {
            this.addUserItem={
                UserName:'',
                Password:'',
                Type:'',
                LiveState:'0',
                AddUser:0,
                TeacherID:''
            }
            this.addDialogVisible = false
            this.$refs.addUserItem.resetFields()
            this.getList()
        },
        savemenu(){
            return new Promise((resolve, reject) => {
                this.userItem.LiveState = Number(this.switchController)
                var postData = this.userItem
                updateLiveStateApi(postData).then(res => {
                    const data = res.data
                    if(data.Result){
                        this.$message.success(data.Message)
                        this.close()
                    }else{
                        this.$message.error('保存失败')
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getList: function() {
            var that = this
            return new Promise((resolve, reject) => {
                getUserListApi({
                    UserName: this.user_name,
                    page_index: this.currentPage,
                    page_size: this.pageSize
                }).then(res => {
                    const data = res.data
                    if (data.Result) {
                        that.userList = data.Data
                        this.total = data.PageInfo.TotalCount
                    }
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getTeacherList: function(){
            var that = this
            
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/usermgr' }"><b>用户管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="部门名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="success" @click="showEditDialog(0,0)">添加部门</el-button>
            <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" @selection-change="selsChange" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="did" type="" label="#" width="100" sortable>
        </el-table-column>
        <el-table-column prop="dname" label="部门名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="dinfo.phone" label="手机号" width="140" sortable>
        </el-table-column>
       <!-- <el-table-column prop="dinfo.wechat" label="微信号" width="120" sortable>
        </el-table-column>-->
        <el-table-column prop="dinfo.email" label="邮箱" width="140" sortable>
        </el-table-column>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <!--<el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-dialog title="编辑"  :title.sync="editDiago" :visible.sync ="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="#" prop="did"  v-show="tidVisible">
          <el-input v-model="editForm.did" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名" prop="dname">
          <el-input v-model="editForm.dname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input  v-model="editForm.pwd" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import API from '../../api/api_usermgr_department';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        loading: false,
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        sels: [], //列表选中列
        loading: false,
        editFormVisible: false,//编辑界面是否显示
        editDiago:'',
        tidVisible:false,
        editFormRules: {
          dname: [
            {required: true, message: '请输入部门名', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        editForm: {
          did: '',
          dname: '',
          pwd: ''
        },
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch(){
        this.total = 0;
        this.page = 1;
        this.search();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //获取用户列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          filter: that.filters.name
        };
        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.data) {
            that.total = 10;//result.total;
            for(let i in result.data){
              if(result.data[i].dinfo)
                result.data[i].dinfo=JSON.parse(result.data[i].dinfo);
            }
            that.users = result.data;
            that.total = result.data.length;
            console.log("that"+that.total);
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        if(index===row){
          this.tidVisible=false;
          this.editDiago="添加部门"
          if (this.$refs['editForm']!==undefined) {
            this.editForm={};
            this.$refs.editForm.resetFields();
            console.log('this.$refs.editForm.resetFields();');
          }
        }
        else
        {
          this.tidVisible=false;
          this.editDiago="编辑部门信息"
          if (this.$refs['editForm']!==undefined) {
            this.$refs.editForm.resetFields();
          }
          this.editForm = Object.assign({}, row);
        }
      },
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let para = Object.assign({}, this.editForm);
            API.update(para).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.code) === 0) {
                that.$message.success({showClose: true, message: '成功', duration: 2000});
                that.$refs.editForm.resetFields();
                that.editFormVisible = false;
                that.search();
              } else {
                that.$message.error({showClose: true, message: '失败', duration: 2000});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }
        });
      },
      batchDeleteBook: function () {
        let ids = this.sels.map(item => item.did);
        console.log("ids:"+ids);
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          API.removeBatch(ids).then(function (result) {
            that.loading = false;
            if (result && parseInt(result.code) === 0) {
              that.$message.success({showClose: true, message: '删除成功', duration: 1500});
              that.search();
            }
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {

        });
      }
    },
    //编辑

    mounted() {
      this.handleSearch()
    }
  }
</script>

<style scoped>

</style>

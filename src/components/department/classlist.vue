<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item><b>班级管理</b></el-breadcrumb-item>

      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="班级id/班级名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="success" @click="showEditDialog(0,0)">添加班级</el-button>
            <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" @selection-change="selsChange" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="cid"  label="班级号" width="100" sortable></el-table-column>
        <!--<el-table-column prop="cid" label="人数" width="80" sortable></el-table-column>-->
        <el-table-column prop="cname" label="班级名" width="120" sortable>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.cinfo }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.cname }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="cinfo" label="班级信息" width="300" sortable></el-table-column>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-dialog title="编辑"  :title.sync="editDiago" :visible.sync ="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="班级号" prop="cid"  v-show="tidVisible">
          <el-input v-model="editForm.cid" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="班级名" prop="cname">
          <el-input v-model="editForm.cname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级信息" prop="cinfo">
         <el-input type="textarea" v-model="editForm.cinfo" :rows="4"></el-input>
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
  import API from '../../api/api_classmgr';

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
          cname: [
            {required: true, message: '请输入班级名', trigger: 'blur'}
          ],
        },
        editForm: {
          cid: '',
          cname: '',
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
      //获取班级列表
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
          this.editDiago="添加班级"
          if (this.$refs['editForm']!==undefined) {
            this.editForm={};
            this.$refs.editForm.resetFields();
            console.log('this.$refs.editForm.resetFields();');
          }
        }
        else
        {
          this.tidVisible=false;
          this.editDiago="编辑班级信息"
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
        let ids = this.sels.map(item => item.cid);
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

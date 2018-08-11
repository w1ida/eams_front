<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>学生查询</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters"  @submit.native.prevent="handleSearch">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="学号/姓名/班级" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
<!--            <el-button type="success" @click="showEditDialog(0,0)">添加学生</el-button>
            <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>-->
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" >
        <el-table-column prop="sid" type="" label="学号" width="80" sortable>
        </el-table-column>
        <el-table-column prop="sname" label="姓名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="cname" label="班级" width="160" sortable>
        </el-table-column>
        <el-table-column prop="sinfo.phone" label="手机号" width="140" sortable>
        </el-table-column>
       <!-- <el-table-column prop="sinfo.wechat" label="微信号" width="120" sortable>
        </el-table-column>-->
        <el-table-column prop="sinfo.email" label="邮箱" width="140" sortable>
        </el-table-column>
      </el-table>
    </el-col>

  </el-row>
</template>

<script>
  import API from '../../api/api_teacher'

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
        sidVisible:false,
        cnameOptions:[],
      }
    },
    watch:{
      'editForm.cname':function (curr,old) {
        let that=this;
        this.cnameOptions.forEach(function (d) {
          console.log(d);
          console.log(d.value);
          if(d.value==curr){
            that.editForm.cid=d.key;
            console.log("setting cid："+that.editForm);
          }
        })
      }
    },
    methods: {
      initClass:function(){
        let that=this;
        that.loading = true;
        CLASSAPI.findList({}).then(function (result) {
          that.loading = false;
          if(!result||!result.data)return;
          let cnameOptions=[];
          for(let i in result.data){
            cnameOptions.push(
              {
                key: result.data[i].cid,
                value: result.data[i].cname,
                label: result.data[i].cname
              }
            );
          }
          that.cnameOptions=cnameOptions;
          console.log(result);
          console.log(cnameOptions);
        });
      },
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
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
        API.StdList(params).then(function (result) {
          that.loading = false;
          if (result && result.data) {

            that.total = 10;//result.total;
            for(let i in result.data){
              if(result.data[i].sinfo)
                result.data[i].sinfo=JSON.parse(result.data[i].sinfo);
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
    },
    //编辑

    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>

<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item><b>课程管理</b></el-breadcrumb-item>
        <el-breadcrumb-item><b>课程列表</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <!--<el-form-item>
            <el-input v-model="filters.name" placeholder="课程号/课程名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>-->
          <el-form-item>
            <el-button icon="el-icon-refresh" @click="handleSearch" >刷新</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column prop="cosid"  label="课程号" width="170" sortable></el-table-column>
        <el-table-column prop="courses.cosname"  label="课程名" width="170" sortable></el-table-column>
        <el-table-column prop="courses.cosinfo"  label="课程信息" width="340" sortable></el-table-column>
      </el-table>
    </el-col>

  </el-row>
</template>

<script>
  import API from '../../api/api_teacher';
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
        openFormVisible:false,
        editDiago:'',
        tidVisible:true,
        isDisabled:true,
        teacherOptions:[]
      }
    },
    watch:{
      'editForm.cosname':function(curVal,oldVal){
        if(this.isDisabled)return;
        if(!curVal||curVal=='')return;
          //console.log(curVal,oldVal);
          let d=new Date();
          this.editForm.cosid=d.getFullYear()+"-"+(d.getMonth()>8?1:2)+"-"+crc16(curVal);
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
      //获取课程列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          filter: that.filters.name
        };
        that.loading = true;
        API.courseList(params).then(function (result) {
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
    },
    //编辑

    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>

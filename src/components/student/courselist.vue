<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>我的课程</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
        <!--  <el-form-item>
            <el-input v-model="filters.name" placeholder="用户名/姓名/昵称" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>-->
          <el-form-item>
            <el-button type="" @click="handleSearch" icon="el-icon-refresh">刷新</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" >

        <el-table-column prop="cosid"  label="课程号" width="170" sortable></el-table-column>
        <el-table-column prop="courses.cosname"  label="课程名" width="170" sortable></el-table-column>
        <el-table-column prop="teacher.tname" label="教师" width="200" sortable></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="updateAllocCourse(scope.$index,scope.row,'exit')" v-if="scope.row.choose">退选</el-button>
            <el-button size="small" @click="updateAllocCourse(scope.$index,scope.row,'choose')"  v-else>选课</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_stdcos';

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
        loading: false
      }
    },
    methods: {
      updateAllocCourse(index,row,type){
        console.log(row,type)
        let that = this;
        let params = {
          cosid:row.cosid,
          tid:row.tid,
          type:type
        };
        that.loading = true;
        API.updateAllocCourse(params).then(function (result) {
          that.loading = false;
          if (result && result.code===0) {
            that.$message.success('操作成功！');
            that.handleSearch()
          }else{
            that.$message.error({ message: '操作失败', duration: 2000});
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
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch(){
        this.total = 0;
        this.page = 1;
        this.search();
      },
      //获取用户列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.data) {
            that.total = result.total;
            that.users = result.data;
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
    },
    mounted() {
      this.handleSearch()
    }
  }
</script>

<style scoped>

</style>

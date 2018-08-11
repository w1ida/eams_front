<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>成绩查询</el-breadcrumb-item>
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
        <el-table-column prop="cosid" type="" label="课程代码" width="140" sortable></el-table-column>
        <el-table-column prop="cosname" label="课程名" width="160" sortable></el-table-column>
        <el-table-column prop="tname" label="任教老师" width="120" sortable></el-table-column>
        <el-table-column prop="sid" label="学号" width="100" sortable></el-table-column>
        <el-table-column prop="sname" label="姓名" width="100" sortable></el-table-column>
        <el-table-column prop="score" label="成绩" width="120" sortable>
          <template slot-scope="scope">
            <strong>
              <span v-if="scope.row.score==null">暂无成绩</span>
              <span v-else-if="scope.row.score < 60"  style="color:#F56C6C" >{{scope.row.score}}</span>
              <span v-else >{{scope.row.score}}</span>
            </strong>
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
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch(){
        this.total = 0;
        this.page = 1;
        this.search();
      },
      //获取成绩列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        API.findScoreList(params).then(function (result) {
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

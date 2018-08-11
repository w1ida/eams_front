<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>教师查询</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent="handleSearch">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="职工号/教师姓名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;"  >
        <el-table-column prop="tid" type="" label="职工号" width="110" sortable>
        </el-table-column>
        <el-table-column prop="tname" label="姓名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="tinfo.phone" label="手机号" width="140" sortable>
        </el-table-column>
       <!-- <el-table-column prop="tinfo.wechat" label="微信号" width="120" sortable>
        </el-table-column>-->
        <el-table-column prop="tinfo.email" label="邮箱" width="140" sortable>
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
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        sels: [], //列表选中列
        loading: false,
      }
    },
    methods: {
      handleSearch(){
        this.search();
      },
      //获取教师列表
      search: function () {
        let that = this;
        let params = {
          filter: that.filters.name
        };
        that.loading = true;
        API.stdList(params).then(function (result) {
          that.loading = false;
          if (result && result.data) {
            that.total = 10;//result.total;
            for(let i in result.data){
              if(result.data[i].tinfo)
                result.data[i].tinfo=JSON.parse(result.data[i].tinfo);
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
      }
    },
    mounted() {
      this.handleSearch()
    }
  }
</script>

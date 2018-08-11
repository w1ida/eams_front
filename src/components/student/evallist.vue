<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>教评管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-button type="" @click="handleSearch" icon="el-icon-refresh">刷新</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" >
        <el-table-column prop="score.cosid" type="" label="课程代码" width="140" sortable></el-table-column>
        <el-table-column prop="score.cosname" label="课程名" width="200" sortable></el-table-column>
        <el-table-column prop="score.tname" label="任教老师" width="140" sortable></el-table-column>
        <el-table-column prop="rate" label="评分" width="180" sortable>
          <template slot-scope="scope">
            <!--<el-input v-model="scope.row.dinfo.phone" ></el-input>-->
            <el-rate
              v-model="scope.row.rate"
              show-score
              text-color="#ff9900"
              score-template="{value}"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              v-if="scope.row.eval==null"
              class="inline"
            >
            </el-rate>
            <el-rate
              v-model="scope.row.eval.score"
              show-score
              disabled
              text-color="#ff9900"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              score-template="{value}"
              v-else
            ></el-rate>
            <el-tooltip class="item" effect="light" content="提交评价" placement="right" v-if="scope.row.rate>0">
              <el-button type="success" icon="el-icon-check" circle plain size="mini" @click="handleEval(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_stdeval';
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        cosnameoptions:[],
        tnameoptions:[],
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
      }
    },
    methods: {
      handleEval(row){
        console.log(row)
        let that = this;
        let params = {
          cosid:row.score.cosid,
          tid:row.score.tid,
          evalSroce:row.rate
        };
        console.log(params);
        that.loading = true;
        API.eval(params).then(function (result) {
          that.loading = false;
          if (result && result.code===0) {
            that.$message.success({showClose: true, message: '评价成功', duration: 2000});
          }else{
            that.$message.error({showClose: true, message: '评价失败', duration: 2000});
          }
          that.handleSearch();
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
        this.search();
      },
      saveScore:function(index,row){
        console.log(row)
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
              result.data[i].cosid=result.data[i][0];
              result.data[i].cosname=result.data[i][1];
              result.data[i].tname=result.data[i][2];
              result.data[i].rate=result.data[i][3];
              result.data[i].ratecnt=result.data[i][4];
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
    mounted() {
      this.handleSearch()
    }
  }
</script>

<style scoped>

</style>

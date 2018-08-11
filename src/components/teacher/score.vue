<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>成绩录入</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.sidname" clearable placeholder="学号/姓名" style="width: 120px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="filters.cosidname" filterable placeholder="课程名" style="width: 200px;" @change="handleSearch">
              <el-option
                v-for="item1 in cosnameoptions"
                :label="item1"
                :value="item1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" >
        <el-table-column prop="cosid" type="" label="课程代码" width="140" sortable></el-table-column>
        <el-table-column prop="cosname" label="课程名" width="160" sortable></el-table-column>
        <!--<el-table-column prop="tname" label="任教老师" width="120" sortable></el-table-column>-->
        <el-table-column prop="sid" label="学号" width="100" sortable></el-table-column>
        <el-table-column prop="sname" label="姓名" width="100" sortable></el-table-column>
        <el-table-column prop="score" label="成绩" width="120" sortable>
          <template slot-scope="scope">
            <el-input v-model="scope.row.score"
                      @blur="updateScore(scope.$index,scope.row)"
                      @focus="saveScore(scope.$index,scope.row)"
                      @clear="updateScore(scope.$index,scope.row)"
                      clearable
                      placeholder="无成绩"
            ></el-input>
          </template>
        </el-table-column>
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
          name: '',
          tidname:'',
          tidname:'',
          tidname:''
        },
        cosnameoptions:[],
        tnameoptions:[],
        loading: false,
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        editDiago:'',
        tidVisible:false,
        oldScore:[]
      }
    },
    methods: {
      clearScore(index,row){
        console.log(index,row)
      },
      saveScore:function(index,row){
        if(!row.score)row.score='';
        if((typeof this.oldScore[index]) == "undefined"){
          this.oldScore[index]=''+row.score;
          //console.log("set index"+index+"="+row.score);
        }
      },
      updateScore(index,row){
        if(!row.score)row.score='';
        row.score = (''+row.score).replace(/[^0-9.]*/g, '');
        if(!row.score)row.score='';
        if(this.oldScore[index]!=row.score) {
          console.log("*** row change:",this.oldScore[index],row.score);
          let params={
            cosid:row.cosid,
            tid:row.tid,
            sid:row.sid,
            score:row.score
          };
          let that=this;
          API.update(params).then(function (result) {
              if(result&&result.code===0){
                that.oldScore[index] = ''+row.score;
                that.$notify({
                  title: '【'+row.sname+'：'+row.score+'】保存成功',
                  duration:1000,
                  type: 'success'
                });
              }else{
                that.$notify({
                  title: '【'+row.sname+'：'+row.score+'】保存失败',
                  duration:3000,
                  type: 'error'
                });
              }
          },
          function (err) {
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }
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

      //获取列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          sidname:that.filters.sidname,
          cosidname:that.filters.cosidname,
          tidname:that.filters.tidname,
        };
        that.loading = true;
        API.scoreList(params).then(function (result) {
          that.loading = false;
          if (result && result.data) {
            that.total = 10;//res
            that.oldScore=[];//重置
            let cosnameset=new Set();
            let tnameset=new Set();
            for(let i in result.data){
              cosnameset.add(result.data[i].cosname);
              tnameset.add(result.data[i].tname);
            }
            that.cosnameoptions=Array.from(cosnameset);
            that.tnameoptions=Array.from(tnameset);
            console.log(cosnameset,that.cosnameoptions);
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

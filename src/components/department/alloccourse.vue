<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item><b>课程管理</b></el-breadcrumb-item>
        <el-breadcrumb-item><b>分配课程</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="课程号/课程名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" @selection-change="selsChange" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="cosid"  label="课程号" width="170" sortable></el-table-column>
        <el-table-column prop="courses.cosname"  label="课程名" width="170" sortable></el-table-column>
        <el-table-column prop="teacher.tname" label="教师" width="200" sortable></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">分配课程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-dialog title="分配课程"  :visible.sync ="editFormVisible" :close-on-click-modal="false" width="300px;">
      <el-form :model="editForm" label-width="100px"  ref="editForm" class="alloc_form">
        <div>
          <strong>课程信息</strong>
          <el-tooltip content="课程号" placement="top">
            <el-tag type="info">{{editForm.courses.cosid}}</el-tag>
          </el-tooltip>
          <el-tooltip content="课程名" placement="top">
            <el-tag>{{editForm.courses.cosname}}</el-tag>
          </el-tooltip>
          <el-tooltip content="任课老师" placement="top">
            <el-tag type="success">{{editForm.teacher.tname}}</el-tag>
          </el-tooltip>

          <el-select v-model="editForm.cid" auto-complete="off" filterable placeholder="请选择班级" class="alloc_select_class">
            <el-option
              v-for="item in cnameOptions"
              :key="item.cid"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <hr>
        <div style="text-align:center">
          <el-transfer
            style="text-align: left; display: inline-block;"
            v-model="allocmodel"
            filterable
            filter-placeholder="输入姓名搜索"
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['已选学生列表', '可选学生列表']"
            :button-texts="['选课', '退课']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
             }"
            @change="handleChange"
            :data="alllocdata">
            <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
            <!--<el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
          </el-transfer>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>



  </el-row>
</template>

<script>
  import API from '../../api/api_coursemgr';
  import CLASSAPI from '../../api/api_classmgr';
  import STUDENTAPI from '../../api/api_usermgr_student';

  export default {
    data() {
      return {
        alllocdata:[],
        allocmodel:[],
        orignAllocModel:[],
        filters: {
          name: ''
        },
        loading: false,
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        sels: [],
        loading: false,
        editFormVisible: false,
        editForm: {
          courses: {
            cosname:'',
            cosid:''
          },
          teacher:{
            tname:''
          }
        },
        cnameOptions:[],

      }
    },
    watch:{
      'editForm.cid':function(curVal,oldVal){
        console.log(curVal)
        this.initStudent();
        }
      },
    methods: {
      handleChange(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys);
        console.log(this.allocmodel);
      },
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
      initStudent:function(){
        let that=this;
        let parm= {
          cid: this.editForm.cid,
          cosid: this.editForm.cosid,
          tid: this.editForm.tid,
        };
        console.log("initStudent parm:");
        console.log(parm);
        that.loading = true;
        API.currstdlist(parm).then(function (result) {
        that.loading = false;
        if(!result||!result.data)return;
        that.alllocdata=[];
        let stds=result.data.stds;
        let usedsids=result.data.usedsid;
        that.allocmodel=[];
        for(let i in stds){
          that.alllocdata.push(
            {
              key: stds[i].sid,
              label: stds[i].sname
            }
          );
          if( usedsids.indexOf(stds[i].sid)===-1 ){
            that.allocmodel.push(stds[i].sid)
          }
        }
        that.orignAllocModel=that.allocmodel;
        console.log(result);
      })},
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
        API.curriculalist(params).then(function (result) {
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
        if (this.$refs['editForm']!==undefined) {
          this.$refs.editForm.resetFields();
        }
        this.editForm = Object.assign({}, row);
        console.log(this.editForm);
      },
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.loading = true;

            let all=new Set();
            that.alllocdata.forEach(function (d) {
              all.add(d.key);
            });
            let oa= new Set(that.orignAllocModel);
            let na= new Set(that.allocmodel);
            let oale=new Set([...all].filter(x => !oa.has(x)));//old left
            let nale=new Set([...all].filter(x => !na.has(x)));//nld left

            let choose=new Set([...oa].filter(x => !na.has(x)));
            let exit=new Set([...oale].filter(x => !nale.has(x)));
            let para={cid:that.editForm.cid,tid:that.editForm.tid,cosid:that.editForm.cosid,choose:Array.from(choose),exit:Array.from(exit)}
            console.log(para);
            API.updateAllocCourse(para).then(function (result) {
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
        let ids = { pks: this.sels.map( item  =>  {return {cosid:item.cosid,tid:item.tid }}) };
        console.log(ids);
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          API.curriculadel(ids).then(function (result) {
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
      this.handleSearch();
      this.initClass()
    }
  }
</script>

<style scoped>

</style>

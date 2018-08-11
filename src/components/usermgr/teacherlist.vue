<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/usermgr' }"><b>用户管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>教师管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="职工号/姓名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="success" @click="showEditDialog(0,0)">添加教师</el-button>
            <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" @selection-change="selsChange" >
        <el-table-column type="selection" width="55"></el-table-column>
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
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <!--<el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>-->
          </template>
        </el-table-column>
        <!--<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
        </el-table-column>-->
        <!--<el-table-column prop="email" label="邮箱" min-width="160" sortable>
        </el-table-column>-->
        <!--<el-table-column prop="addr" label="地址" sortable>
        </el-table-column>-->
      </el-table>
    </el-col>

    <el-dialog title="编辑"  :title.sync="editDiago" :visible.sync ="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">

        <el-form-item label="职工号" prop="tid"  v-show="tidVisible">
          <el-input v-model="editForm.tid" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="tname">
          <el-input v-model="editForm.tname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input  v-model="editForm.pwd" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="简介" prop="description">
          <el-input type="textarea" v-model="editForm.description" :rows="8"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import API from '../../api/api_usermgr_teacher';

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
          tname: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        cnameOptions:[{
          key: '1',
          value: '计算机一班',
          label: '计算机一班'
        }, {
          key: '2',
          value: '计算机二班',
          label: '计算机一班'
        },
        ],
        editForm: {
          tid: '',
          tname: '',
          pwd: ''
        },
      }
    },
    methods: {
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
        API.findList(params).then(function (result) {
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
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        if(index===row){
          this.tidVisible=false;
          this.editDiago="添加教师"
          if (this.$refs['editForm']!==undefined) {
            this.editForm={};
            this.$refs.editForm.resetFields();
          }
        }
        else
        {
          this.tidVisible=true;
          this.editDiago="编辑教师信息"
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
            console.log(that.editForm.cname);
            this.loading = true;
            let para = Object.assign({}, this.editForm);
            //para.publishAt = (!para.publishAt || para.publishAt == '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
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
        let ids = this.sels.map(item => item.tid);
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

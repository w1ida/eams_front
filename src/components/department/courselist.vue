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
          <el-form-item>
            <el-input v-model="filters.name" placeholder="课程号/课程名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="success" @click="showEditDialog(0,0)">添加课程</el-button>
            <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" @selection-change="selsChange" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="cosid"  label="课程号" width="170" sortable></el-table-column>
        <!--<el-table-column prop="cosid" label="人数" width="80" sortable></el-table-column>-->
        <el-table-column prop="cosname" label="课程名" width="140" sortable>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.cosinfo }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.cosname }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="cosinfo" label="课程信息" width="200" sortable></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button size="small" @click="openEditDialog(scope.$index,scope.row)">开设课程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-dialog title="编辑"  :title.sync="editDiago" :visible.sync ="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">

        <el-form-item label="课程名" prop="cosname">
          <el-input v-model="editForm.cosname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程号" prop="cosid"  v-show="tidVisible">
          <el-input v-model="editForm.cosid" auto-complete="off"  :disabled='isDisabled' ></el-input>
        </el-form-item>
        <el-form-item label="课程信息" prop="cosinfo">
         <el-input type="textarea" v-model="editForm.cosinfo" :rows="4"></el-input>
       </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="开设课程"  :visible.sync ="openFormVisible" :close-on-click-modal="false">
      <el-form :model="openForm" label-width="100px" :rules="openFormRules" ref="openForm">
        <el-form-item label="课程名" prop="cosname">
          <el-input v-model="openForm.cosname" auto-complete="off" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="任教老师" prop="teacherids" >
          <el-select v-model="openForm.teacherids" multiple placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in teacherOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="openFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="openSubmit">提交</el-button>
      </div>
    </el-dialog>


  </el-row>
</template>

<script>
  import API from '../../api/api_coursemgr';
  import TEACHERAPI from '../../api/api_usermgr_teacher';
  function crc16(charach) {
    var table = [
      0x0000, 0xC0C1, 0xC181, 0x0140, 0xC301, 0x03C0, 0x0280, 0xC241,
      0xC601, 0x06C0, 0x0780, 0xC741, 0x0500, 0xC5C1, 0xC481, 0x0440,
      0xCC01, 0x0CC0, 0x0D80, 0xCD41, 0x0F00, 0xCFC1, 0xCE81, 0x0E40,
      0x0A00, 0xCAC1, 0xCB81, 0x0B40, 0xC901, 0x09C0, 0x0880, 0xC841,
      0xD801, 0x18C0, 0x1980, 0xD941, 0x1B00, 0xDBC1, 0xDA81, 0x1A40,
      0x1E00, 0xDEC1, 0xDF81, 0x1F40, 0xDD01, 0x1DC0, 0x1C80, 0xDC41,
      0x1400, 0xD4C1, 0xD581, 0x1540, 0xD701, 0x17C0, 0x1680, 0xD641,
      0xD201, 0x12C0, 0x1380, 0xD341, 0x1100, 0xD1C1, 0xD081, 0x1040,
      0xF001, 0x30C0, 0x3180, 0xF141, 0x3300, 0xF3C1, 0xF281, 0x3240,
      0x3600, 0xF6C1, 0xF781, 0x3740, 0xF501, 0x35C0, 0x3480, 0xF441,
      0x3C00, 0xFCC1, 0xFD81, 0x3D40, 0xFF01, 0x3FC0, 0x3E80, 0xFE41,
      0xFA01, 0x3AC0, 0x3B80, 0xFB41, 0x3900, 0xF9C1, 0xF881, 0x3840,
      0x2800, 0xE8C1, 0xE981, 0x2940, 0xEB01, 0x2BC0, 0x2A80, 0xEA41,
      0xEE01, 0x2EC0, 0x2F80, 0xEF41, 0x2D00, 0xEDC1, 0xEC81, 0x2C40,
      0xE401, 0x24C0, 0x2580, 0xE541, 0x2700, 0xE7C1, 0xE681, 0x2640,
      0x2200, 0xE2C1, 0xE381, 0x2340, 0xE101, 0x21C0, 0x2080, 0xE041,
      0xA001, 0x60C0, 0x6180, 0xA141, 0x6300, 0xA3C1, 0xA281, 0x6240,
      0x6600, 0xA6C1, 0xA781, 0x6740, 0xA501, 0x65C0, 0x6480, 0xA441,
      0x6C00, 0xACC1, 0xAD81, 0x6D40, 0xAF01, 0x6FC0, 0x6E80, 0xAE41,
      0xAA01, 0x6AC0, 0x6B80, 0xAB41, 0x6900, 0xA9C1, 0xA881, 0x6840,
      0x7800, 0xB8C1, 0xB981, 0x7940, 0xBB01, 0x7BC0, 0x7A80, 0xBA41,
      0xBE01, 0x7EC0, 0x7F80, 0xBF41, 0x7D00, 0xBDC1, 0xBC81, 0x7C40,
      0xB401, 0x74C0, 0x7580, 0xB541, 0x7700, 0xB7C1, 0xB681, 0x7640,
      0x7200, 0xB2C1, 0xB381, 0x7340, 0xB101, 0x71C0, 0x7080, 0xB041,
      0x5000, 0x90C1, 0x9181, 0x5140, 0x9301, 0x53C0, 0x5280, 0x9241,
      0x9601, 0x56C0, 0x5780, 0x9741, 0x5500, 0x95C1, 0x9481, 0x5440,
      0x9C01, 0x5CC0, 0x5D80, 0x9D41, 0x5F00, 0x9FC1, 0x9E81, 0x5E40,
      0x5A00, 0x9AC1, 0x9B81, 0x5B40, 0x9901, 0x59C0, 0x5880, 0x9841,
      0x8801, 0x48C0, 0x4980, 0x8941, 0x4B00, 0x8BC1, 0x8A81, 0x4A40,
      0x4E00, 0x8EC1, 0x8F81, 0x4F40, 0x8D01, 0x4DC0, 0x4C80, 0x8C41,
      0x4400, 0x84C1, 0x8581, 0x4540, 0x8701, 0x47C0, 0x4680, 0x8641,
      0x8201, 0x42C0, 0x4380, 0x8341, 0x4100, 0x81C1, 0x8081, 0x4040,
    ];

    var crc = 0x0000, i=0, byte_val;

    for (; i < charach.length; i++) {
      byte_val = charach[i].charCodeAt(0);

      crc = (crc >>> 8) ^ table[(crc ^ byte_val) & 0xff];
    }

    return crc;
  }
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
        editFormRules: {
          cosid: [
            {required: true, message: '请输入课程号', trigger: 'blur'}
          ],cosname: [
            {required: true, message: '请输入课程名', trigger: 'blur'}
          ],
        },
        openFormRules:{
          cosid: [
            {required: true, message: '请输入课程号', trigger: 'blur'}
          ],
          teacherids: [
            {required: true, message: '请至少选择一位教师', trigger: 'blur'}
          ],
        },

        editForm: {
          cosid: '',
          cosname: '',
          pwd: ''
        },
        openForm:{
          cosid:'',
          cosname:'',
          teachersid:''
        },
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
      initTeacher:function(){
        let that=this;
        that.loading = true;
        TEACHERAPI.findList({}).then(function (result) {
          that.loading = false;
          if(!result||!result.data)return;
          let teacherOptions=[];
          for(let i in result.data){
            teacherOptions.push(
              {
                key: result.data[i].tid,
                value: result.data[i].tid,
                label: result.data[i].tname
              }
            );
          }
          that.teacherOptions=teacherOptions;
          console.log(result);
          console.log(teacherOptions);
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
          this.isDisabled=false;
          this.editDiago="添加课程"
          if (this.$refs['editForm']!==undefined) {
            this.editForm={};
            this.$refs.editForm.resetFields();
            console.log('this.$refs.editForm.resetFields();');
          }
        }
        else
        {
          // this.tidVisible=false;
          this.isDisabled=true;
          this.editDiago="编辑课程信息"
          if (this.$refs['editForm']!==undefined) {
            this.$refs.editForm.resetFields();
          }
          this.editForm = Object.assign({}, row);
        }
      },
      //开设课程
      openEditDialog: function (index, row) {
        this.openFormVisible=true;
        //this.openForm = Object.assign({}, row);
        this.openForm.cosid=row.cosid;
        this.openForm.cosname=row.cosname;
        this.openForm.teachersid=[];
      },
      openSubmit: function () {
        let that = this;
        this.$refs.openForm.validate((valid) => {
          if (valid) {
            console.log(that.openForm);
            this.loading = true;
            let para = { cosid:this.openForm.cosid,tids:this.openForm.teacherids };
            API.opencourse(para).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.code) === 0) {
                that.$message.success({showClose: true, message: '成功', duration: 2000});
                that.$refs.openForm.resetFields();
                that.openFormVisible = false;
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
        let ids = this.sels.map(item => item.cosid);
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
      this.handleSearch();
      this.initTeacher();
    }
  }
</script>

<style scoped>

</style>

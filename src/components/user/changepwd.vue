<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main"  >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <br>
        <!--<el-form-item label="原密码">
          <el-input v-model="form.oldPwd"></el-input>
        </el-form-item>-->
        <el-form-item prop="newPwd" label="输入新密码">
          <el-input v-model="form.newPwd" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPwd" label="确认新密码">
          <el-input v-model="form.confirmPwd" maxlength="20"  ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleChangepwd">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import API from '../../api/api_user';
  import {bus} from '../../bus.js'
  export default{

    data(){
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        form: {
          // oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        rules: {
          newPwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
          ],
          confirmPwd: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            { validator : validatePass2, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      handleChangepwd() {
        let that = this;
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.loading = true;
            let args = {
              newpwd:that.form.newPwd
            };
            API.changePwd(args).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.code) === 0) {
                //修改成功
                that.$message.success({showClose: true, message: '修改成功，请重新登录', duration: 2000});
                bus.$emit('goto', '/login');
              } else {
                that.$message.error({showClose: true, message: result.msg||'未知异常', duration: 2000});
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
        //this.$message({message: "此功能只是让你看看，不会开发！", duration: 2000});
      });
    }
  }
  }
</script>

<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum" :loading="loading">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ID">
          <el-input v-model="form.uid" disabled></el-input>
        </el-form-item>

        <el-form-item prop="name" label="姓名">
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item prop="wechat" label="微信">
          <el-input v-model="form.wechat"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSaveProfile">修改并保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_user';
  import {bus} from '../../bus.js'

  export default {
    data() {
      return {
        loading: false,
        form: {
          uid: '',
          name: '',
          email: '',
          phone: '',
          wechat:''
        },
        rules: {
          email: [
            /*{required: true, message: '请输入邮箱', trigger: 'blur'},*/
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
          ]
        },
      }
    },
    methods: {
      handleSaveProfile() {
        let that = this;
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.loading = true;
            let args = {
              info: {
                email:that.form.email,
                phone:that.form.phone,
                wechat:that.form.wechat,
              }
            };
            API.changeProfile(args).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.code) === 0) {
                //修改成功
                let user = JSON.parse(window.localStorage.getItem('access-user'));
                user.info={
                  phone:that.form.phone,
                  wechat:that.form.wechat,
                  email:that.form.email
                };
                localStorage.setItem('access-user', JSON.stringify(user));
                //bus.$emit('setNickName', that.form.nickname);
                that.$message.success({showClose: true, message: '修改成功', duration: 2000});
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
        });
      }
    },
    mounted() {
      let user = localStorage.getItem('access-user');
      if (user) {
        user = JSON.parse(user);
        this.form.uid= user.uid|| '';
        this.form.name = user.name || '';
        if(user.info) {
          user.info = JSON.parse(user.info);
          this.form.phone = user.info.phone || '';
          this.form.wechat = user.info.wechat || '';
          this.form.email = user.info.email || '';
        }
      }
    }
  }
</script>

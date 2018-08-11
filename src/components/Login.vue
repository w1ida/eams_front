<template>

  <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px"

           class="demo-ruleForm login-container" >
    <div class="bg"></div>
    <!-- <h3 class="title">教务管理系统身份认证</h3> -->
    <img src="../assets/images/app_login_topbac.png" style="width: 100%;">
    <el-form-item prop="username">
      <el-input type="text" v-model="account.username" auto-complete="off" placeholder="账号" @keyup.enter.native="handleLogin"></el-input>
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input type="password" v-model="account.pwd" auto-complete="off" placeholder="密码"  @keyup.enter.native="handleLogin" ></el-input>
    </el-form-item>
    <el-form-item prop="usertype">
      <el-radio-group v-model="account.usertype">
        <el-radio border :label="3">学生</el-radio>
        <el-radio border :label="6">教师</el-radio>
        <el-radio border :label="9">部门</el-radio>
      </el-radio-group>
    </el-form-item>
    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="loading">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import API from '../api/api_user';

  export default {
    data() {
      return {
        loading: false,
        account: {
          username: '',
          pwd: '',
          usertype: 3
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ],
          usertype: [
            {required: true, message: '请选择身份', trigger: 'blur'},
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleLogin() {
        let that = this;
        this.$refs.AccountFrom.validate((valid) => {
          if (valid) {
            this.loading = true;
            let loginParams = {name: this.account.username, pwd: this.account.pwd, usertype: this.account.usertype};
            API.login(loginParams).then(function (result) {
              that.loading = false;
              if (result && result.code===0) {
                localStorage.setItem('access-user', JSON.stringify(result.data));
//                that.$store.commit('SET_ROUTERS', user.permissions)
//                that.$router.addRoutes(that.$store.getters.addRouters);
//                that.$router.options.routes = that.$store.getters.routers;
                  that.$router.addRoute();
                  that.$router.push({path: '/'});
                 // location.href="/";
              } else {
                that.$message.error({showClose: true, message: result.msg || '登录失败', duration: 2000});
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
    }
  }
</script>
<style>
  body {
    /* background: #DFE9FB; */
    height: 100%;
  }
  .bg{
    width: 100%;
    height: 100%;
    /*background: url('../assets/images/app_login_bottombac.png') center center no-repeat;*/
    background-color: #eaeaea;
    background-size: 100% 100%;
    z-index: -11;
    position: fixed;
    left: 0;
    top: 0;
  }
</style>
<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 8% auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    background: -ms-linear-gradient(top, #ace, #00C1DE); /* IE 10 */
    background: -moz-linear-gradient(top, #ace, #00C1DE); /*火狐*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00C1DE)); /*谷歌*/
    background: -webkit-linear-gradient(top, #ace, #00C1DE); /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top,#ace, #00C1DE); /*Opera 11.10+*/

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 10px 0px;
    }

  }
</style>

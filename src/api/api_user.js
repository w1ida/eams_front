
import * as API from './'



export default {
  //登录
  login: params => {
    // return API.POST('/api/v1/users/login', params)
    return API.POST(API.HOST+'api/user_login', params)
  },
  //登出
  logout: params => {
    return API.GET(API.HOST+'api/user_logout', params)
  },
  //修改个人信息
  changeProfile: params => {
    return API.POST(API.HOST+'api/user_profile', params)
  },
  changePwd: params => {
    return API.POST(API.HOST+'api/user_changepwd', params)
  },

  //查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/users', params)
  },
}

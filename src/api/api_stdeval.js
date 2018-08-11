
import * as API from './'

export default {

  //查询获取book列表(通过page分页)
  findList: params => {
    return API.POST(API.HOST+'api/stdeval_list', params)
  },

  eval:(params) =>{
    return API.POST(API.HOST+`/api/stdeval_eval`, params)
  },

}

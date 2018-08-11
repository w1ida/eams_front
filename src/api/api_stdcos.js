
import * as API from './'

export default {

  //查询获取book列表(通过page分页)
  findList: params => {
    return API.POST(API.HOST+'api/stdcos_list', params)
  },
  stdList: params => {
    return API.POST(API.HOST+'api/stdcos_tealist', params)
  },

  findScoreList: params => {
    return API.POST(API.HOST+'api/stdcos_allscore', params)
  },

  updateAllocCourse:(params) =>{
    return API.POST(API.HOST+`/api/stdcos_chorqcos`, params)
  },

}

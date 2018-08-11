
import * as API from './'

export default {

  //查询获取book列表(通过page分页)
  findList: params => {
    return API.POST(API.HOST+'api/coursemgr_list', params)
  },

  //查询获取一条
  findById: id => {
    return API.POST(API.HOST+`/api/coursemgr_show` , {  id : id } )
  },

  add: params => {
    return API.POST(API.HOST+`/api/coursemgr_save`, params)
  },
  // update: (id, params) => {
  update: (params) => {
    return API.POST(API.HOST+`/api/coursemgr_save`, params)
  },
  //开设课程
  opencourse: (params) => {
    return API.POST(API.HOST+`/api/coursemgr_opencourse`, params)
  },
  alloccourse:(params) => {
    return API.POST(API.HOST+`/api/coursemgr_alloccourse`, params)
  },
  curriculalist:(params) => {
    return API.POST(API.HOST+`/api/coursemgr_curriculalist`, params)
  },
  curriculadel:(params) => {
    return API.POST(API.HOST+`/api/coursemgr_curriculadel`, params)
  },

  currstdlist:(params) =>{
    return API.POST(API.HOST+`/api/coursemgr_currstdlist`, params)
  },
  updateAllocCourse:(params) =>{
    return API.POST(API.HOST+`/api/coursemgr_updatealloccourse`, params)
  },



  //单个删除book
  remove: id => {
    return API.POST(API.HOST+`/api/coursemgr_del`, [ id ])
  },

  //批量删除，传ids数组
  removeBatch: (ids) => {
    return API.POST(API.HOST+`/api/coursemgr_del`, { ids : ids })
  }

}

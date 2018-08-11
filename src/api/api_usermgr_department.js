
import * as API from './'

export default {

  //查询获取book列表(通过page分页)
  findList: params => {
    return API.POST(API.HOST+'api/usermgr_department_list', params)
  },

  //查询获取一条
  findById: id => {
    return API.POST(API.HOST+`/api/usermgr_department_show` , {  id : id } )
  },

  add: params => {
    return API.POST(API.HOST+`/api/usermgr_department_save`, params)
  },
  // update: (id, params) => {
  update: (params) => {
    return API.POST(API.HOST+`/api/usermgr_department_save`, params)
  },

  //单个删除book
  remove: id => {
    return API.POST(API.HOST+`/api/usermgr_department_del`, [ id ])
  },

  //批量删除，传ids数组
  removeBatch: (ids) => {
    return API.POST(API.HOST+`/api/usermgr_department_del`, { ids : ids })
  }

}

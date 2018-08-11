
import * as API from './'

export default {

  findList: params => {
    return API.POST(API.HOST+'api/scoremgr_list', params)
  },

  update: (params) => {
    return API.POST(API.HOST+`/api/scoremgr_update`, params)
  },

}

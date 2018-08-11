
import * as API from './'

export default {

  findList: params => {
    return API.POST(API.HOST+'api/evalmgr_list', params)
  },

  update: (params) => {
    return API.POST(API.HOST+`/api/evalmgr_doeval`, params)
  },

}

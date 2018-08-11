
import * as API from './'

export default {

  evalList: params => {
    return API.POST(API.HOST+'api/teacher_evallist', params)
  },
  scoreList: params => {
    return API.POST(API.HOST+'api/teacher_scorelist', params)
  },
  courseList: params => {
    return API.POST(API.HOST+'api/teacher_curriculalist', params)
  },
  StdList: params => {
    return API.POST(API.HOST+'api/teacher_stdlist', params)
  },

  update: (params) => {
    return API.POST(API.HOST+`/api/teacher_update`, params)
  },

}

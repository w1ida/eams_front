import Vue from 'vue'

import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'



import UserList from '@/components/user/list'
import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'

import StudentList from '@/components/usermgr/studentlist'
import TeacherList from '@/components/usermgr/teacherlist'
import DepartmentList from '@/components/usermgr/departmentlist'

import ClassList from '@/components/department/classlist'
import CourseList from '@/components/department/courselist'
import AllocCourse from '@/components/department/alloccourse'

import ScoreMgr from '@/components/department/scoremgr'
import EvalMgr from '@/components/department/evalmgr'



import TeacherSearch from '@/components/student/teachersearch'
import SCourseList from '@/components/student/courselist'
import ScoreList from '@/components/student/scorelist'
import StdEval from '@/components/student/evallist'

import TeaEval from '@/components/teacher/evallist'
import TeaScore from '@/components/teacher/score'
import TeaCourse from '@/components/teacher/courselist'
import TeaStdList from '@/components/teacher/studentlist'



// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.localStorage.removeItem('access-user')
    next()
  } else {
    let user = JSON.parse(window.localStorage.getItem('access-user'))
    if (!user) {
      next({path: '/login'});

    } else {
      next()
    }
  }
})

export const asyncRouterMap = [

  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/dashboard',
    leaf: true, // 只有一个节点
    menuShow: true,
    meta: { role: ['3','6','9'] },
    iconCls: 'iconfont icon-home', // 图标样式class
    children: [
      {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true,meta: { role: ['3','6','9'] }}
    ]
  },

  {
    path: '/',
    component: Home,
    name: '我的课程',
    menuShow: true,
    leaf: true,
    iconCls: 'iconfont icon-books1',
    meta: { role: ['3'] },
    children: [
      {path: '/student/choosecourse', component: SCourseList, name: '我的课程', menuShow: true,meta: { role: ['3'] },},
    ]
  },{
    path: '/',
    component: Home,
    name: '成绩查询',
    menuShow: true,
    leaf: true,
    iconCls: 'el-icon-view',
    meta: { role: ['3'] },
    children: [
      {path: '/student/scorelist', component: ScoreList, name: '成绩查询', menuShow: true,meta: { role: ['3'] },},
    ]
  },{
    path: '/',
    component: Home,
    name: '搜索教师',
    menuShow: true,
    leaf: true,
    iconCls: 'el-icon-search',
    meta: { role: ['3'] },
    children: [
      {path: '/student/teachersearch ', component: TeacherSearch , name: '搜索教师', menuShow: true,meta: { role: ['3'] },},
    ]
  },{
    path: '/',
    component: Home,
    name: '教学评价',
    menuShow: true,
    leaf: true,
    iconCls: 'el-icon-star-off',
    meta: { role: ['3'] },
    children: [
      {path: '/student/eval', component: StdEval, name: '教学评价', menuShow: true,meta: { role: ['3'] },},
    ]
  },
  /** Teacher */
  {
    path: '/',
    component: Home,
    name: '任教课程',
    menuShow: true,
    leaf: true,
    iconCls: 'iconfont icon-books',
    meta: { role: ['6'] },
    children: [
      {path: '/teacher/evaluations1', component: TeaCourse, name: '任教课程', menuShow: true,meta: { role: ['6'] },},
    ]
  },  {
    path: '/',
    component: Home,
    name: '学生查询',
    menuShow: true,
    leaf: true,
    iconCls: 'iconfont icon-books',
    meta: { role: ['6'] },
    children: [
      {path: '/teacher/studentlist', component: TeaStdList , name: '学生查询', menuShow: true,meta: { role: ['6'] },},
    ]
  },{
    path: '/',
    component: Home,
    name: '成绩录入',
    menuShow: true,
    leaf: true,
    iconCls: 'iconfont icon-books',
    meta: { role: ['6'] },
    children: [
      {path: '/teacher/score', component: TeaScore, name: '成绩录入', menuShow: true,meta: { role: ['6'] },},
    ]
  },{
    path: '/',
    component: Home,
    name: '查看教评',
    menuShow: true,
    leaf: true,
    iconCls: 'el-icon-star-off',
    meta: { role: ['6'] },
    children: [
      {path: '/teacher/evaluations', component: TeaEval, name: '查看教评', menuShow: true,meta: { role: ['6'] },},
    ]
  },


  {
    path: '/',
    component: Home,
    name: '用户管理',
    menuShow: true,
    leaf: false, // 只有一个节点
    meta: { role: ['9'] },
    iconCls: 'iconfont icon-users', // 图标样式class
    children: [
      {path: '/studentmgr', component: StudentList, name: '学生列表', menuShow: true,
        meta: { role: ['9'] }
      },
      {path: '/teachermgr', component: TeacherList, name: '教师列表', menuShow: true,
        meta: { role: ['9'] }
      },
      {path: '/departmentmgr', component: DepartmentList , name: '部门列表', menuShow: true,
        meta: { role: ['9'] }
      },
    ]
  }, {
    path: '/',
    component: Home,
    name: '班级管理',
    menuShow: true,
    leaf:true,
    meta: { role: ['9'] },
    iconCls: 'iconfont icon-books1',
    children: [
      {path: '/classmgr', component: ClassList, name: '班级管理', menuShow: true,meta: { role: ['9'] }}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '课程列表',
    menuShow: true,
    leaf:true,
    meta: { role: ['9'] },
    iconCls: 'iconfont icon-books',
    children: [
      {path: '/courselist', component: CourseList, name: '课程列表', menuShow: true ,meta: { role: ['9'] }},

    ]
  },{
    path: '/',
    component: Home,
    name: '分配课程',
    menuShow: true,
    menuShow: true,
    leaf:true,
    meta: { role: ['9'] },
    iconCls: 'iconfont icon-books2',
    children: [
      {path: '/alloccourse', component: AllocCourse , name: '分配课程', menuShow: true,meta: { role: ['9'] }}
    ]
  },{
    path: '/',
    component: Home,
    name: '成绩核查',
    menuShow: true,
    leaf:true,
    meta: { role: ['9'] },
    iconCls: 'el-icon-view',
    children: [
      {path: '/scoreMgr', component: ScoreMgr, name: '成绩核查', menuShow: true,meta: { role: ['9'] }}
    ]
  },{
    path: '/',
    component: Home,
    name: '教评管理',
    menuShow: true,
    leaf:true,
    meta: { role: ['9'] },
    iconCls: 'el-icon-star-off',
    children: [
      {path: '/evalmgr', component: EvalMgr , name: '教评管理', menuShow: true,meta: { role: ['9'] }}
    ]
  },


  {
    path: '/',
    component: Home,
    name: '个人信息',
    menuShow: true,
    leaf: true,
    iconCls: 'el-icon-info',
    meta: { role: ['3','6','9'] },
    children: [
      {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true,meta: { role: ['3','6','9'] }},
    ]
  },
  {
    path: '/',
    component: Home,
    name: '修改密码',
    menuShow: true,
    leaf: true,
    iconCls: 'el-icon-edit',
    meta: { role: ['3','6','9'] },
    children: [
      {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true,meta: { role: ['3','6','9'] },}
    ]
  },
  { path: '*', redirect: '/', hidden: true }
];

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}
router.addRoute=function () {
  if(sessionStorage.getItem('menus1'))return;
  let user = JSON.parse(window.localStorage.getItem('access-user'))
  if (user && user.type) {
    let roles = [user.type + ''];
    const accessedRouters = asyncRouterMap.filter(v => {
      if (roles.indexOf('admin') >= 0) return true;
      if (hasPermission(roles, v)) {
        if (v.children && v.children.length > 0) {
          v.children = v.children.filter(child => {
            if (hasPermission(roles, child)) {
              return child
            }
            return false;
          });
          return v
        } else {
          return v
        }
      }
      return false;
    });
    /***  添加动态路由 */
    /*accessedRouters.forEach(function (item) {
      router.options.routes.push(item)
    });*/
    // sessionStorage.setItem('menus', JSON.stringify(router.options.routes));
    accessedRouters.concat(router.options.routes)
    sessionStorage.setItem('menus', JSON.stringify(accessedRouters));
    router.addRoutes(asyncRouterMap);
    console.log(router);
  }
}
router.addRoute()
export default router

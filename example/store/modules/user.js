import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { changePassword } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: '',
    // mock为admin
    roles: [],
    userName: '',
    roleCode: '',
    roleName: '',
    resourceCode: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_ROLECODE: (state, roleCode) => {
      state.roleCode = roleCode
    },
    SET_RESOURCECODE: (state, resourceCode) => {
      state.resourceCode = resourceCode
    },
    SET_ROLENAME: (state, roleName) => {
      state.roleName = roleName
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.userCode.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          if (response.data.errorCode) {
            // console.log(response, 'errorCode')
            resolve(response)
          }
          if (response.data.token) {
            commit('SET_TOKEN', response.data.token)
            setToken(response.data.token)
            // console.log(response, 'cccccc.store.modules.user.settoken')
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改密码
    ChangePassword({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        changePassword(userInfo).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          // 由于mockjs 不支持自定义状态码只能这样hack
          if (!response.data) {
            reject('Verification failed, please login again.')
          }
          const data = response.data
          // console.log(data)

          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array!')
          // }
          if (data.roleCodes) {
            commit('SET_ROLECODE', data.roleCodes)
            // commit('SET_ROLES', ['admin', data.roleCode])
            commit('SET_ROLES', data.roleCodes)
          } else {
            reject('getUserInfo role must be not null ')
          }
          commit('SET_ROLENAME', data.roleNames)
          commit('SET_NAME', data.userName)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          commit('SET_RESOURCECODE', data.resourceCode)
          commit('SET_CODE', data.userCode)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ROLE', '')
          commit('SET_NAME', '')
          removeToken()
          localStorage.clear()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        removeToken()
        resolve()
      })
    },
    // accessToken 刷新
    UpdateToken({ commit }, token) {
      // console.log(token, 'updateToken')
      return new Promise(resolve => {
        commit('SET_TOKEN', token)
        resolve()
      })
    },
    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_RESOURCECODE', data.resourceCode)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', { resource: data.resourceCode }) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user

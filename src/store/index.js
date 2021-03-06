import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex, axios)

export default new Vuex.Store({
  state: {
    dataForm: {
      fullname: '',
      email: '',
      password: '',
      password2: '',
      currentForm: false,
      errorName: false,
      errorEmail: false,
      errorPassword: false,
      errorPassword2: false,
      typePassword: 'password',
      hiddenPassword: true
    },
    message: null,
    dataUser: {},
    peopleDetail: [],
    modalLogin: false
  },
  getters: {
    dataForm: state => state.dataForm,
    isLogin: () => {
      if (localStorage.token) return true
      else return false
    }
  },
  mutations: {
    SET_PEOPLE_DETAIL (state, peopleDetail) {
      state.peopleDetail = peopleDetail
    },
    TOGGLE_HIDDEN (state) {
      state.dataForm.hiddenPassword = !state.dataForm.hiddenPassword
      if (state.dataForm.hiddenPassword) state.dataForm.typePassword = 'password'
      if (!state.dataForm.hiddenPassword) state.dataForm.typePassword = 'text'
    },
    CHECK_NAME (state) {
      if (state.dataForm.fullname.length > 0) state.dataForm.errorName = false
      else state.dataForm.errorName = true
    },
    CHECK_EMAIL (state) {
      const emailVerify = state.dataForm.email.match(/^\w+[\w.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/)
      if (emailVerify === null && state.dataForm.email.length > 0) state.dataForm.errorEmail = true
      else state.dataForm.errorEmail = false
    },
    CHECK_PASSWORD (state) {
      if (state.dataForm.password.length <= 0) state.dataForm.errorPassword = true
      else state.dataForm.errorPassword = false
    },
    CHECK_PASSWORD2 (state) {
      if (state.dataForm.password2 !== state.dataForm.password || state.dataForm.password2.length === 0) state.dataForm.errorPassword2 = true
      else state.dataForm.errorPassword2 = false
    },
    SUBMIT_EMAIL (state) {
      if (state.dataForm.email.length === 0 || state.dataForm.errorEmail) return
      state.dataForm.currentForm = true
    },
    SUBMIT_REGISTER (state, data) {
      state.message = data.message
      state.dataUser = data.data
    },
    SUBMIT_LOGIN (state, data) {
      if (data.status !== 200) return
      state.message = data.message
      state.dataUser = data.data
      localStorage.token = data.data.token
    }
  },
  actions: {
    loadPeopleDetail ({ commit }) {
      axios
        .get(`${process.env.VUE_APP_URL_API}user/1`)
        .then(res => {
          // console.log(res.data)
          const peopleDetail = res.data
          commit('SET_PEOPLE_DETAIL', peopleDetail)
        })
    },
    submitRegister ({ commit, state }) {
      return new Promise((resolve) => {
        if (state.dataForm.email.length === 0 || state.dataForm.errorEmail) return
        state.dataForm.currentForm = true

        const data = {
          fullname: state.dataForm.fullname,
          email: state.dataForm.email,
          password: state.dataForm.password
        }
        axios
          .post(`${process.env.VUE_APP_URL_API}user/register`, data)
          .then(res => {
            commit('SUBMIT_REGISTER', res.data)
            resolve(res)
          })
      })
    },
    submitLogin ({ commit, state }) {
      return new Promise((resolve, reject) => {
        const data = {
          email: state.dataForm.email,
          password: state.dataForm.password
        }
        axios
          .post(`${process.env.VUE_APP_URL_API}user/login`, data)
          .then(res => {
            commit('SUBMIT_LOGIN', res.data)
            resolve(res)
          })
      })
    }
  },
  modules: {
  }
})

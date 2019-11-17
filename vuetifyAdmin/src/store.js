import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    notificationsObject: '',
    businessArr: '',
    applicantArr: '',
    campaignArr: '',
    user: null,
    authError: null,
    loggedIn: false
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setError (state, payload) {
      state.authError = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    signUserIn ({commit}, payload) {
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.user.uid
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid})
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      location.reload()
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
})

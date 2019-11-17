import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from './router'
import Vuex from 'vuex'
import { store } from './store.js'

Vue.use(Vuex)
Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyD9V-g85UHUsPJOuEdK7jARC-sO23eUHTI',
      authDomain: 'instawork-814df.firebaseapp.com',
      databaseURL: 'https://instawork-814df.firebaseio.com',
      projectId: 'instawork-814df',
      storageBucket: 'instawork-814df.appspot.com',
      messagingSenderId: '76780395694'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.state.user.id === 'rKECOkpKfaZc9SGvuURGqMckElE3' || this.$store.state.user.id === 'vRmJGYHV9GfQfPO0Jr64aULjZAw2' ? this.$store.state.loggedIn = true : this.$store.state.logout()
      } else {
        this.$store.state.loggedIn = false
        console.log('user is not signed in says main.js')
      }
    })
  }
})

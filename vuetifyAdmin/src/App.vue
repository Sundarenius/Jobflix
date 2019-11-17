
<template>
  <v-app>
    <!-- EJ INLOGGAD -->
    <v-layout v-if="!loggedIn" mt-5 justify-center>
      <v-flex xs12 md5>
        <v-text-field
          label="X"
          v-model="mailLogin"
        ></v-text-field>
        <v-text-field
          label="Y"
          v-model="passLogin"
          password
          type="password"
        ></v-text-field>
        <v-btn @click="onLogin" block flat> <v-icon>arrow_right</v-icon> </v-btn>
      </v-flex>
    </v-layout>

     <!-- OM INLOGGAD -->
    <div v-if="loggedIn">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="grey lighten-3"
      app
    >
      <v-list
        dense
        class="grey lighten-3 mt-2"
      >
        <v-btn :to="item.link" class="my-3 py-2" block flat v-bind:key="i" v-for="(item, i) in items">
          <v-icon class="mr-4">{{ item.icon }}</v-icon>
          {{ item.text}}
          <v-spacer></v-spacer>
        </v-btn>
      </v-list>
      <v-btn @click="logOut" class="mt-5" block flat>
        Logga ut
        <v-spacer></v-spacer>
      </v-btn>
      <v-btn v-if="$store.state.user.id === 'rKECOkpKfaZc9SGvuURGqMckElE3'" @click="getAllData(1)" class="mt-5" block flat>
        <v-icon class="mr-4">cloud_download</v-icon>
        Hämta företags data
        <v-spacer></v-spacer>
      </v-btn>
      <v-btn @click="getAllData(2)" class="mt-5" block flat>
        <v-icon class="mr-4">cloud_download</v-icon>
        Hämta jobbsökar data
        <v-spacer></v-spacer>
      </v-btn>
      <v-btn v-if="$store.state.user.id === 'rKECOkpKfaZc9SGvuURGqMckElE3'" @click="customFunction" class="mt-5" block flat>
        Special Funktion
        <v-icon>check_circle</v-icon>
        <v-spacer></v-spacer>
      </v-btn>
      <v-btn v-if="0" @click="test">
        Test
      </v-btn>
    </v-navigation-drawer>
    
    <v-toolbar fixed color="amber" app clipped-left>
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="pointer" @click="$router.push('/')">
        <span class="title ml-3 mr-5">
          <span class="jobflix-title">
              <v-icon class="black--text play-icon-title">play_arrow</v-icon>
              <span class="jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
              <span style="font-weight:bold" class="black--text title">- ADMIN PAGE</span>
            </span>
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </div>

  <v-dialog max-width="400" v-model="customFunctionDone">
    <v-card>
      <v-card-title>
        <div class="title">
          customFunction färdig
          <v-icon>check_circle</v-icon>
        </div>
      </v-card-title>
    </v-card>
  </v-dialog>

  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data: () => ({
    customFunctionDone: false,
    drawer: null,
    items: [
      { icon: 'notifications', text: 'Notifikationer', link: '/' },
      { icon: 'business', text: 'Företag', link: '/business' },
      { icon: 'person', text: 'Jobbsökare', link: '/applicants' },
      { icon: 'payment', text: 'Betalningar', link: '/payments' },
      { icon: 'calendar_today', text: 'Kommande möten', link: '/meetings' },
      { icon: 'people', text: 'Senaste presentationer', link: '/presentations' },
      { icon: 'attach_money', text: 'Säljpanel', link: '/salj' }
    ],
    mailLogin: '',
    passLogin: ''
  }),
  props: {
    source: String
  },
  watch: {
    loggedIn: function () {
      if (this.loggedIn === true) {
        this.getFirebaseData()
      }
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.loggedIn
    }
  },
  methods: {
    test () {
      console.log(this.$store.state.user.id)
    },
    customFunction () {
      console.log('customFunction triggered')
      // let global = this
      // // typeOfJobs
      // let newObj = {
      //   bransch: '',
      //   category: '',
      //   region: ''
      // }
      // firebase.database().ref('applicants')
      //   .once('value', response => {
      //     const res = response.val()
      //     for (let i in res) {
      //       if (!res[i].profileInfo.hasOwnProperty('typeOfJobs')) {
      //         console.log(i)
      //         var dbId = JSON.stringify(i)
      //         firebase.database().ref('applicants').child(JSON.parse(dbId) + '/profileInfo/typeOfJobs')
      //           .set(newObj)
      //       }
      //     }
      //     global.customFunctionDone = true
      //   })
    },
    logOut () {
      this.$store.dispatch('logout')
    },
    onLogin () {
      // Vuex
      console.log({email: this.mailLogin, password: this.passLogin})
      this.$store.dispatch('signUserIn', {email: this.mailLogin, password: this.passLogin})
    },
    getFirebaseData () {
      if (this.loggedIn && (this.$store.state.user.id === 'rKECOkpKfaZc9SGvuURGqMckElE3' || this.$store.state.user.id === 'vRmJGYHV9GfQfPO0Jr64aULjZAw2')) {
        //  Lyssna på notifikationer *********************************
        firebase.database().ref('admin').child('notifications').on('value', response => {
          console.log('notificationsWatchFromFirebase triggered')
          const res = response.val()
          console.log(res)
          const arr = []
          for (let i in res) {
            if (res[i].hasOwnProperty('id')) {
              arr.push(res[i])
            }
          }
          this.$store.state.notificationsObject = arr
        })
      }
    },
    getAllData (par) {
      //  Hämta företagsinfo *********************************
      if (par === 1) {
        firebase.database().ref('businessAccounts')
        .once('value', response => {
          const res = response.val()
          const businessArr = []
          for (let i in res) {
            if (res[i].corpInfo.hasOwnProperty('businessLogo')) {
              businessArr.push(res[i].corpInfo)
            }
          }
          console.log('businessArr: ', businessArr)
          this.$store.state.businessArr = businessArr
        })
      }
      //  Hämta applicant-info *********************************
      if (par === 2) {
        firebase.database().ref('applicants')
        .once('value', response => {
          const res = response.val()
          const applicantArr = []
          const campaignArr = []
          console.log(res)
          for (let i in res) {
            if (res[i].profileInfo.hasOwnProperty('campaigns')) {
              applicantArr.push(res[i].profileInfo)
            }
            for (var x in res[i].profileInfo.campaigns) {
              if (res[i].profileInfo.campaigns[x].hasOwnProperty('id')) {
                res[i].profileInfo.campaigns[x].profile = res[i].profileInfo.profil
                campaignArr.push(res[i].profileInfo.campaigns[x])
              }
            }
          }
          console.log('applicantArr: ', applicantArr)
          this.$store.state.applicantArr = applicantArr
          this.$store.state.campaignArr = campaignArr
        })
      }
    }
  },
  created () {
    // Created
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}
.display-1 {
  font-weight: bold;
}
.jobflix-title {
  padding-right: 1px;
  padding-left: 15px;
  border-radius: 3px;
  font-family: unset;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 26px;
  letter-spacing: 2px;
  position: relative;
}
.jobflix-title1 {
  color: #000;
}
.jobflix-title2 {
  color: darkblue;
}
.play-icon-title {
  position: absolute;
  z-index: 2;
  left: -4px;
  top: 1px;
}
.hoverCard:hover {
  box-shadow: 1px 1px 3px 3px lightgrey !important;
}
.topRight {
  position: absolute;
  top: 0px;
  right: 0px;
}
.topBottom {
  position: absolute;
  bottom: 0px;
  right: 0px;
}
.closeModal {
  position: absolute;
  top:5px;
  right: 5px;
}
</style>
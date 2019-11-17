<template>
  <div>
    <v-container>
      <v-layout wrap>
        <v-flex mt-2 px-3 xs12>
          <div class="display-1">
            Arbetssökande: <span class="success--text text--darken-2">{{ applicantArr.length }}</span> st.
          </div>
          <div>
            <v-select
              label="Sortera"
              :items="sortItems"
              v-model="sortItemsModel"
            ></v-select>
          </div>
          <div class="body-1">
            Sidan uppdateras bara när sidan laddas om.
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap mt-4>
        <v-flex @click="u.hiddenContent = !u.hiddenContent, updateUserRequests(u)" px-2 py-2 v-bind:key="u.userId" v-for="u in applicantArr" xs12 md4>
          <v-card class="hoverCard pointer">
            <v-card-title>
              <div class="title">
                {{ u.profil.fullName }}
              </div>
            </v-card-title>
            <v-card-text>
              <div style="font-weight:bold;margin-top:-15px" class="subheading">
                Senast inloggad: <span class="success--text text--darken-2">{{ u.lastLogIn }}</span>
              </div>
              <div style="font-weight:bold" class="subheading">
                Registrerad: <span class="success--text text--darken-2">{{ u.registered }}</span>
              </div>
              <div style="font-weight:bold" class="subheading">
                Presentationer: <span class="success--text text--darken-2">{{ Object.keys(u.campaigns).length - 1 }}</span> st.
              </div>
              <div style="font-weight:bold" class="subheading">
                Tel. nr: <span class="success--text text--darken-2">{{ u.profil.phoneNr }}</span> st.
              </div>
              <div class="pt-3" v-show="u.hiddenContent">
                <v-divider class="pb-1"></v-divider>
                <div class="body-2">
                  Kommande möten: <span class="success--text text--darken-3">{{ comingMeetings(u.events.appointments) }}</span>
                </div>
                <div class="body-2">
                  Obes. förfrågningar: <span class="success--text text--darken-3">{{ Object.keys(u.events.requests).length - 1 }}</span>
                </div>
                <div class="body-2">
                  Mail: <span class="success--text text--darken-3">{{ u.profil.email }}</span>
                </div>
                <div class="body-2">
                  Profilstyrka: <span class="success--text text--darken-3">{{ Math.ceil(u.profileStrenghtValue) }} %</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <div v-if="userRequests !== ''">
      <v-dialog max-width="600" v-model="showUserRequests">
        <v-card>
          <v-card-title class="title primary lighten-3 white--text justify-center">
            <div>
              Obesv. förfrågningar
            </div>
          </v-card-title>
          <v-card-text>
            <div class="body-2">Användare: {{ userRequests.profil.fullName }}</div>
            <div class="body-1">Mail: {{ userRequests.profil.email }}</div>
            <div v-bind:key="index" v-for="(r, index) in userRequests.events.requests">
              <div v-if="r.accepted === 0" class="my-1 grey lighten-4 py-2 px-2">
                <div class="body-2">Företag: {{ r.corp }}</div>
                <div class="body-2">Kontakt: {{ r.name }}</div>
                <div class="body-2">Datum:</div>
                <div v-bind:key="i" v-for="(x, i) in r.dates" class="body-2">
                  {{ x.date }} kl. {{ x.time }}
                </div>
                <div class="body-2">Skickat: {{ new Date(r.dateAndTimeAtSend).toString().substr(0, 24) }}</div>
              </div>
            </div>
            <div>
              <div class="mt-4">
                <p class="subheading" style="margin-bottom:-0px">
                  Typ av jobb:
                </p>
                <div class="body-1">
                  Bransch: 
                  <span class="body-2">{{ userRequests.typeOfJobs.bransch }}</span>
                </div>
                 <div class="body-1">
                  Kategori: 
                  <span class="body-2">{{ userRequests.typeOfJobs.category }}</span>
                </div>
                <div class="body-1">
                  Tel. nr: 
                  <span class="body-2">{{ userRequests.profil.phoneNr }}</span>
                </div>
              </div>
              <v-btn @click="userProfileObj = userRequests.profil, showUsersProfile = true" flat round small class="primary">
                Profil
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <!-- DIALOG för FÖRHANDSGRANSKNING AV PROFIL INLOGGAD -->
    <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" v-model="showUsersProfile" width="950">
      <v-card v-if="userProfileObj !== ''">
          <v-flex :px-2="$vuetify.breakpoint.mdAndUp" :py-2="$vuetify.breakpoint.mdAndUp" class="grey lighten-3" xs12>
            <v-card>
              <v-layout v-show="$vuetify.breakpoint.mdAndUp" row>
              <v-flex xs12>
                <v-img height="180px" width="100%" :src="userProfileObj.backgroundImg.i">
                </v-img>
                <div class="closeModal">
                  <v-btn flat fab small class="secondary">
                    <v-icon @click="showUsersProfile = false" large class="white--text">close</v-icon>
                  </v-btn>
                </div>
              </v-flex>
              </v-layout>
              <v-layout :py-2="$vuetify.breakpoint.smAndUp" row wrap>
                <v-flex pl-1 v-show="$vuetify.breakpoint.mdAndUp" xs2>
                    <v-img
                      style="border:3px solid lightgray;margin-top:-50px;border-radius:10px"
                      width="135px"
                      contain
                      :src="userProfileObj.profilePic.i"
                    ></v-img>
                </v-flex>
                <v-flex style="position:relative" v-show="$vuetify.breakpoint.smAndDown" xs12>
                  <div class="closeModal">
                    <v-btn @click="showUsersProfile = false" small fab flat style="z-index:20" class="secondary">
                      <v-icon medium class="white--text">close</v-icon>
                    </v-btn>
                  </div>
                  <v-img
                    width="100%"
                    height="100px"
                    :src="userProfileObj.backgroundImg.i"
                  ></v-img>
                    <img
                      style="border:1px solid lightgray;margin-top:0px;position:absolute;bottom:-6px;left:16px;border-radius:10px"
                      :src="userProfileObj.profilePic.i"
                      height="95px"
                    >
                </v-flex>
              <v-flex pl-2 md9 xs12 :pr-2="$vuetify.breakpoint.mdAndDown">
              <div class="text-xs-left display-1 pt-3" style="font-weight:bold">
                {{ userProfileObj.fullName }}
              </div>
                <div v-if="userProfileObj.title !== 'Skriv in din titel / titlar.' && userProfileObj.title !== ''" class="teal--text body-2 py-1">{{ userProfileObj.title }}</div>

                <div v-if="userProfileObj.description !== 'Beskriv med 1 till 2 meningar vad du gör för något och vad för typ av tjänster du söker.' && userProfileObj.description !== ''" class="body-1">{{ userProfileObj.description }}</div>

                <div v-if="userProfileObj.externLink.includes('http')" class="body-2 pt-1" style="margin-bottom:-7px">
                  <a target="_blank" :href="userProfileObj.externLink">{{ userProfileObj.externLink }}</a>
                </div>

              <div class="pt-3 mb-2">
                <v-chip small v-bind:key="x" v-for="x in userProfileObj.competences" label color="success" text-color="white">
                  <v-icon small class="pr-2">label</v-icon>{{ x }}
                </v-chip>
              </div>
              </v-flex>
              </v-layout>
              </v-card>

              <v-card class="mt-2">
                <v-layout py-2 px-3 row wrap>
                  <v-flex :pr-5="$vuetify.breakpoint.mdAndUp" md8 xs12>
                    <div class="title py-2 black--text"><v-icon class="black--text">work</v-icon> Erfarenhet</div>
                    <v-divider class="teal my-1"></v-divider>
                    <v-layout py-3 row wrap>
                      <v-flex v-bind:key="exp.id" v-for="exp in userProfileObj.experience" style="position:relative" class="mb-3" xs12>
                        <div style="font-weight:bold" class="subheading grey--text">
                          {{ exp.businessName }}
                        </div>
                      
                        <div class="subheading black--text" style="font-weight:bold">
                          {{ exp.workTitle }}
                        </div>
                        <div class="grey--text py-1">
                          <v-icon small>calendar_today</v-icon> <span>{{ exp.workPeriod }}</span>
                        </div>
                        <div style="margin-bottom:-15px" class="body-1 pt-2">
                          <p v-bind:key="x" v-for="x in exp.descriptionArr">
                            {{ x }}
                          </p>
                        </div>
                        <div class="pt-3 mb-2">
                          <v-chip small v-bind:key="x" v-for="x in exp.competences" label color="success" text-color="white">
                            <v-icon small class="pr-2">label</v-icon>{{ x }}
                          </v-chip>
                        </div>
                        <v-divider></v-divider>
                      </v-flex>
                    </v-layout>
                  </v-flex>
        
                <!-- Utbildning -->
                  <v-flex md4 xs12>
                    <div class="title py-2 black--text"><v-icon class="black--text">school</v-icon> Utbildning</div>
                    <v-divider class="teal my-1"></v-divider>
                    <v-layout py-3 row wrap>
                      <v-flex style="position:relative" class="mb-3" v-bind:key="school.id" v-for="school in userProfileObj.education" xs12>
                        <div class="body-2 grey--text">
                          {{ school.schoolName }}
                        </div>
                        <div class="subheading black--text" style="font-weight:bold">
                          {{ school.subject }}
                        </div>
                        <div class="grey--text py-1">
                          <v-icon small>calendar_today</v-icon> <span>{{ school.eduPeriod }}</span>
                        </div>
                        <div class="pt-3 mb-2">
                          <v-chip small v-bind:key="x" v-for="x in school.competences" label color="success" text-color="white">
                            <v-icon small class="pr-2">label</v-icon>{{ x }}
                          </v-chip>
                        </div>
                        <v-divider></v-divider>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                </v-layout>
              </v-card>

            </v-flex>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      sortItems: ['Senaste registrerad', 'Äldst registrerad', 'Senast inloggad', 'Flest presentationer', 'Högst profilstyrka'],
      sortItemsModel: 'Senaste registrerad',
      userRequests: '',
      showUserRequests: false,
      hiddenContent: false,
      showUsersProfile: false,
      userProfileObj: ''
    }
  },
  methods: {
    updateUserRequests (user) {
      console.log(user)
      this.userRequests = user
      this.showUserRequests = true
    },
    comingMeetings (m) {
      const result = []
      for (var i in m) {
        if (m[i].hasOwnProperty('acceptedTime')) {
          if (m[i].acceptedTime.date.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
            result.push('x')
          }
        }
      }
      return result.length
    },
    profileStrenghtValue (p) {
      let add = 6.1
      let points = 0
      points = p.profilePic !== '' ? points += 4 : points += 0
      points = p.title !== '' ? points += add : points += 0
      points = p.description !== '' ? points += add : points += 0
      points = p.competences.length > 0 ? points += add : points += 0
      // Arbete
      points = p.experience.length > 0 ? points += add : points += 0
      if (p.experience.length > 0) {
        points = p.experience[0].description !== '' ? points += 3 : points += 0
        points = p.experience[0].businessName !== '' ? points += add : points += 0
        points = p.experience[0].workTitle !== '' ? points += add : points += 0
        points = p.experience[0].workPeriod !== 'Klicka för att välja start/slut datum' ? points += add : points += 0
      }
      points = p.experience.length > 1 || p.education.length > 1 ? points += add : points += 0
      if (p.experience.length > 1) {
        points = p.experience[1].description !== '' ? points += 3 : points += 0
        points = p.experience[1].businessName !== '' ? points += add : points += 0
        points = p.experience[1].workTitle !== '' ? points += add : points += 0
        points = p.experience[1].workPeriod !== 'Klicka för att välja start/slut datum' ? points += add : points += 0
      } else if (p.education.length > 1) {
        points = p.education[1].schoolName !== '' ? points += 4.6 : points += 0
        points = p.education[1].subject !== '' ? points += 4.6 : points += 0
        points = p.education[1].eduPeriod !== 'Klicka för att välja start/slut datum' ? points += 4.6 : points += 0
        points = p.education[1].schoolType !== '' ? points += 4.6 : points += 0
      }
      // Utbildning
      points = p.education.length > 0 ? points += add : points += 0
      if (p.education.length > 0) {
        points = p.education[0].schoolName !== '' ? points += add : points += 0
        points = p.education[0].subject !== '' ? points += add : points += 0
        points = p.education[0].eduPeriod !== 'Klicka för att välja start/slut datum' ? points += add : points += 0
        points = p.education[0].schoolType !== '' ? points += add : points += 0
      }
      return points
    }
  },
  computed: {
    applicantArr () {
      let arr = []
      for (let i in this.$store.state.applicantArr) {
        this.$store.state.applicantArr[i].hiddenContent = false
        this.$store.state.applicantArr[i].registeredDate = new Date(this.$store.state.applicantArr[i].registered.substr(0, 10).toString()).getTime()
        this.$store.state.applicantArr[i].latestLogin = new Date(this.$store.state.applicantArr[i].lastLogIn.substr(0, 10).toString()).getTime()
        this.$store.state.applicantArr[i].profileStrenghtValue = this.profileStrenghtValue(this.$store.state.applicantArr[i].profil)
        arr.push(this.$store.state.applicantArr[i])
      }
      arr.sort((a, b) => {
        if (this.sortItemsModel === 'Senaste registrerad') {
          return b.registeredDate - a.registeredDate
        } else if (this.sortItemsModel === 'Äldst registrerad') {
          return a.registeredDate - b.registeredDate
        } else if (this.sortItemsModel === 'Senast inloggad') {
          return b.latestLogin - a.latestLogin
        } else if (this.sortItemsModel === 'Flest presentationer') {
          return (Object.keys(b.campaigns).length - 1) - (Object.keys(a.campaigns).length - 1)
        } else if (this.sortItemsModel === 'Högst profilstyrka') {
          return b.profileStrenghtValue - a.profileStrenghtValue
        }
      })
      return arr
    }
  }
}
</script>


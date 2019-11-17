<template>
  <div>
    <v-container>
      <v-layout row wrap>
        <v-flex mt-2 px-3 xs12 md6>
          <div class="display-1">
            Företag: <span class="success--text text--darken-2">{{ businessArr.length }}</span> st.
          </div>
          <div class="body-1">
            Sidan uppdateras bara när sidan laddas om.
          </div>
        </v-flex>
        <v-flex xs12 md3>
          <v-select
            disabled
            outline
            model="filterModel"
            label="Sortera"
            :items="filter"  
          ></v-select>
        </v-flex>
        <v-layout mt-4 row wrap>
          <v-flex v-bind:key="b.orgNr" v-for="b in businessArr" px-2 py-2 xs12 md6>
            <v-card class="hoverCard">
              <v-card-title>
                <div style="font-weight:bold" class="title">
                  {{ b.businessName }}
                </div>
              </v-card-title>
              <v-card-text>
                <div style="font-weight:bold;margin-top:-10px" class="subheading">
                  Senast inloggad: <span class="success--text text--darken-3">
                    {{ latestLogin(b) }}
                  </span>
                </div>
                <div style="font-weight:bold" class="subheading">
                  Registerat: <span class="success--text text--darken-3">
                    {{ b.registered }}
                  </span>
                </div>
                <div style="font-weight:bold" class="subheading">
                  Total kom. möten: <span class="success--text text--darken-3">
                    {{ giveMeAllMeetings(b) }}
                  </span>
                </div>
                <div style="font-weight:bold" class="subheading">
                  Totalt bevakningar: <span class="success--text text--darken-3">
                    {{ giveMeStat(b, 'bevakningar') }}
                  </span>
                </div>
                <div style="font-weight:bold" class="subheading">
                  Totalt annonser: <span class="success--text text--darken-3">
                    {{ giveMeStat(b, 'ads') }}
                  </span>
                </div>
                <div v-bind:key="u.userId" v-for="u in giveMeAllUsers(b)" class="grey lighten-3 my-2">
                  <div @click="showUserInfo = !showUserInfo" style="font-weight:bold" class="subheading px-1 py-1 pointer">
                    {{ u.fullName }}
                    <v-icon>{{ showUserInfo ? 'arrow_drop_up' : 'arrow_drop_down' }}</v-icon>
                  </div>
                  <div class="py-1 px-1" v-show="showUserInfo">
                    <div class="body-2">
                      Inloggad: {{ u.lastLogIn }}
                    </div>
                    <div class="body-2">
                      Kommande möten: {{ Object.keys(u.events.appointments).length - 1 }}
                    </div>
                    <div class="body-2">
                      Bevakningar: {{ Object.keys(u.bevakningar).length - 1 }}
                    </div>
                    <div class="body-2">
                      Annonser: {{ Object.keys(u.ads).length - 1 }}
                    </div>
                    <div class="body-2 pt-1">
                      Mail: {{ u.email }}
                    </div>
                    <div class="body-2 pt-1">
                      Tel: {{ u.phoneNr }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
        </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showUserInfo: false,
      filterModel: 'Senast inloggad',
      filter: [ 'Senast inloggad', 'Registerad', 'Flest användare', 'Flest möten', 'Flest bev.', 'Flest annonser' ]
    }
  },
  methods: {
    giveMeStat (b, what) {
      let result = 0
      console.log(b)
      for (var i in b.users) {
        result += (Object.keys(b.users[i].user[what]).length - 1)
      }
      return result
    },
    giveMeAllMeetings (b) {
      let result = 0
      console.log(b)
      for (var i in b.users) {
        for (var ii in b.users[i].user.events.appointments) {
          if (b.users[i].user.events.appointments[ii].hasOwnProperty('acceptedTime')) {
            if (b.users[i].user.events.appointments[ii].acceptedTime.date.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
              result++
            }
          }
        }
      }
      return result
    },
    giveMeAllUsers (b) {
      const arr = []
      for (var i in b.users) {
        arr.push(b.users[i].user)
      }
      return arr
    },
    latestLogin (b) {
      console.log(b)
      let result = '0'
      let realResult
      for (var i in b.users) {
        if (b.users[i].user.lastLogIn.replace(/-/g, '').replace(/:/g, '').replace(' ', '') > result) {
          result = b.users[i].user.lastLogIn.replace(/-/g, '').replace(/:/g, '').replace(' ', '')
          realResult = b.users[i].user.lastLogIn
        }
      }
      return realResult
    }
  },
  computed: {
    businessArr () {
      return this.$store.state.businessArr
    }
  }
}
</script>


<template>
  <div>
    <v-container>
      <v-layout mb-4 row wrap>
        <v-flex mt-2 px-3 xs12 md6>
          <div class="display-1">
            Kommande möten: <span class="success--text text--darken-2">{{ meetingsArr.length }}</span> st.
          </div>
          <v-select
            label="Visa kommande/gamla"
            :items="['Kommande', 'Gamla']"
            v-model="whatMeetings"
          ></v-select>
        </v-flex>
      </v-layout>

      <v-layout v-if="meetingsArr.length > 0" row wrap>
        <v-flex @click="showInfo = x, openInfo = true" px-2 py-2 v-bind:key="index" v-for="(x, index) in meetingsArr" xs12 md4>
          <v-card class="hoverCard pointer">
            <v-card-text>
              <v-layout row>
                <v-flex style="border-right:1px solid lightgrey" xs6>
                  <div class="body-1">
                    Jobbsökande:
                  </div>
                  <div class="body-2">
                    {{ x.userCampaign.name }}
                  </div>
                  <div class="body-1">
                    Tid:
                  </div>
                  <div class="body-2 success--text text--darken-3">
                    {{ x.acceptedTime.date }} kl. {{ x.acceptedTime.time }}
                  </div>
                </v-flex>
                <v-flex pl-2 xs6>
                  <div class="body-1">
                    Företagskontakt:
                  </div>
                  <div class="body-2">
                    {{ x.name }}
                  </div>
                  <div class="body-2">
                    {{ x.corp }}
                  </div>
                  <div class="body-1">
                    Typ:
                  </div>
                  <div class="body-2 orange--text text--darken-3">
                    {{ x.type }}
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <div v-if="showInfo !== ''">
        <v-dialog v-model="openInfo" max-width="700">
          <v-card>
            <v-card-title class="justify-center primary lighten-3">
              <div class="display-1 white--text">
                {{ showInfo.corp }}
              </div>
            </v-card-title>
            <v-card-text class="text-xs-center">
              <div style="font-weight:bold" class="subheading pb-1">
                Jobbsökande: {{ showInfo.userCampaign.name }}
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Företagskontakt: {{ showInfo.name }}
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Tid: {{ showInfo.acceptedTime.date }} kl. {{ showInfo.acceptedTime.time }}
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Typ: {{ showInfo.type }}
              </div>
              <div style="font-weight:bold" v-if="showInfo.type === 'Personligt möte'" class="subheading pb-1">
                {{ showInfo.adress }}
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Mail till Företagskontakt: <span class="success--text text--darken-2">{{ showInfo.businessUserMail }}</span>
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Mail till Jobbsökande: <span class="success--text text--darken-2">{{ showInfo.userCampaign.email }}</span>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn block flat @click="openInfo = false">
                Stäng
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      whatMeetings: 'Kommande',
      msg: '',
      applicantMeetingsArr: [],
      openInfo: false,
      showInfo: ''
    }
  },
  computed: {
    meetingsArr () {
      return this.applicantMeetingsArr.filter(val => {
        if (this.whatMeetings === 'Kommande') {
          return val.acceptedTime.date.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')
        } else {
          return val.acceptedTime.date.replace(/-/g, '') < new Date().toISOString().substr(0, 10).replace(/-/g, '')
        }
      })
    }
  },
  created () {
    console.log('created from meetings.vue')
    console.log(this.$store.state.applicantArr)
    const applicantMeetings = []
    for (var i in this.$store.state.applicantArr) {
      for (var ii in this.$store.state.applicantArr[i].events.appointments) {
        if (this.$store.state.applicantArr[i].events.appointments[ii].hasOwnProperty('acceptedTime')) {
          applicantMeetings.push(this.$store.state.applicantArr[i].events.appointments[ii])
        }
      }
    }
    applicantMeetings.sort((a, b) => {
      return a.acceptedTime.date.replace(/-/g, '') - b.acceptedTime.date.replace(/-/g, '')
    })
    this.applicantMeetingsArr = applicantMeetings
    console.log(applicantMeetings)
  }
}
</script>


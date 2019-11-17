<template>
  <div>
    <v-container>
      <v-layout mb-4 row wrap>
        <v-flex mt-2 px-3 xs12 md6>
          <div class="display-1">
            Alla presentationer: {{ presentations.length }} st.
          </div>
          <div class="title py-2">
            Aktiva presentationer: {{ activePresentations.length }} st.
          </div>
          <div class="title">
            Pausade presentationer: {{ (presentations.length - activePresentations.length) }} st.
          </div>
        </v-flex>
      </v-layout>

      <v-layout mt-5 v-if="presentations === ''" row>
        <v-flex xs6>
          <div>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </div>
        </v-flex>
      </v-layout>

      <v-layout mt-4 v-if="presentations !== '' && password !== 'jobflix'">
        <v-flex xs8 md4>
          <v-text-field
            box
            label="Password"
            v-model="password"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout v-if="presentations !== '' && password === 'jobflix'" wrap>
        <v-flex my-2 v-bind:key="index" v-for="(p, index) in presentations" xs12 md8 lg7>
          <v-card>
            <v-card-title>
              <v-avatar
                size="28px"
                >
                <img
                  :src="p.profilePic"
                  alt="Avatar"
                >
            </v-avatar>
          <span class="pl-2 body-2">{{ p.name }}</span><span>&nbsp;- {{ p.title }}</span>
            </v-card-title>
            <div v-if="p.videoPlay" style="position:relative">
              <v-btn @click="p.videoPlay = false" style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:30%" medium fab flat class="white">
                <v-icon large class="secondary--text">play_arrow</v-icon>
              </v-btn>
                <img style="max-height:400px!important" @click="p.videoPlay = false" :src="p.snapshot" width="100%" alt="Video snapshot">
            </div>
            <video style="max-height:400px!important" playsinline v-show="!p.videoPlay" width="100%" controls>
                <source :src="p.videoUrl.i" type="video/mp4">
                Your browser does not support HTML5 video.
            </video>
            <v-card-text>
                <div class="body-2">
                  <v-chip style="margin-top:-6px;margin-bottom:10px" small v-bind:key="x" v-for="x in p.competences" label color="green" text-color="white">
                    <v-icon small class="mr-1">label</v-icon>{{ x }}
                  </v-chip>
                </div>
                <div class="body-2 grey--text text--darken-2">
                  <span class="body-2 green--text text--darken-3">{{ p.bransch }}</span>
                  <span v-bind:key="x" v-show="p.underCategory.length > 0" v-for="(x, index) in p.underCategory">
                    <span v-show="index === 0">></span> 
                    {{ x }}<span v-show="index !== p.underCategory.length - 1">,</span>
                  </span>
                </div>
                <div class="body-2 green--text text--darken-3">
                  Nuvarande tjänst: <span class="body-2 grey--text text--darken-2">{{ p.nuvarande }}</span>
                </div>
                <div>
                  <span class="body-1">
                    {{ p.msg }}
                  </span>
                </div>
                <v-divider class="my-2"></v-divider>
                <div class="body-2 pb-2">Status: 
                  <span v-show="p.active" class="success--text text--darken-2">AKTIV</span>
                  <span v-show="!p.active" class="red--text">PAUSAD</span>
                  <span class="px-3">|</span>
                  <span class="body-2 secondary--text text--darken-1">
                    Publicerad: {{ new Date(p.timeStamp).toISOString().substr(0, 19).replace('T', ' kl. ') }}
                  </span>
                </div>
            </v-card-text>
            <v-card-actions style="margin-top:-15px">
              <v-btn @click="campaignInfoFunction(p)" flat round small class="success">
                <v-icon>build</v-icon>
              </v-btn>
              <v-btn @click="showProfile(p.profile)" flat round small class="primary">
                <v-icon>person</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- DIALOG för FÖRHANDSGRANSKNING AV PROFIL -->
      <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" v-model="showUsersProfile" width="950" >
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
                <v-layout py-2 row wrap>
                  <v-flex pl-1 v-show="$vuetify.breakpoint.mdAndUp" xs2>
                      <v-img
                        style="border:3px solid lightgray;margin-top:-50px;border-radius:10px"
                        width="130px"
                        contain
                        :src="userProfileObj.profilePic.i"
                      ></v-img>
                  </v-flex>
                  <v-flex v-show="$vuetify.breakpoint.smAndDown" xs12>
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
                      <v-img
                        style="border:1px solid lightgray;margin-top:0px;position:absolute;top:10px;left:16px;border-radius:10px"
                        :src="userProfileObj.profilePic.i"
                        width="75px"
                      ></v-img>
                  </v-flex>
                <v-flex pl-2 md9 xs12 :pr-2="$vuetify.breakpoint.mdAndDown">
                <div class="text-xs-left display-1 pt-3" style="font-weight:bold">
                  {{ userProfileObj.fullName }}
                </div>
                  <div class="teal--text body-2 py-1">{{ userProfileObj.title }}</div>

                  <div class="body-1">{{ userProfileObj.description }}</div>

                  <div v-if="userProfileObj.externLink !== ''" class="body-2 pt-1" style="margin-bottom:-7px">
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
                            <p v-bind:key="index" v-for="(x, index) in exp.descriptionArr">
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

      <!--  Öppna upp applicant och kampanj info   -->
      <div v-if="campaignInfo !== ''">
        <v-dialog v-model="campaignInfoModal" max-width="700">
          <v-card>
            <v-card-title class="justify-center primary lighten-3">
              <div class="title white--text">
                {{ campaignInfo.campaignName }} - {{ campaignInfo.name }}
              </div>
            </v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex style="font-weight:bold" class="subheading" xs12 md6>
                  <div class="py-1">
                    Användare: {{ campaignInfo.name }}
                  </div>
                  <div class="py-1">
                    Kampanjnamn: {{ campaignInfo.campaignName }}
                  </div>
                  <div class="py-1">
                    Inbjudningar: {{ campaignInfo.invitations }}
                  </div>
                  <div class="py-1">
                    Unika Visningar: {{ campaignInfo.uniqueVideoViews }}
                  </div>
                </v-flex>
                <v-flex style="font-weight:bold" class="subheading" xs12 md6>
                  <div class="py-1">
                    Mail: {{ campaignInfo.profile.email }}
                  </div>
                  <div class="py-1">
                    TelNr: {{ campaignInfo.profile.phoneNr }}
                  </div>
                  <div class="py-1">
                    Status: 
                    <span v-show="campaignInfo.active" class="success--text text--darken-2">AKTIV</span>
                    <span v-show="!campaignInfo.active" class="red--text">PAUSAD</span>
                  </div>
                  <div class="py-1 secondary--text text--darken-1">
                    Publicerad: {{ new Date(campaignInfo.timeStamp).toISOString().substr(0, 19).replace('T', ' ') }}
                  </div>
                </v-flex>
                <v-flex mt-3 xs12>
                  <div>
                    <v-btn @click="openDeleteModal" flat round class="red white--text lighten-1">
                      Ta bort
                    </v-btn>
                    <v-btn @click="pausCampaign(campaignInfo)" flat round class="secondary lighten-1">
                      Pausa
                    </v-btn>
                    <v-btn @click="emailUserModal = true" flat round class="primary lighten-1">
                      Meddela användare
                    </v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>

      <!--  TA BORT KAMPANJ MODAL   -->
      <div v-if="campaignInfo !== ''">
        <v-dialog v-model="deleteModal" max-width="500">
          <v-card>
            <v-card-title class="justify-center primary lighten-3">
              <div class="title white--text">
                Säker på att TA BORT kampanjen?!
              </div>
            </v-card-title>
            <v-card-text style="font-weight:bold" class="subheading">
              Skicka ett mail till <span class="success--text text--darken-1">{{ campaignInfo.name }}</span> och meddela varför kampanjen tas bort!
            </v-card-text>
            <v-card-actions>
              <v-btn @click="deleteModal = false" round flat class="secondary">
                Avsluta
              </v-btn>
              <v-btn @click="emailUserModal = true" round flat class="primary">
                Maila anv.
              </v-btn>
              <v-btn @click="deleteCampaignFunction(campaignInfo)" round flat class="red white--text">
                TA BORT
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <!--  PAUSA KAMPANJ MODAL   -->
      <div v-if="campaignInfo !== ''">
        <v-dialog v-model="pausModal" max-width="500">
          <v-card>
            <v-card-title class="justify-center primary lighten-3">
              <div class="title white--text">
                Säker på att ta PAUSA kampanjen?!
              </div>
            </v-card-title>
            <v-card-text style="font-weight:bold" class="subheading">
              Skicka ett mail till <span class="success--text text--darken-1">{{ campaignInfo.name }}</span> och meddela varför kampanjen tas bort!
            </v-card-text>
            <v-card-actions>
              <v-btn @click="pausModal = false" round flat class="secondary">
                Avsluta
              </v-btn>
              <v-btn @click="emailUserModal = true" round flat class="primary">
                Maila anv.
              </v-btn>
              <v-btn @click="pausCampaignFunction(campaignInfo)" round flat class="secondary lighten-1 white--text">
                Pausa
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <!--  Maila användare   -->
      <div v-if="campaignInfo !== ''">
        <v-dialog v-model="emailUserModal" max-width="500">
          <v-card>
            <v-card-title class="justify-center primary lighten-3">
              <div class="title white--text">
                Maila {{ campaignInfo.name }}
              </div>
            </v-card-title>
            <v-card-text style="font-weight:bold" class="subheading">

                <v-select
                  label="Vad ska du göra?"
                  :items="['Ta bort', 'Pausa']"
                  v-model="mailPurpose"
                  class="my-4"
                ></v-select>

                <div v-if="mailPurpose === 'Ta bort'">
                  <div class="title">
                    Ta bort kampanj
                  </div>
                  <v-select
                    label="Varför ska du ta bort?"
                    :items="['Otillräcklig information', 'Videon fungerar ej', 'Olämplig']"
                    v-model="whyDelete"
                  ></v-select>

                  <div class="my-3">
                    <div class="body-2 py-1">
                      Mail: {{ campaignInfo.email }}
                    </div>
                    <div v-if="whyDelete === 'Olämplig'" class="body-2 py-1">
                      Ämne: 
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        tagits bort.
                      </p> 
                      Meddelande: 
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        har tagits bort för vi har upptäckt olämpligt innehåll.
                        Skapa en helt ny presentation och justera detta.
                      </p>
                      <p>
                        Bästa hälsningar // Joblix Support
                      </p>
                    </div>
                    <div v-if="whyDelete === 'Videon fungerar ej'" class="body-2 py-1">
                      Ämne: 
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        tagits bort.
                      </p> 
                      <p>
                        Meddelande:
                      </p>
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        har tagits bort för vi har noterat att din video inte fungerar.
                        Vänligen skapa en helt ny presentation och ladda upp videon på nytt.
                      </p>
                      <p>
                        Bästa hälsningar // Joblix Support
                      </p>
                    </div>
                    <div v-if="whyDelete === 'Otillräcklig information'" class="body-2 py-1">
                      Ämne: 
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        tagits bort.
                      </p> 
                      <p>
                      Meddelande:
                      </p>
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        tagits bort för vi anser att den innehåller otillräckligt med innehåll.
                        Vänligen skapa en ny presentation och justera detta.
                      </p>
                      <p>
                        Bästa hälsningar // Joblix Support
                      </p>
                    </div>
                  </div>

                </div>

                <div v-if="mailPurpose === 'Pausa'">
                  <div class="title">
                    Pausa kampanj
                  </div>
                  <v-select
                    label="Varför ska du pausa?"
                    :items="['Otillräcklig information', 'Videon fungerar ej', 'Olämplig']"
                    v-model="whyPaus"
                  ></v-select>

                  <div class="my-3">
                    <div class="body-2 py-1">
                      Mail: {{ campaignInfo.email }}
                    </div>
                    <div v-if="whyPaus === 'Olämplig'" class="body-2 py-1">
                      Ämne: 
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        har pausats.
                      </p> 
                      Meddelande: 
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        har pausats för vi har upptäckt olämpligt innehåll.
                        Vänligen korrigera detta för att fortsätta visa presentationen.
                      </p>
                      <p>
                        Bästa hälsningar // Joblix Support
                      </p>
                    </div>
                    <div v-if="whyPaus === 'Videon fungerar ej'" class="body-2 py-1">
                      Ämne: 
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        har pausats.
                      </p> 
                      <p>
                        Meddelande:
                      </p>
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        har pausats för vi har noterat att din video inte fungerar.
                        Pröva skapa en helt ny presentation och ladda upp videon på nytt.
                      </p>
                      <p>
                        Bästa hälsningar // Joblix Support
                      </p>
                    </div>
                    <div v-if="whyPaus === 'Otillräcklig information'" class="body-2 py-1">
                      Ämne: 
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        har pausats.
                      </p> 
                      <p>
                      Meddelande:
                      </p>
                      <p>
                        {{ `Hej ${campaignInfo.name}` }}, din kampanj {{ campaignInfo.campaignName }} 
                        har pausats för vi anser att den innehåller otillräckligt med innehåll.
                        Vänligen justera detta och aktivera din presentation på nytt.
                      </p>
                      <p>
                        Bästa hälsningar // Joblix Support
                      </p>
                    </div>
                  </div>
                </div>
            
            </v-card-text>
            <v-card-actions style="margin-top:-40px">
              <v-btn @click="emailUserModal = false" round flat class="secondary">
                Avsluta
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <v-dialog v-model="updating" max-width="400">
        <v-card>
          <v-card-title class="justify-center primary lighten-3 white--text">
            <div class="title">
              Uppdaterar
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn :loading="updating" block flat></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      password: '',
      userProfileObj: '',
      showUsersProfile: false,
      campaignInfo: '',
      campaignInfoModal: false,
      deleteModal: false,
      pausModal: false,
      emailUserModal: false,
      mailPurpose: '',
      whyPaus: '',
      whyDelete: '',
      updating: false
    }
  },
  methods: {
    openDeleteModal () {
      this.deleteModal = true
    },
    showProfile (profile) {
      this.userProfileObj = profile
      this.showUsersProfile = true
    },
    campaignInfoFunction (p) {
      console.log(p)
      this.campaignInfo = p
      this.campaignInfoModal = true
    },
    pausCampaign (p) {
      if (p.active) {
        this.pausModal = true
      }
    },
    pausCampaignFunction (p) {
      console.log(`Pausa denna kampanj: ${p.campaignName}`)
      this.updating = true
      firebase.database().ref('applicants').child(p.applicantDBId + '/profileInfo/campaigns')
        .once('value', response => {
          const res = response.val()
          for (let i in res) {
            if (res[i].hasOwnProperty('id')) {
              if (res[i].id === p.id) {
                res[i].active = false
                let pushToPresentationsDB = res
                let first = firebase.database().ref('applicants').child(p.applicantDBId + '/profileInfo/')
                  .update({campaigns: pushToPresentationsDB})
                let second = firebase.database().ref('presentations')
                  .update({[p.applicantDBId]: pushToPresentationsDB})
                let x = JSON.stringify(pushToPresentationsDB)
                let newObj = JSON.parse(x)
                for (let y in newObj) {
                  if (newObj[y].hasOwnProperty('profile')) {
                    newObj[y].profile.fullName = 'Förnamn Efternamn'
                    newObj[y].profile.email = 'xx'
                    newObj[y].profile.phoneNr = 'xx'
                    newObj[y].name = 'Förnamn Efternamn'
                    newObj[y].email = 'xx'
                    newObj[y].userId = 'xx'
                    newObj[y].phoneNr = 'xx'
                  }
                }
                let third = firebase.database().ref('presentationsOffical')
                  .update({[p.applicantDBId]: newObj})
                Promise.all([first, second, third])
                .then(resData => {
                  this.updating = false
                  this.campaignInfoModal = false
                  this.pausModal = false
                })
                break
              }
            }
          }
        })
    },
    deleteCampaignFunction (p) {
      console.log(`Ta bort denna kampanj: ${p.campaignName}`)
      this.updating = true
      firebase.database().ref('applicants').child(p.applicantDBId + '/profileInfo/campaigns')
        .once('value', response => {
          const res = response.val()
          for (let i in res) {
            if (res[i].hasOwnProperty('id')) {
              if (res[i].id === p.id) {
                res[i] = null
                delete res[i]
                let pushToPresentationsDB = res
                let first = firebase.database().ref('applicants').child(p.applicantDBId + '/profileInfo/')
                  .update({campaigns: pushToPresentationsDB})
                let second = firebase.database().ref('presentations')
                  .update({[p.applicantDBId]: pushToPresentationsDB})
                let x = JSON.stringify(pushToPresentationsDB)
                let newObj = JSON.parse(x)
                for (var y in newObj) {
                  if (newObj[y].hasOwnProperty('profile')) {
                    newObj[y].profile.fullName = 'Förnamn Efternamn'
                    newObj[y].profile.email = 'xx'
                    newObj[y].profile.phoneNr = 'xx'
                    newObj[y].name = 'Förnamn Efternamn'
                    newObj[y].email = 'xx'
                    newObj[y].userId = 'xx'
                    newObj[y].phoneNr = 'xx'
                  }
                }
                let third = firebase.database().ref('presentationsOffical')
                  .update({[p.applicantDBId]: newObj})
                Promise.all([first, second, third])
                  .then(data => {
                    this.updating = false
                    this.campaignInfoModal = false
                    this.deleteModal = false
                  })
                break
              }
            }
          }
        })
    }
  },
  computed: {
    activePresentations () {
      if (this.presentations !== '') {
        return this.presentations.filter(val => {
          return val.active
        })
      } else {
        return ''
      }
    },
    presentations () {
      if (this.$store.state.campaignArr === '') {
        return this.$store.state.campaignArr
      } else {
        return this.$store.state.campaignArr.sort((a, b) => {
          return b.timeStamp - a.timeStamp
        })
      }
    }
  }
}
</script>

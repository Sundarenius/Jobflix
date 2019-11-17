<template>
  <div>
    <v-container>
      <v-layout wrap>
        <v-flex mb-4 mt-2 px-3 xs12>
          <div class="display-1">
            Notifikationer: <span class="success--text text--darken-2">{{ notifications.length }}</span> nya notifikationer
          </div>
          <div class="title">
            Samtliga notifikationer skickas per automatik. Skicka manuellt när "Företaget har uppgraderat paket" från noreply@jobflix.se.
          </div>
          <div class="body-1">Lyssnar på data (automatiskt uppdatering) ...</div>
          <v-layout>
            <v-flex v-if="0" xs6 md2>
              <v-text-field
                box
                label="Nollställ allt"
                v-model="zeroAll"
              ></v-text-field>
              <v-btn @click="zeroAllFunction" v-if="zeroAll === 'zeroAll'" class="secondary" flat>Nollställ allt</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-layout row wrap>
          <v-flex :key="i" v-for="(n, i) in notifications" px-2 py-2 xs12 md4>
            <v-card class="hoverCard px-2 py-2">
             <div class="topRight">
               <v-btn @click="sendEmail(n)" class="success caption" round flat small>
                 Skicka mail
               </v-btn>
             </div>
             <div class="topBottom caption">
               <v-btn v-if="$store.state.user.id === 'rKECOkpKfaZc9SGvuURGqMckElE3'" @click="deleteNotification(n)" class="secondary lighten-2" round flat small>
                 Ta bort
               </v-btn>
             </div>
              <div v-bind:key="x" v-for="x in n">
                <div class="subheading py-1">
                  {{ getKeyName(n, x) }}:
                  <span style="font-weight:bold" class="success--text text--darken-3">{{ x }}</span>
                </div>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>

    <!--   MAILTEMPLATE MODAL   -->
    <div v-if="mailTemplate !== ''">
      <v-dialog v-model="mailTemplateModal" max-width="600">
        <v-card>
          <v-card-title class="justify-center">
            <div class="title">
              Mail mall
            </div>
            <v-card-text>
              <div class="subheading pt-2 secondary--text">
                Mail till: 
              </div>
              <div style="font-weight:bold" class="subheading">
                {{ mailTemplate.mail }}
              </div>
              <div class="subheading pt-2 secondary--text">
                Ämne: 
              </div>
              <div style="font-weight:bold" class="subheading">
                {{ mailTemplate.subject }}
              </div>
              <div class="subheading pt-2 secondary--text">
                Meddelande: 
              </div>
              <div style="font-weight:bold" class="subheading">
                {{ mailTemplate.msg }}
              </div>
            </v-card-text>
          </v-card-title>
          <v-card-actions>
            <v-btn @click="mailTemplateModal = false" block flat>
              Stäng
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      hej: 'hej',
      mailTemplate: '',
      mailTemplateModal: false,
      zeroAll: ''
    }
  },
  computed: {
    notifications () {
      return this.$store.state.notificationsObject
    }
  },
  methods: {
    zeroAllFunction () {
      const newArr = ['xx']
      firebase.database().ref('admin').child('notifications')
        .set(newArr)
    },
    deleteNotification (not) {
      // Kan vara dubbla id från bevakningsträffarna så använd id pluss time som id
      console.log(not)
      firebase.database().ref('admin').child('notifications')
        .once('value', response => {
          const res = response.val()
          for (var i in res) {
            if (res[i].id === not.id && res[i].time === not.time) {
              firebase.database().ref('admin').child('notifications/' + i)
                .remove()
            }
          }
        })
    },
    getKeyName (n, x) {
      for (var i in n) {
        if (!n.hasOwnProperty('users')) {
          if (n[i] === x) {
            return i
          }
        }
      }
    },
    sendEmail (not) {
      console.log(not)
      const accepted = {
        subject: 'du har ett nytt inbokat möte',
        msg: 'Du har fått en accepterad förfrågan, logga in för att få mer information om mötet.'
      }
      const newTime = {
        subject: 'du har fått en förfårgan om en ny tid',
        msg: 'Du har fått en förfrågan om en ny tid, logga in för att skicka en ny tid.'
      }
      const newTimeReq = {
        subject: 'du har fått nya tider skickade.',
        msg: 'Du har fått nya mötestider. Logga in för för mer information'
      }
      const newMsg = {
        subject: 'du har fått ett nytt meddelande',
        msg: 'Du har fått ett nytt meddelande. Logga in för att läsa meddelandet.'
      }
      const newInv = {
        subject: 'du har fått en ny mötesförfrågan.',
        msg: 'Du har fått en ny mötesförfågan skickad till dig. Logga in för mer information.'
      }
      const newAd = {
        subject: 'du har fått en ny sökande på en annons.',
        msg: 'Du har fått en ny sökande på en annons. Logga in för mer information.'
      }
      const bevHit = {
        subject: 'du har fått en ny träff på en av dina bevakningar.',
        msg: 'Du har fått en träff på en av dina bevakningar. Logga in för mer information.'
      }
      const bevBUser = {
        subject: 'Välkommen till Jobflix ',
        msg: `Ditt konto är nu skapat och du kan använda portalen fritt som inloggad användare. 
        Vid frågor eller problem, vänligen kontakta support på support@jobflix.se.
        Bästa hälsningar Jobflix.`
      }
      if (not.msg.includes('bett om en ny tid från din förfrågan')) {
        this.mailTemplate = {
          mail: not.emailTo,
          subject: not.businessUser.split(' ')[0] + ', ' + newTime.subject,
          msg: newTime.msg
        }
      } else if (not.msg.includes('har accepterat din förfrågan')) {
        this.mailTemplate = {
          mail: not.emailTo,
          subject: not.businessUser.split(' ')[0] + ', ' + accepted.subject,
          msg: accepted.msg
        }
      } else if (not.msg.includes('Du har fått ett nytt meddelande') && not.notificationTo === 'Privatperson') {
        this.mailTemplate = {
          mail: not.mail,
          subject: not.name.split(' ')[0] + ', ' + newMsg.subject,
          msg: newMsg.msg
        }
      } else if (not.msg.includes('Du har fått ett nytt meddelande') && not.notificationTo === 'Business') {
        this.mailTemplate = {
          mail: not.emailTo,
          subject: not.businessUser.split(' ')[0] + ', ' + newMsg.subject,
          msg: newMsg.msg
        }
      } else if (not.msg.includes('Privatperson har fått en ny tid')) {
        this.mailTemplate = {
          mail: not.mail,
          subject: not.name.split(' ')[0] + ', ' + newTimeReq.subject,
          msg: newTimeReq.msg
        }
      } else if (not.msg.includes('Privatperson har fått intervjuerbjudande')) {
        this.mailTemplate = {
          mail: not.mail,
          subject: not.name.split(' ')[0] + ', ' + newInv.subject,
          msg: newInv.msg
        }
      } else if (not.msg.includes('En träff på bevakning')) {
        this.mailTemplate = {
          mail: not.emailTo,
          subject: not.businessUser.split(' ')[0] + ', ' + bevHit.subject,
          msg: bevHit.msg
        }
      } else if (not.msg.includes('Företaget har uppgraderat paket')) {
        this.mailTemplate = {
          mail: not.corp,
          subject: 'Gå in på företagssidan och leta upp Företaget, skicka följande till alla användare:',
          msg: `ÄMNE: ${not.corp} har uppgraderat sin betalplan. MSG: ${not.corp} har uppgraderat sin betalplan på business.jobflix.se. Logga in för att använda portalen.`
        }
      } else if (not.msg.includes('Svar/Ansökan på annons')) {
        this.mailTemplate = {
          mail: not.emailTo,
          subject: not.businessUser.split(' ')[0] + ', ' + newAd.subject,
          msg: newAd.msg
        }
      } else if (not.msg.includes('Företagsanvändare har signat upp ett konto precis')) {
        this.mailTemplate = {
          mail: not.emailTo,
          subject: bevBUser.subject + ' ' + not.businessUser.split(' ')[0],
          msg: bevBUser.msg
        }
      } else if (not.msg.includes('Privatperson har signat upp ett konto precis')) {
        this.mailTemplate = {
          mail: not.mail,
          subject: bevBUser.subject + ' ' + not.name.split(' ')[0],
          msg: bevBUser.msg
        }
      }
      // Öppna mailTemplateModal
      this.mailTemplateModal = true
    }
  }
}
</script>


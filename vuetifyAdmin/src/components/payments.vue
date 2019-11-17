<template>
  <div>
    <v-container>
      <v-layout wrap>
        <v-flex mt-2 px-3 xs6>
          <div class="display-1 pb-2">
            Betalningar
          </div>
          <div class="title pb-2">
            <span class="yellow--text text--darken-3">Guld</span> paket: {{ stats[0] }}
          </div>
          <div class="title pb-2">
            <span class="grey--text text--darken-2">Platinum</span> paket: {{ stats[1] }}
          </div>
          <div class="title pb-2 success--text text--darken-3">
            Totalt paket: {{ stats[2] }}
          </div>
          <div class="title primary--text text--darken-4">
            Total omsättning: {{ stats[3] }} SEK
          </div>
        </v-flex>
        <v-flex mt-3 xs6 md3>
          <v-select
            outline
            :items="filter"
            label="Filter"
            v-model="filterModel"
          ></v-select>
          <div class="title">
            Träffar: {{ theCustomers.length }}
          </div>
        </v-flex>
      </v-layout>

      <v-layout mt-4 row wrap>
        <v-flex @click="openInvoiceInfo(p)" v-bind:key="p.orgNr" v-for="p in theCustomers" px-2 py-2 xs12 md4>
          <v-card class="hoverCard pointer">
            <v-card-title>
              <div class="title">
                {{ p.businessName }}
              </div>
            </v-card-title>
            <v-card-text style="margin-top:-15px">
              <div style="font-weight:bold" class="subheading pb-1">
                Användare: {{ Object.keys(p.users).length }}
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Paket nu: {{ giveMePacket(p.pricePlan.package) }}
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Nästa period: {{ giveMePacket(p.pricePlan.renew) }}
              </div>
              <div class="subheading pb-1" v-show="p.pricePlan.trialUntil.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')" style="font-weight:bold">
                Trial till: <span class="success--text text--darken-3">{{ p.pricePlan.trialUntil }}</span>
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Aktiverad: <span class="success--text text--darken-3">{{ p.pricePlan.activated }}</span>
              </div>
              <div style="font-weight:bold" class="subheading pb-1">
                Förnyelse: <span class="success--text text--darken-3">{{ p.pricePlan.renewDate }}</span>
              </div>
              <div v-if="filterModel === 'Betalningar denna månad'" style="font-weight:bold" class="subheading">
                Pris: <span class="success--text text--darken-3">{{ p.pricePlan.price }} SEK</span>
              </div>
              <div v-if="filterModel === 'Betalningar kommande månad'" style="font-weight:bold" class="subheading">
                Pris: <span class="success--text text--darken-3">{{ p.pricePlan.renewPrice }} SEK</span>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <!--  INVOICE INFO MODAL  -->
      <div v-if="theInvoice !== ''">
        <v-dialog max-width="600" v-model="invoiceModal">
          <v-card>
            <v-card-title class="primary lighten-2 justify-center">
              <div class="title white--text">
                Faktureringsuppgifter
              </div>
            </v-card-title>
            <v-card-text class="justify-center text-xs-center">
              <div style="font-weight:bold" class="title pb-2">
                {{ theInvoice.businessName }}
              </div>
              <div style="font-weight:bold" class="subheading py-1">
                VAT ID: {{ theInvoice.orgNr }}
              </div>
              <div style="font-weight:bold" class="subheading py-1">
                Paket: {{ giveMePacket(theInvoice.pricePlan.package) }}
              </div>
              <div style="font-weight:bold" class="subheading py-1">
                Pris: {{ theInvoice.pricePlan.price }} SEK
              </div>
                <div style="font-weight:bold" class="subheading py-1">
                  Fakturaadress: {{ theInvoice.pricePlan.invoice.adress }}
                </div>
                <div style="font-weight:bold" class="subheading py-1">
                  Ansvarig: {{ theInvoice.pricePlan.invoice.ansvarig }}
                </div>
                <div style="font-weight:bold" class="subheading py-1">
                  Mail: {{ theInvoice.pricePlan.invoice.mail }}
                </div>
                <div style="font-weight:bold" class="subheading py-1">
                  Tel: {{ theInvoice.pricePlan.invoice.phoneNr }}
                </div>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="invoiceModal = false" block round flat class="primary lighten-2">
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
      filterModel: 'Betalningar denna månad',
      filter: [ 'Betalningar denna månad', 'Betalningar kommande månad', 'Trials just nu' ],
      invoiceModal: false,
      theInvoice: ''
    }
  },
  methods: {
    openInvoiceInfo (p) {
      console.log('openInvoiceInfo')
      console.log(p)
      this.theInvoice = p
      this.invoiceModal = true
    },
    giveMePacket (p) {
      if (p === 1) {
        return 'Basic'
      } else if (p === 2) {
        return 'Gold'
      } else if (p === 3) {
        return 'Platinum'
      }
    }
  },
  computed: {
    paymentsThisMonth () {
      return this.customersArr.filter(val => {
        return val.pricePlan.package > 1
      })
    },
    paymentsNextMonth () {
      return this.customersArr.filter(val => {
        return val.pricePlan.renew > 1
      })
    },
    trialsATM () {
      return this.customersArr.filter(val => {
        return val.pricePlan.trialUntil.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')
      })
    },
    stats () {
      let gold = 0
      let platinum = 0
      let total = 0
      let revenue = 0
      if (this.filterModel === 'Betalningar denna månad') {
        this.theCustomers.forEach(val => {
          if (val.pricePlan.package === 2) {
            gold++
            total++
            revenue += val.pricePlan.price
          } else if (val.pricePlan.package === 3) {
            platinum++
            total++
            revenue += val.pricePlan.price
          }
        })
      } else if (this.filterModel === 'Betalningar kommande månad') {
        this.theCustomers.forEach(val => {
          if (val.pricePlan.renew === 2) {
            gold++
            total++
            revenue += val.pricePlan.renewPrice
          } else if (val.pricePlan.renew === 3) {
            platinum++
            total++
            revenue += val.pricePlan.renewPrice
          }
        })
      }
      return [gold, platinum, total, revenue]
    },
    theCustomers () {
      if (this.filterModel === 'Betalningar denna månad') {
        return this.paymentsThisMonth
      } else if (this.filterModel === 'Betalningar kommande månad') {
        return this.paymentsNextMonth
      } else if (this.filterModel === 'Trials just nu') {
        return this.trialsATM
      }
    },
    customersArr () {
      const customerArr = []
      for (let i in this.$store.state.businessArr) {
        if (this.$store.state.businessArr[i].hasOwnProperty('pricePlan')) {
          customerArr.push(this.$store.state.businessArr[i])
        }
      }
      console.log(customerArr)
      return customerArr
    }
  }
}
</script>

<style scoped>
</style>

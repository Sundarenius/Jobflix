<template>
  <div>
    <v-container>
      <v-layout wrap row>
        <v-flex xs3 class="display-1">
          Säljadmin
        </v-flex>
        <v-flex xs4>
          <v-autocomplete
            label="Användare"
            v-model="chooseUser"
            box
            :items="users"
          ></v-autocomplete>
        </v-flex>
        <v-flex xs12>
          <div class="title py-1">
            Totalt leads: 0 st.
          </div>
          <div class="title py-1">
            Registrerade företag: {{ businessArr.length }} st.
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      users: ['Alla', 'Håkan Sundström'],
      chooseUser: 'Alla'
    }
  },
  computed: {
    businessArr () {
      return this.$store.state.businessArr
    }
  }
}
</script>


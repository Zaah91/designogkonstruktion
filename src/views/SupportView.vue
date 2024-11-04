<template>
  <v-main :class="{ mainContent: this.siteInfo.loggedIn }">
    <LogIn v-if="!siteInfo.loggedIn" @login="handleLogin" />
    <div v-else>
      <h1>Support</h1>
      <p>Velkommen, {{ username }}</p>
      <p>Hvordan kan vi hjælpe dig?</p>

        <v-table  class="pa-1 text-left">
          <thead>
              <th>
                Åbningstider
              </th>
          </thead>
          <tbody>
            <tr
              v-for="item in openings"
              :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.time }}</td>
            </tr>
          </tbody>
        </v-table>

      <!-- Vuetify Contact Form -->
      <v-container class="pa-4">
        <v-form v-model="isValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.title"
            label="Emne"
            :rules="[v => !!v || 'Emne mangler']"
            outlined
            dense
            required
          ></v-text-field>

          <v-textarea
            v-model="form.description"
            label="Beskrivelse"
            :rules="[v => !!v || 'Beskrivelse mangler']"
            outlined
            dense
            required
          ></v-textarea>

          <v-btn :disabled="!isValid" color="primary" type="submit" class="mt-4">
            Submit
          </v-btn>

          <v-alert v-if="successMessage" type="success" class="mt-4">
            {{ successMessage }}
          </v-alert>
        </v-form>
      </v-container>
    </div>
  </v-main>
</template>

<script>
import LogIn from "@/components/LogIn.vue";

export default {
  name: "SupportView",
  inject: ["siteInfo"], // Injects siteInfo provided in App.vue
  components: {
    LogIn,
  },
  data() {
    return {
      isValid: false, // Tracks form validity
      form: {
        title: '',
        description: ''
      },
      successMessage: '', // Success message after submission
      
      openings: [
        { name: 'Mandag', time: "10:00 - 14:00" },
        { name: 'Tirsdag', time: "10:00 - 14:00" },
        { name: 'Onsdag', time: "10:00 - 14:00" },
        { name: 'Torsdag', time: "10:00 - 14:00" },
        { name: 'Fredag', time: "10:00 - 14:00" },
        { name: 'Lørdag', time: "Lukket" },
        { name: 'Søndag', time: "Lukket" },
      ]
    };
  },
  computed: {
    username() {
      return this.siteInfo.username || 'User';
    }
  },
  methods: {
    handleSubmit() {
      if (this.isValid) {
        // Simulate form submission

        // Show a success message
        this.successMessage = 'Your message has been submitted!';
        
        // Clear form fields
        this.form.title = '';
        this.form.description = '';
        this.isValid = false;

        // Clear the success message after 2 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      }
    },
    handleLogin(username) {
      this.siteInfo.loggedIn = true;
      this.siteInfo.username = username;
    }
  }
};



</script>

<style scoped>
h1 {
  color: #000000;
}
.userWrap {
  width: 10rem;
}
.userPicture {
  width: 10rem;
  border-radius: 9999px;
  display: block;
}
.mainContent {
  margin-left: 26vw;
}

@media (max-width: 1024px) {
  .mainContent {
    position: relative;
    left: 0;
  }
}
</style>

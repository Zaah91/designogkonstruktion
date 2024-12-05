<template>
  <v-main v-if="loggedInUser" :class="{ mainContent: loggedInUser }">
    <div>
      <v-container>
        <h1>Support</h1>
        <p>Velkommen, {{ username }}</p>
      </v-container>
      <v-container class="pa-4">
        <p>Har du spørgsmål eller brug for hjælp?</p>
        <p>Ring på tlf: <b>123 123 11</b></p>

        <v-table class="py-4 text-left">
          <tr><th>Åbningstider</th></tr>
          <tr v-for="item in openings" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.time }}</td>
          </tr>
        </v-table>

        <p>Eller send os en besked:</p>

        <v-alert v-if="successMessage" type="success" class="mt-4">
          {{ successMessage }}
        </v-alert>

        <v-form v-model="isValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.title"
            label="Emne"
            :rules="[(v) => !!v || 'Emne mangler']"
            outlined
            dense
            required
          ></v-text-field>

          <v-textarea
            v-model="form.description"
            label="Beskrivelse"
            :rules="[(v) => !!v || 'Beskrivelse mangler']"
            outlined
            dense
            required
          ></v-textarea>

          <v-btn
            :disabled="!isValid"
            color="primary"
            type="submit"
            class="mt-4"
          >
            Submit
          </v-btn>
        </v-form>
      </v-container>
    </div>
  </v-main>
</template>

<script>
import { useLoggedInUserStore } from "../stores/loggedInUser";

export default {
  name: "SupportView",
  inject: ["siteInfo"], // Injects siteInfo provided in App.vue
  data() {
    return {
      isValid: false, // Tracks form validity
      form: {
        title: "",
        description: "",
      },
      successMessage: "", // Success message after submission

      openings: [
        { name: "Mandag til fredag", time: "10:00 - 14:00" },
        //{ name: 'Tirsdag', time: "10:00 - 14:00" },
        //{ name: 'Onsdag', time: "10:00 - 14:00" },
        //{ name: 'Torsdag', time: "10:00 - 14:00" },
        //{ name: 'Fredag', time: "10:00 - 14:00" },
        { name: "Lørdag og søndag", time: "Lukket" },
        //{ name: 'Søndag', time: "Lukket" },
      ],
    };
  },
  computed: {
    username() {
      return this.siteInfo.username || "User";
    },
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      return useLoggedInUserStore().user;
    },
  },
  methods: {
    handleSubmit() {
      if (this.isValid) {
        // Simulate form submission

        // Show a success message
        this.successMessage = "Your message has been submitted!";

        // Clear form fields
        this.form.title = "";
        this.form.description = "";
        this.isValid = false;

        // Clear the success message after 10 seconds
        setTimeout(() => {
          this.successMessage = "";
        }, 10000);
      }
    },
  },
};
</script>

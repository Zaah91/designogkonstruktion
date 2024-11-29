<template>
  <v-container
    fluid
    class="bgrnd fill-height d-flex justify-center align-center"
  >
    <v-card class="pa-5 text-center" max-width="400" min-height="700" outlined>
      <h1 class="text-h4 mb-5">Velkommen til Venner for Livet</h1>
      <div v-if="showLogin">
        <div class="statusMessage" v-if="statusMessage">
          {{ statusMessage }}
        </div>
        <v-text-field
          label="Indtast email"
          v-model="email"
          outlined
          @keyup.enter="storeLogin"
        ></v-text-field>
        <v-text-field label="Indtast kodeord" type="password"></v-text-field>

        <v-btn class="my-4" color="primary" large @click="storeLogin">
          Log Ind
        </v-btn>

        <v-divider class="my-4"></v-divider>

        <div>
          <button @click="loginAsRandomUser">
            <img src="@/assets/web_neutral_rd_SI@1x.png" alt="" />
          </button>
          <button @click="loginAsRandomUser">
            <img src="@/assets/app-login.png" alt="" />
          </button>
        </div>

        <v-divider class="my-4"></v-divider>
        <span class="linkStyle" @click="toggleView">Opret bruger</span>
      </div>

      <div v-else>
        <h2>Opret bruger</h2>
        <v-text-field label="Navn" v-model="newUser.user_fullname"></v-text-field>
        <v-text-field label="E-mail" v-model="newUser.user_mail"></v-text-field>
        <v-text-field type="password"
          label="Kodeord"
          v-model="newUser.user_password"
        ></v-text-field>

        <v-btn color="blue darken-3" large @click="registerUser">
          Opret bruger
        </v-btn>
        <v-divider class="my-4"></v-divider>
        <span class="linkStyle" @click="toggleView">Tilbage til log ind</span>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
    name: 'LogIn',
    props: {
        siteInfo: Object,
    },
    data() {
        return {
            email: '',
            statusMessage: '',
            showLogin: true,
            newUser: {
                user_fullname: '',
                user_mail: '',
                user_password: '',
                user_admin: false
            }
        }
    },
    methods: {
        storeLogin() {
            if (this.email) {
                this.$emit('login', this.email)
            } else {
                alert('Indtast venligst et email')
            }
        },
        loginAsRandomUser() {
            const randomUser = this.siteInfo.users[Math.floor(Math.random() * this.siteInfo.users.length)];
            this.$emit('login', randomUser.username);
        },
        toggleView() {
            this.showLogin = !this.showLogin;
        },
        async registerUser() {
          try {
            const response = await axios.post('http://localhost:8081/users', this.newUser);
            console.log('User registered successfully:', response.data);
          } catch (error) {
            console.error('Error registering user:', error);
          }
        }
    }
}

</script>

<style>
.linkStyle {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
.bgrnd {
  background-color: rgb(var(--v-theme-primary));
}
.hvid {
  background-color: white;
}
.statusMessage {
  min-height: 2rem;
}
</style>

<template>
  <v-container v-if="!isLoggedIn" fluid class="bgrnd fill-height d-flex justify-center align-center">
    <v-card class="pa-5 text-center" max-width="400" outlined>
      <h1 class="text-h4 mb-5">Velkommen til Venner for Livet</h1>
      <div v-if="showLogin">
        <v-text-field label="Indtast brugernavn" v-model="username" outlined @keyup.enter="storeUsername"></v-text-field>
        <v-text-field label="Indtast kodeord" type="password"></v-text-field>
      
        <v-btn class="my-4" color="primary" large @click="storeUsername">
          Log Ind
        </v-btn>
      
       <v-divider class="my-4"></v-divider>
      
      
      <!-- Klassiske knapper
      <v-btn class="mb-2" large @click="loginAsRandomUser" style="background: none; padding: 0; min-width: auto; border: none; box-shadow: none;">
        <img src="@/assets/web_neutral_rd_SI@1x.png" alt="">
      </v-btn>
      
      <v-btn class="mb-2" large @click="loginAsRandomUser" style="background: none; padding: 0; min-width: auto; border: none; box-shadow: none;">
        <img src="@/assets/app-login.png" alt="">
      </v-btn>
      -->
      <div>
      <button style="width: 68%" @click="loginAsRandomUser">
        <img style="width: 100%" src="@/assets/web_neutral_rd_SI@1x.png" alt="">
      </button>
      <button style="width: 80%" @click="loginAsRandomUser">
        <img style="width: 100%" src="@/assets/app-login.png" alt="">
      </button>
      </div>
        
        <v-divider class="my-4"></v-divider>
        <span class="linkStyle" @click="toggleView">Opret bruger</span>
      </div>
      
      <div v-else>
        <h2>Opret bruger</h2>
        <v-text-field label="Navn"></v-text-field>
        <v-text-field label="E-mail"></v-text-field>
        <v-text-field label="Kodeord"></v-text-field>

        <v-btn color="blue darken-3" large @click="loginAsRandomUser">
          Opret bruger
        </v-btn>
        <v-divider class="my-4"></v-divider>
        <span class="linkStyle" @click="toggleView">Tilbage til log ind</span>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
    name: 'LogIn',
    props: {
        siteInfo: Object,
    },
    data() {
        return {
            username: '',
            showLogin: true,
        }
    },
    methods: {
        storeUsername() {
            if (this.username) {
                this.$emit('login', this.username)
            } else {
                alert('Indtast venligst et brugernavn')
            }
        },
        loginAsRandomUser() {
            const randomUser = this.siteInfo.users[Math.floor(Math.random() * this.siteInfo.users.length)];
            this.$emit('login', randomUser.username);
        },
        toggleView() {
            this.showLogin = !this.showLogin;
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
        background-color: rgb(var(--v-theme-primary))
    }
    .hvid {
        background-color: white
    }
</style>
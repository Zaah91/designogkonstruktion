<template>
    <v-container v-if="!isLoggedIn" fluid class="bgrnd fill-height d-flex justify-center align-center">
      <v-card class="pa-5 text-center" max-width="400" outlined>
        <h1 class="text-h4 mb-5">Velkommen til Venner for Livet</h1>
        
        <v-text-field label="Navn" v-model="username" outlined @keyup.enter="storeUsername"></v-text-field>
        <v-text-field label="E-mail" v-model="username" outlined @keyup.enter="storeUsername"></v-text-field>
        <v-text-field label="Kodeord" v-model="username" outlined @keyup.enter="storeUsername"></v-text-field>

        <v-btn color="blue darken-3" large @click="loginAsRandomUser">
        Opret bruger
        </v-btn>
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
          }
      }
  }
  
  </script>
  
  <style>
      .bgrnd {
          background-color: rgb(var(--v-theme-primary))
      }
      .hvid {
          background-color: white
      }
  </style>
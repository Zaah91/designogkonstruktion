<template>
  <v-app>
    <v-main>
      <LogIn v-if="!isLoggedIn" @login="handleLogin"/>
      <div v-else>
        <h1>Velkommen til Gammelchat</h1>
        <p>Du er logget ind som {{ username }}</p>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import LogIn from './components/LogIn.vue'

export default {
  name: 'App',

  components: {
    LogIn,
  },

  data() {
    return {
      isLoggedIn: false,
      username: '',
    }
  },
  methods: {
    handleLogin(username) {
      this.isLoggedIn = true
      this.username = username
    },
  },
}
</script>

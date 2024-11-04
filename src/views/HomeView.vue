<template>
  <v-main>
    <LogIn v-if="!siteInfo.loggedIn" @login="handleLogin" />
    <div v-else>
      <h1>Velkommen til Gammelchat</h1>
      <p>Du er logget ind som {{ username }}</p>
    </div>
  </v-main>
</template>

<script>
import LogIn from "@/components/LogIn.vue"; // Bare et hurtigt eksempel (se næste kommentar)

export default {
  name: "HomeView",
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
  components: {
    LogIn,
  },
  methods: {
    handleLogin(username) {
      this.siteInfo.loggedIn = true;
      this.siteInfo.username = username;
    },
  },
};
</script>

<style scoped>
h1 {
  color: #000000;
}
</style>

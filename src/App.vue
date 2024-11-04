<template>
  <v-app>
    <NavHeader :siteInfo="siteInfo" @logout="handleLogout" />
    <router-view />
  </v-app>
</template>

<script>
// Komponenter
import NavHeader from '@/components/NavHeader.vue';

export default {
  name: 'App',
  components: {
    NavHeader,
  },
  data() {
    return {
      siteInfo: {
        sitename: 'Gammelchat',
        logo: require('@/assets/gammelchat-logo.webp'),
        loggedIn: false,
        loggedInUser: {},
        users: [
          {
            username: 'Eivind',
            name: 'Eivind Johannes Goldenstein Hansen',
            photo: require('@/assets/eivind.webp')
          },
          {
            username: 'Karan',
            name: 'Karen Elisabeth Johannesson',
            photo: require('@/assets/karan.webp')
          },
          {
            username: 'Ulla',
            name: 'Ulla Hansen',
            photo: require('@/assets/ulla.webp')
          },
        ]
      },
    };
  },
  provide() {
    // Fordi siteInfo ikke er direkte tilgængelig i vores views, bliver vi nødt til at dele den først via provide
    // Inde i de views, som skal bruge den, skal vi huske at lave en inject af den. Se eks HomeView.
    return {
      siteInfo: this.siteInfo, // Providing `siteInfo` for child components
    };
  },
  methods: {
    handleLogin(username) {
      this.siteInfo.loggedIn = true;
      this.siteInfo.username = username;
    },
    handleLogout() {
      this.siteInfo.loggedIn = false;
      this.siteInfo.username = '';
      this.siteInfo.loggedInUser = {};
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
}
a {color: #0C8A6F;}
</style>

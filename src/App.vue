<template>
  <v-app>
    <BurgerMenu v-if="siteInfo.loggedIn" @logout="handleLogout" />
    <NavHeader :siteInfo="siteInfo" @logout="handleLogout" />
    <router-view :siteInfo="siteInfo" />
  </v-app>
</template>

<script>
// Komponenter
import NavHeader from "@/components/NavHeader.vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import BurgerMenu from "@/components/BurgerMenuNav.vue";

export default {
  name: "App",
  components: {
    NavHeader,
    BurgerMenu
  },
  data() {
    return {
      route: null,
      siteInfo: {
        sitename: "Venner for Livet",
        logo: require("@/assets/gammelchat-logo.webp"),
        loggedIn: false,
        loggedInUser: {},
        users: [
          {
            username: "Eivind",
            name: "Eivind Johannes Goldenstein Hansen",
            email: "eivind@example.com",
            photo: require("@/assets/eivind.webp"),
            communities: [
              {
                name: "Fiskehjørnet",
              },
              {
                name: "Lotusklubben",
              },
            ],
          },
          {
            username: "Karen",
            name: "Karen Elisabeth Johannesson",
            email: "karen@example.com",
            photo: require("@/assets/karan.webp"),
            communities: [
              {
                name: "Strikkeklubben",
              }
            ],
          },
          {
            username: "Ulla",
            name: "Ulla Hansen",
            email: "ulla@example.com",
            photo: require("@/assets/ulla.webp"),
            communities: [
              {
                name: "Strikkeklubben",
              },
            ],
          },
        ],
        communities: [
          {
            name: "Strikkeklubben",
          },
          {
            name: "Lotusklubben",
          },
          {
            name: "Fiskehjørnet",
          }
        ],
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
      this.siteInfo.username = "";
      this.siteInfo.loggedInUser = {};
      this.redirectToHome();
    },
    redirectToHome() {
      const router = useRouter();
      if (!this.siteInfo.loggedIn && this.route.name !== "Home") {
        router.push({ name: "Home" }); // Redirect til home, hvis route name ikke matcher, og brugeren ikke er logget ind
      }
    },
  },
  mounted() {
    this.route = useRoute();
    // Når vores app bliver "mounted", tjek om brugeren er logget ind; hvis ikke omstiller vi til forsiden
    this.redirectToHome();
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #131313;
}
</style>

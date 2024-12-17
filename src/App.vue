<template>
  <v-app>
    <BurgerMenu v-if="loggedInUser" />
    <NavHeader v-if="loggedInUser " />
    <router-view />
  </v-app>
</template>

<script>
// Komponenter
import NavHeader from "@/components/NavHeader.vue";
import BurgerMenu from "@/components/BurgerMenuNav.vue";
import { useLoggedInUserStore } from "./stores/loggedInUser";


export default {
  name: "App",
  components: {
    NavHeader,
    BurgerMenu,
  },
  data() {
    return {
      route: null,
      authToken: null,
    };
  },
  methods: {
    handleLogout() {
      this.loggedInUserStore.clearUser();
      this.redirectToHome();
    },
    redirectToHome() {
      if (!this.loggedInUser && this.$route.name !== "Home") {
        this.$router.push({ name: "Home" }); // Redirect to home if user is not logged in
      }
    }
  },
  computed: {
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      return this.loggedInUserStore.user;
    },
  },
  created() {
    this.loggedInUserStore = useLoggedInUserStore();
  },
  mounted() {
    // Køres efter kombonentet er blevet indsat i DOMen
    // Når vores app bliver "mounted", tjek om brugeren er logget ind; hvis ikke omstiller vi til forsiden
    this.redirectToHome();
  },
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

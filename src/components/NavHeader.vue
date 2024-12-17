<template>
  <header>
    <v-container class="navWrap" v-if="loggedInUser">
      <v-row>
        <v-col cols="6">
          <nav>
            <ol class="headerNavigation">
              <li>
                <v-tooltip text="Forside">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      text
                      icon
                      color="secondary"
                      :to="{ name: 'Home' }"
                      class="navBtn homeBtn"
                      ><v-icon color="actionTxt" icon="mdi-home"
                    /></v-btn>
                  </template>
                </v-tooltip>
              </li>
              <li>
                <v-tooltip text="Kontakt">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      text
                      icon
                      color="secondary"
                      :to="{ name: 'Support' }"
                      class="navBtn supportBtn"
                      ><v-icon color="actionTxt" icon="mdi-face-agent"
                    /></v-btn>
                  </template>
                </v-tooltip>
              </li>
              <li>
                <v-tooltip text="Indstillinger">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      text
                      icon
                      color="secondary"
                      :to="{ name: 'Settings' }"
                      class="navBtn settingsBtn"
                      ><v-icon color="actionTxt" icon="mdi-account-cog"
                    /></v-btn>
                  </template>
                </v-tooltip>
              </li>
              <li v-if="loggedInUser.admin">
                <v-tooltip text="Admin">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      text
                      icon
                      color="secondary"
                      :to="{ name: 'Admin' }"
                      class="navBtn adminBtn"
                      ><v-icon color="actionTxt" icon="mdi-security"
                    /></v-btn>
                  </template>
                </v-tooltip>
              </li>
              <li>
                <v-tooltip text="Log ud!">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      text
                      icon
                      color="secondary"
                      class="navBtn logoutBtn"
                      @click="logout"
                    >
                      <v-icon color="actionTxt" icon="mdi-close" />
                    </v-btn>
                  </template>
                </v-tooltip>
              </li>
            </ol>
          </nav>
        </v-col>
        <v-col>
          <nav>
            <ol>
              <li v-if="route.name != 'Home'" class="backNavItem">
                <v-tooltip text="Tilbage">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      text
                      icon
                      color="secondary"
                      class="navBtn backBtn"
                      @click="goBack"
                      ><v-icon color="actionTxt" icon="mdi-arrow-left"
                    /></v-btn>
                  </template>
                </v-tooltip>
              </li>
            </ol>
          </nav>
        </v-col>
      </v-row>
    </v-container>
  </header>
</template>

<script>
import { useRoute } from "vue-router";
import { useLoggedInUserStore } from "../stores/loggedInUser";
import axiosInstance from "@/api/axiosInstance";

export default {
  name: "NavHeader",
  data() {
    return {
      route: null, // Lad os være konsekvent og kun bruge options API (den var composition før)
    };
  },
  computed: {
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      return this.loggedInUserStore.user;
    },
  },
  methods: {
    logout() {
      axiosInstance
        .post("/logout")
        .then((response) => {
          // console.log(response.data);
          if (response?.data?.message) {
            this.loggedInUserStore.clearUser();
            this.loggedInUserStore.loggedOut = "Du er nu logget ud.";
            if (!this.loggedInUser && this.$route.name !== "Home") {
              this.$router.push({ name: "Home" }); // Redirect til home
            }
          }
        })
        .catch(() => {
          // console.error("login: ", error); // Lad os undgå at skrive fejl i loggen, når vi ikke debugger
        });
    },
    goBack() {
      this.$router.go(-1); // Tilbage til forrige side
    },
  },
  created() {
    this.loggedInUserStore = useLoggedInUserStore();
    this.route = useRoute();
  },
};
</script>

<style scoped>
.userList {
  width: 95%;
}
header {
  background: rgb(
    var(--v-theme-primary)
  ); /* Vi tager farven fra vores Vuetify temafil i plugins/vuetify.js */
  width: 25%;
  height: 100%;
  position: fixed;
  left: 0;
}
nav {
  width: 33%;
  justify-content: right;
}
nav li {
  width: 3rem;
  height: 3rem;
  margin: 0.5rem 0 0;
}
header .navBtn {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
}
ul,
ol {
  list-style-type: none;
  padding: 0;
}

/* Mobile styles */
@media (max-width: 480px) {
}
@media (max-width: 1024px) {
  header {
    position: sticky;
    z-index: 9998;
    width: 100%;
    top: 0;
    height: 5rem;
  }
  header .navWrap {
    display: none;
  }
}

/* Small Desktop styles */
@media (min-width: 1024px) {
}
</style>

<template>
  <header>
    <v-container v-if="siteInfo.loggedIn" >
      <v-row class="flex-nowrap headerRow" no-gutters>
        
        <v-col class="flex-grow-0 flex-shrink-0">
          <div class="d-flex">
            <nav>
              <ol class="headerNavigation">
                <!--<router-link to="/"><img class="navBtn" :alt="siteInfo.sitename" :src="siteInfo.logo"/></router-link>-->
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
                <li>
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
          </div>
        </v-col>
      </v-row>
    </v-container>
  </header>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  name: "NavHeader",
  data() {
    return {
      route: null, // Lad os være konsekvent og kun bruge options API (den var composition før)
    };
  },
  props: {
    // Vi skal bruge en prop for at dele siteInfo objektet fra App.vue meed NavHeader
    siteInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isLoggedIn() {
      // Tjek om vi er logget ind (meget simpelt tjek, fordi vi ved ikke, om vi når at lave login)
      // Skal dog have noget, så vi kan vise login-forsiden
      return this.siteInfo.loggedIn;
    },
    orderedUsers() {
      return this.siteInfo.users.slice().sort((user) => {
        if (user.username === this.siteInfo.username) {
          return -1; // Flyt forrest hvis logget ind
        }
        return 1;
      });
    },
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      const loggedInUser = this.siteInfo.users.find(
        (user) => user.username === this.siteInfo.username
      );
      if (loggedInUser) {
        return loggedInUser;
      } else {
        return this.siteInfo.users.find((user) => user.username === "Ulla");
      }
    },
  },
  methods: {
    logout() {
      this.$emit("logout");
    },
    goBack() {
      this.$router.go(-1); // Tilbage til forrige side
    },
  },
  created() {
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
  padding: 0.5rem;
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
  .headerNavigation {
    flex-direction: column;
  }
}
@media (max-width: 570px) {
}
@media (max-width: 1024px) {
  header {
    position: sticky;
    z-index:9998;
    width: 100%;
    top: 0;
    height: 5rem;
  }
  nav li {
    padding: 0.9rem 0.5rem;
  }
  .headerRow {
    flex-direction: row;
  }
  .settingsBtn,
  .supportBtn,
  .logoutBtn {
    display: none;
  }

  /* This was blocking clicks in Burger on mobile, so this is just a quick-fix. Solve this properly later! */
  .backNavItem {
    display:block;
    position:fixed;
    top:0.8rem;
    right:0.5rem;
    padding:0;
  }
}

/* Small Desktop styles */
@media (min-width: 1024px) {
  .headerRow {
    flex-direction: column;
    height: 100%;
  }
  .headerWrapper {
    height: 100vh;
  }
}
</style>

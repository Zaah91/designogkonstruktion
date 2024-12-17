<template>
  <div>
    <v-btn
      text
      icon
      @click="drawer = !drawer"
      id="burgerMenu"
      color="secondary"
    >
      <v-icon :icon="drawer ? 'mdi-close' : 'mdi-menu'"></v-icon>
    </v-btn>
  </div>

  <v-navigation-drawer
    v-if="!isMobile"
    color="primary"
    class="drawerMobile"
    v-model="drawer"
    temporary
    sticky
    :scrim="false"
  >
    <v-list base-color="secondary" color="primary" variant="elevated">
      <v-list-item
        color="#000"
        prepend-icon="mdi-face-agent"
        title="Kontakt"
        :to="{ name: 'Support' }"
      ></v-list-item>
      <v-list-item
        color="#000"
        prepend-icon="mdi-account-cog"
        title="Indstillinger"
        :to="{ name: 'Settings' }"
      ></v-list-item>
      <v-list-item v-if="loggedInUser.admin"
        color="#000"
        prepend-icon="mdi-security"
        title="Admin"
        :to="{ name: 'Admin' }"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-btn
        @click="logout"
        class="rounded-0"
        prepend-icon="mdi-close"
        color="secondary"
        block
        >Log ud</v-btn
      >
    </template>
  </v-navigation-drawer>
</template>

<script>
import { useRoute } from "vue-router";
import { useLoggedInUserStore } from "../stores/loggedInUser";
import axiosInstance from "@/api/axiosInstance";

export default {
  name: "BurgerMenuNav",
  data() {
    return {
      drawer: false,
      isMobile: false,
      route: null
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
  },
  watch: {
    "$vuetify.breakpoint.width"(newWidth) {
      this.drawer = this.isMobile = newWidth <= 1024;
    }
  },
  created() {
    this.loggedInUserStore = useLoggedInUserStore();
    this.route = useRoute();
  },
  emits: ["logout"],
};
</script>

<style scoped>
#burgerMenu {
  position: fixed;
  top: 0.9rem;
  left: 1rem;
  z-index: 9999;
  font-size:1.7rem;
  width: 3rem;
  height: 3rem;
}
.drawerMobile {
  padding-top: 7rem;
}
.drawerMobile .v-list-item {
  position:relative;
  z-index:9999;
}

@media (min-width: 1024px) {
  #burgerMenu,
  .drawerMobile {
    display: none;
  }
}
</style>

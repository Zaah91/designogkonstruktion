<template>
  <v-main :class="{ mainContent: this.siteInfo.loggedIn }">
    <LogIn v-if="!siteInfo.loggedIn" @login="handleLogin" />
    <div class="d-block pa-4" v-else>
        <v-img
          :src="loggedInUser.photo"
          :alt="loggedInUser.username"
          rounded="circle"
          aspect-ratio="1"
          class="d-flex justify-center  userPicture"
        />
      <p>Velkommen <b>{{ loggedInUser.username }}</b></p>
      <h1>Dine fællesskaber</h1>
      <v-btn color="secondary" class="d-block w-25"> Fiskehjørnet </v-btn>
      <v-btn color="secondary" class="d-block w-25 mt-4"> Lotusklubben </v-btn>
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
  computed: {
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
};
</script>

<style scoped>
h1 {
  color: #000000;
}
.userWrap {
  width: 10rem;
}
.userPicture {
  width: 10rem;
  border-radius: 9999px;
  display: block;
}
.mainContent {
  margin-left: 26vw;
}

@media (max-width: 1024px) {
  .mainContent {
    position: relative;
    left: 0;
  }
}
</style>

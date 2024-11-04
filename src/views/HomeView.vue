<template>
  <v-main :class="{ mainContent: this.siteInfo.loggedIn }">
    <LogIn v-if="!siteInfo.loggedIn" @login="handleLogin" />
    <div class="d-block homeWrap pa-4" v-else>
      <v-img
        :src="loggedInUser.photo"
        :alt="loggedInUser.username"
        rounded="circle"
        class="userPicture"
      />
      <p class="text-subtitle-2 mt-16">
        Velkommen <b>{{ loggedInUser.username }}</b>
      </p>
      <h1>Dine fællesskaber</h1>
      <template v-if="this.loggedInUser.communities">
        <template
          v-for="(community, index) in this.loggedInUser.communities"
          :key="index"
        >
          <v-btn color="secondary" class="d-block">{{ community.name }}</v-btn>
        </template>
      </template>
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
@media (max-width: 1024px) {
  .homeWrap {
    margin: 0 auto;
  }
}

@media (min-width: 1024px) {
  .homeWrap {
    width: 400px;
    margin: 0;
  }
}
.homeWrap button {
  width: 100%;
}
</style>

<template>
  <v-main :class="{ mainContent: loggedInUser }"><!-- tilføj "mainContent" klassen dynamisk hvis brugeren er logget ind -->
    <LogIn v-if="!loggedInUser" :siteInfo="siteInfo" />
    <div class="d-block homeWrap pa-4" v-else>
      <v-img
        :src="userImageSrc"
        :alt="loggedInUser.fullname"
        rounded="circle"
        class="userPicture"
      />
      <p class="text-subtitle-2 mt-4 mb-16 text-center">
        {{ loggedInUser.name }}
      </p>
      <h1>Dine fællesskaber</h1>
      <template v-if="loggedInUser.communities">
        <template
          v-for="(community, index) in loggedInUser.communities"
          :key="index"
        >
          <v-btn
            color="btnPrimary"
            class="d-block mt-8 pa-2"
            :to="{ name: 'Community' }"
            >{{ community.community_name }}</v-btn
          >
        </template>
      </template>
    </div>
  </v-main>
</template>

<script>
import LogIn from "@/components/LogIn.vue"; // Bare et hurtigt eksempel (se næste kommentar)
import axiosInstance from "@/api/axiosInstance";
import { useLoggedInUserStore } from "../stores/loggedInUser";

export default {
  name: "HomeView",
  data() {
    return {
      userImageSrc: null,
      selectedUser: false,
      tempCommunityUpdated: 0,
    };
  },
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
  components: {
    LogIn,
  },
  computed: {
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      return useLoggedInUserStore().user;
    },
  },
  methods: {
    async fetchUserImage(userId) {
      try {
        const response = await axiosInstance.get(`/images/${userId}`, {
          responseType: "blob",
        });
        this.userImageSrc = URL.createObjectURL(response.data);
      } catch (error) {
        this.userImageSrc = "/images/placeholder.png";
      }
    },
  },
  watch: {
    loggedInUser: {
      immediate: true,
      handler(newUser) {
        console.log(newUser);
        if (newUser && newUser.userId) {
          this.fetchUserImage(newUser.userId);
        } else {
          this.userImageSrc = "/images/placeholder.png";
        }
      },
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
    width: 20rem;
    margin: 0;
  }
}
.homeWrap button {
  width: 100%;
}
</style>

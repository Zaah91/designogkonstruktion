<template>
  <v-main :class="{ mainContent: loggedInUser }"
    ><!-- tilføj "mainContent" klassen dynamisk hvis brugeren er logget ind -->
    <LogIn v-if="!loggedInUser" />
    <div class="d-block homeWrap pa-4" v-else>
      <v-progress-circular
        class="vflspinner"
        v-if="isLoading"
        :size="100"
        indeterminate
      ></v-progress-circular>

      <template v-if="!isLoading">
        <v-img
          :src="userImageSrc"
          :alt="loggedInUser.fullname"
          class="userPicture"
        />
        <p class="text-h5 mt-4 mb-16 text-left">
          <v-icon
            aria-label="Admin"
            icon="mdi-crown-circle"
            aria-hidden="false"
            v-if="loggedInUser.admin"
          />
          <v-icon
            aria-label="Admin"
            icon="mdi-account-circle"
            aria-hidden="false"
            v-else
          />
          {{ loggedInUser.fullname }}
          <span class="isAdmin">{{
            loggedInUser.admin ? "Admin" : "Bruger"
          }}</span>
        </p>
        <h1>Dine fællesskaber</h1>
        <template v-if="loggedInUser.communities">
          <template
            v-for="(community, index) in loggedInUser.communities"
            :key="index"
          >
            <v-btn
              v-if="typeof community?.value == 'undefined' || community.value"
              color="btnPrimary"
              class="d-block mt-8 pa-2 communityBtn"
              :to="{
                name: 'Community',
                params: { id: community.community_id },
              }"
              elevation="2"
              block
              size="large"
            >
              {{ community.community_name }}
            </v-btn>
          </template>
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
      isLoading: false,
    };
  },
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
    // Method til at opdatere src attributten til brugerens billede
    async fetchUserImage(userId) {
      let imageSrc = "/images/placeholder.png";
      this.isLoading = true;
      try {
        const response = await axiosInstance.get("/images/" + userId, {
          responseType: "blob",
        });
        imageSrc = URL.createObjectURL(response.data);
      } catch (error) {
        // Optional: Handle specific error logging or actions here
      } finally {
        this.isLoading = false;
        this.userImageSrc = imageSrc;
      }
    },
  },
  watch: {
    // En watcher til at holde øje med, om en bruger logger ind - hvis en bruger logger ind, så forsøg at indlæs brugerens profilbillede
    loggedInUser: {
      immediate: true,
      handler(newUser) {
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

<style>
.communityBtn span {
  padding:0.2rem;
}
.isAdmin {
  display: block;
  font-size: 1.2rem;
}
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

<template>
  <v-main :class="{ mainContent: loggedInUser }"
    ><!-- tilføj "mainContent" klassen dynamisk hvis brugeren er logget ind -->
    <LogIn v-if="!loggedInUser" />
    <v-row v-else>
      <v-col class="homeWrap pa-4" cols="12" sm="8" md="6">
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
          <v-card
            variant="flat"
            :prepend-icon="loggedInUser.admin ? 'mdi-crown-circle' : 'mdi-account-circle'"
            :subtitle="loggedInUser.admin ? 'Administrator' : 'Standardbruger'"
            :title="loggedInUser.fullname"
            class="mb-8"
          >
          </v-card>

          <h1 class="text-h6 ma-0 pa-0">Dine fællesskaber</h1>
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
                  name: 'Forum',
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
      </v-col>
    </v-row>
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
      let imageSrc = (process.env.NODE_ENV === 'production' ? '/vfl/' : '/') + 'images/placeholder.png';
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

<style scoped>
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
    max-width: 20rem;
    margin: 0;
  }
}
.homeWrap button {
  width: 100%;
}
</style>

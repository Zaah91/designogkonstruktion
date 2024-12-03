<template>
  <v-main class="mainContent">
    <div class="pa-4 flexWrap">
      <div class="flex-grow-1 flex-shrink-1">
        <h1>Indstillinger</h1>
        <v-container>
          <v-text-field
            label="Fulde navn"
            prepend-icon="mdi-pencil"
            v-model="editedUserAttributes.user_fullname"
          />
          <v-text-field
            label="Email"
            prepend-icon="mdi-mail"
            v-model="editedUserAttributes.user_mail"
          />
        </v-container>
        <div class="d-flex justify-space-evenly">
          <v-btn color="btnPrimary"> Gem </v-btn>
          <v-btn color="red" @click="showOverlay = true"> Slet bruger </v-btn>
        </div>

        <!-- Dialog-overlay til bekræftelse af sletning af bruger  -->
        <v-dialog v-model="showOverlay" max-width="400">
          <v-card>
            <v-card-title class="headline">Bekræft sletning</v-card-title>
            <v-card-text>
              Er du sikker på, at du vil slette brugeren?
            </v-card-text>
            <v-card-actions>
              <v-btn color="green darken-1" text @click="showOverlay = false">
                Annuller
              </v-btn>
              <v-btn color="red darken-1" text> Slet </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <div class="flex-grow-1 flex-shrink-1 pt-4">
        <v-img
          :src="userImageSrc"
          :alt="loggedInUser.fullname"
          class="d-flex justify-center userPicture"
        />
        <v-container class="pa-0">
          <h2>Interesser</h2>
          <template v-for="(community, index) in userCommunities" :key="index">
            <template v-if="this.userCommunities">
              <v-checkbox
                color="btnPrimary"
                class="ma-0 pa-0"
                :label="community.community_name"
                v-model="userCommunities[index].value"
                @click="updateUserCommunities(userCommunities[index])"
              ></v-checkbox>
            </template>
          </template>
        </v-container>
      </div>
    </div>
  </v-main>
</template>

<script>
import axiosInstance from "@/api/axiosInstance";
import { useLoggedInUserStore } from "../stores/loggedInUser";

export default {
  name: "SettingsView",
  data() {
    return {
      editedUserAttributes: {
        user_fullname: null,
        user_mail: null
      },
      allCommunities: [],
      userCommunities: [],
      tempCommunityUpdated: false,
      userImageSrc: null,
      showOverlay: false,
      statusMessage: "",
      isLoading: false,
    };
  },
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
  methods: {
    // Gem en liste af communities i this.allCommunities
    async fetchCommunities() {
      this.isLoading = true;
      try {
        const response = await axiosInstance.get("/communities");
        this.allCommunities = response.data;
      } catch (error) {
        this.statusMessage =
          error.message || "Kunne ikke indlæse fællesskaber.";
      } finally {
        this.isLoading = false;
      }
    },

    // Slet eller tilføj community medlemskab
    async updateUserCommunities(community) {
      if (!community.value) {
        this.isLoading = true;
        try {
          await axiosInstance.post("/memberships", {
            user_id: this.loggedInUser.userId,
            community_id: community.community_id,
          });
        } catch (error) {
          this.statusMessage =
            error.message || "Kunne ikke tilføje dit medlemskab.";
        } finally {
          this.isLoading = false;
        }
      } else {
        this.isLoading = true;
        try {
          await axiosInstance.delete("/memberships/" + this.loggedInUser.userId + '/' + community.community_id);
        } catch (error) {
          this.statusMessage =
            error.message || "Kunne ikke tilføje dit medlemskab.";
        } finally {
          this.isLoading = false;
        }
      }
    },
    async updateUser(userId) {
      this.isLoading = true;
      try {
        // const response = await...
        await axiosInstance.patch(`/users/${userId}`, this.editedUserAttributes);
        
      } catch (error) {
          console.log(error);
      } finally {
          this.isLoading = false;
      }
    },

    // Tilpasset method fra vores tidligere frontend.
    addMissingCommunitiesAndValuesInTmp() {
      this.tempCommunityUpdated = true;

      // Tilføl en midlertidig "value" property, som vi så kan binde via v-modal i vores v-for (fjernes igen inden dataen evt sendes tilbage selvfølgelig)
      for (let i = 0; i < this.userCommunities.length; i++) {
        if (typeof this.userCommunities[i].value == "undefined") {
          this.userCommunities[i].value = true;
        }
      }

      // Bemærk: Vi heter den fulde liste af communities med fetchCommunities i mounted() lifecycle
      // Nu skal vi lige sikre, at alle communities eksistere i userCommunities (dvs, det array af communities, som brugeren er medlem af i forvejen). Hvis ikke, så tilføjer vi dem som mangler..
      for (let i = 0; i < this.allCommunities.length; i++) {
        // iterer igennem det midlertidige community array
        let foundCommunity = this.userCommunities.find(
          (community) =>
            community.community_name === this.allCommunities[i].community_name
        );
        if (!foundCommunity) {
          this.allCommunities[i].value = false;
          this.userCommunities.push(this.allCommunities[i]);
        }
      }
    },
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
  computed: {
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      return useLoggedInUserStore().user;
    },
  },
  async mounted() {
    if (!this.tempCommunityUpdated) { // Tjek at vi ikke allerede har kørt funktionerne, fordi vi skal kun køre dem på første visning

      // Lav en direkte reference til communities i vores loggedInUser store
      this.userCommunities = this.loggedInUser.communities;

      await this.fetchCommunities();
      this.addMissingCommunitiesAndValuesInTmp();
      this.editedUserAttributes.user_fullname = this.loggedInUser.fullname;
      this.editedUserAttributes.user_mail = this.loggedInUser.email;
    }
  },
};
</script>

<style scoped>
.userPicture {
  width: 100%;
  border-radius: 1rem;
}
@media (max-width: 1024px) {
  .flexWrap {
    display: block;
    justify-content: center;
    margin-left: 0;
    min-width: 300px;
    width: 90%;
  }
}
@media (min-width: 1024px) {
  .flexWrap {
    display: flex;
    justify-content: center;
    margin-left: 0;
  }
}
</style>

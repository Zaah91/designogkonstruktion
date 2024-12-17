<template>
  <v-main class="mainContent">
    <v-row>
      <v-col>
        <h1>Indstillinger</h1>
        <v-text-field
          variant="outlined"
          label="Fulde navn"
          prepend-icon="mdi-pencil"
          v-model="editedUserAttributes.user_fullname"
        />
        <v-text-field
          variant="outlined"
          label="Email"
          prepend-icon="mdi-mail"
          v-model="editedUserAttributes.user_mail"
        />
        <v-row>
          <v-col>
            <v-btn
              size="large"
              block
              color="btnPrimary"
              @click="updateUser()"
              prepend-icon="mdi-content-save"
              >Gem</v-btn
            >
          </v-col>
          <v-col>
            <v-btn
              size="large"
              block
              color="red"
              @click="showOverlay = true"
              prepend-icon="mdi-delete"
              >Slet</v-btn
            >
          </v-col>
        </v-row>

        <!-- Dialog-overlay til bekræftelse af sletning af bruger  -->
        <v-dialog v-model="showOverlay" max-width="400">
          <v-card>
            <v-card-title class="headline">Bekræft sletning</v-card-title>
            <v-card-text>
              Er du sikker på, at du vil slette brugeren?
            </v-card-text>
            <v-card-actions>
              <v-btn
                size="large"
                color="green darken-1"
                text
                @click="showOverlay = false"
              >
                Annuller
              </v-btn>
              <v-btn size="large" block color="red darken-1" text> Slet </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col>
        <div class="imgDetails">
          <v-progress-circular
            class="vflspinner"
            v-if="isLoading"
            :size="100"
            indeterminate
          ></v-progress-circular>
          <template v-if="!imgIsLoading">
            <v-img
              :src="userImageSrc"
              :alt="loggedInUser.fullname"
              class="d-flex justify-center userPicture"
            />
          </template>
        </div>
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
      </v-col>
    </v-row>
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
        user_fullname: "",
        user_mail: "",
      },
      allCommunities: [],
      userCommunities: [],
      tempCommunityUpdated: false,
      userImageSrc: null,
      showOverlay: false,
      statusMessage: "",
      isLoading: false,
      imgIsLoading: false,
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
          await axiosInstance.delete(
            "/memberships/" +
              this.loggedInUser.userId +
              "/" +
              community.community_id
          );
        } catch (error) {
          this.statusMessage =
            error.message || "Kunne ikke tilføje dit medlemskab.";
        } finally {
          this.isLoading = false;
        }
      }
    },
    async updateUser() {
      this.isLoading = true;
      try {
        // const response = await...
        await axiosInstance.patch(
          "/users/" + this.loggedInUser.userId,
          this.editedUserAttributes
        );
        this.loggedInUser.fullname = this.editedUserAttributes.user_fullname;
        this.loggedInUser.email = this.editedUserAttributes.user_mail;
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

      // Bemærk: Vi henter den fulde liste af communities med fetchCommunities i mounted() lifecycle
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
      this.imgIsLoading = true;
      try {
        const response = await axiosInstance.get(`/images/${userId}`, {
          responseType: "blob",
        });
        this.userImageSrc = URL.createObjectURL(response.data);
      } catch (error) {
        this.userImageSrc = "/images/placeholder.png";
      } finally {
        this.imgIsLoading = false;
      }
    },
  },
  watch: {
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
  computed: {
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      return useLoggedInUserStore().user;
    },
  },
  async mounted() {
    if (!this.tempCommunityUpdated) {
      // Tjek at vi ikke allerede har kørt funktionerne, fordi vi skal kun køre dem på første visning

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
.imgDetails {
  display: flex;
  justify-content: center;
  align-items: middle;
}
.userPicture {
  width: 100%;
  border-radius: 1rem;
  margin: 0;
  padding: 0;
}
</style>

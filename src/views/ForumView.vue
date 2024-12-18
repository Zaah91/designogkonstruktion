<template>
  <v-main class="mainContent">
    <v-container class="ma-0">
      <h2 class="text-h6 ma-0 pa-0">{{ pageTitle }}</h2>
      <v-progress-circular
        class="mt-8"
        v-if="isLoading"
        :size="100"
        indeterminate
      ></v-progress-circular>
      <v-card
        class="mb-4 s"
        :prepend-icon="
          message.user.user_admin ? 'mdi-crown-circle' : 'mdi-account-circle'
        "
        :title="message.user.user_fullname"
        variant="flat"
        v-for="(message, index) in messages"
        :color="alternateColorPick(index)"
        :key="index"
      >
        <div class="msgWrap">
          <!--<v-img
            :src="message.userImage"
            alt="Eivind"
            class="userPicture"
          />-->
          <p class="msg">{{ message.forum_message }}</p>
        </div>
      </v-card>
    </v-container>
    <v-container class="pa-4 forumInput">
      <v-text-field
        v-model="forumMessage"
        label="Skriv en besked"
        outlined
        dense
        @keyup.enter="sendMessage"
      ></v-text-field>
      <v-row justify="left" align="center" style="min-height: 4rem">
        <v-col cols="auto">
          <v-btn color="primary" @click="sendMessage">Send</v-btn>
        </v-col>
        <v-col class="statusMessageContainer" cols="auto">
          <template v-if="showStatus">
            <transition name="fade" @after-leave="onAfterLeave">
              <v-alert
                class="statusMessage"
                v-if="statusMessage && !isLoading"
                :text="statusMessage.text"
                density="compact"
                :type="statusMessage.type"
                :icon="'$' + statusMessage.type"
                variant="tonal"
              ></v-alert>
            </transition>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import axiosInstance from "@/api/axiosInstance";
import { useLoggedInUserStore } from "../stores/loggedInUser";
export default {
  name: "ForumView",
  data() {
    return {
      pageTitle: "",
      messages: [],
      forumMessage: "",
      communityId: null,
      isLoading: false,
      sendMessageIsLoading: false,
      showStatus: false,
      statusMessage: {},
    };
  },
  methods: {
    async loadLatest() {
      const lastItem = this.messages[this.messages.length - 1];
      try {
        const imgResponse = await axiosInstance.get(
          "/images/" + lastItem.user_id,
          {
            responseType: "blob",
          }
        );
        // Midlertidig "object URL" til indlæsning af billedet
        lastItem.userImage = URL.createObjectURL(imgResponse.data);
      } catch (error) {
        // Hvis billedet ikke blev indlæst, brug en almindelig URL til vores profil-placeholder billede
        lastItem.userImage = "/images/placeholder.png";
      }
    },
    async fetchForumMessages() {
      try {
        const response = await axiosInstance.get("forum/" + this.communityId);
        const messages = response.data;

        // Vi har brug for at hente bruger-billeder individuelt, så vi nemt kan vise dem i forumet
        /* Denne del er ikke brugt pt, og laver også bare flere HTTP anmodninger..
        for (const message of messages) {
          try {
            const imgResponse = await axiosInstance.get(
              `/images/${message.user_id}`,
              {
                responseType: "blob",
              }
            );
            // Midlertidig "object URL" til indlæsning af billedet
            message.userImage = URL.createObjectURL(imgResponse.data);
          } catch (error) {
            // Hvis billedet ikke blev indlæst, brug en almindelig URL til vores profil-placeholder billede
            message.userImage =
              (process.env.NODE_ENV === "production" ? "/vfl/" : "/") +
              "images/placeholder.png";
          }
        } */

        const existingForumIds = this.messages.map((msg) => msg.forum_id);
        messages.forEach((newMessage) => {
          if (!existingForumIds.includes(newMessage.forum_id)) {
            this.messages.push(newMessage);
          }
        });
      } catch (error) {
        this.showMessage(
          error.message || "Kunne ikke indlæse fællesskaber.",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },
    async sendMessage() {
      if (this.forumMessage?.length < 1 || this.isLoading) return;

      this.sendMessageIsLoading = true;

      const newMessageObj = {
        user_id: this.loggedInUser.userId,
        forum_message: this.forumMessage
      };

      try {
        const response = await axiosInstance.post(
          "forum/" + this.communityId,
          newMessageObj
        );
        newMessageObj.user = {};
        newMessageObj.user.user_fullname = this.loggedInUser.fullname;
        newMessageObj.user.user_admin = this.loggedInUser.admin;
        newMessageObj.forum_id = response.data.what.forum_id; // Vi skal bruge forum_id fra databasen for at undgå at beskederne bliver indsat igen i vores setInterval
        this.messages.unshift(newMessageObj); // Opdater messages array lokalt, så brugeren kan se den med den samme, og ikke behøver vente på update intervallet
        // this.loadLatest(); // Bliver ikke brugt lige nu..Brugt til at indlæse billeder
        this.forumMessage = "";
        this.showMessage(response.data.message, "success");
      } catch (error) {
        this.showMessage(
          error.message || "Ukendt svar. Beskeden blev muligvis ikke sendt.",
          "error"
        );
      } finally {
        this.sendMessageIsLoading = false;
      }
    },
    async fetchCommunity() {
      this.isLoading = true;
      try {
        const response = await axiosInstance.get(
          "communities/" + this.communityId
        );
        this.pageTitle = response.data.community_name;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    alternateColorPick(index) {
      return index % 2 === 0 ? "inputBg" : "inputSecondaryBg";
    },
    showMessage(message, type) {
      this.showStatus = true;
      this.statusMessage = {
        text: message,
        type: type,
      };
      setTimeout(() => {
        this.showStatus = false;
      }, 4000);
    },
  },
  computed: {
    loggedInUser() {
      // Vi kan eksempelvis bruge det til, at fremhæve den indloggede bruger i forumet
      // Retuner user-objektet for den bruger, som er logget ind
      return useLoggedInUserStore().user;
    },
  },
  mounted() {
    this.communityId = this.$route.params.id;
    this.isLoading = true; // Kun ved første visning, fordi ellers blinker alting
    this.fetchCommunity();
    this.fetchForumMessages();

    // Periodisk tjek efter nye beskeder
    this.updateInterval = setInterval(() => {
      this.fetchForumMessages();
    }, 30000);
  },
  beforeUnmount() {
    clearInterval(this.updateInterval); // Vigtig! For at undgå overlappende intervaller. Eks. Ved at navigere frem og tilbage
  }
};
</script>

<style scoped>
.forumWrap {
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}

.forumInput {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background-color: white;
}

section {
  width: 100%;
  margin: 0.5rem 0rem; /* 0.5rem 0rem; betyder 0,5 top/bund og 0 højre/venstre*/
  padding: 0 0 0.5rem;
}
section p {
  margin: 1rem;
  font-size: medium;
}
.messageContainer:nth-child(odd) {
  background-color: var(--v-theme-inputBg);
}
.messageContainer:nth-child(even) {
  background-color: var(--v-theme-inputSecondaryBg);
}
.userPicture {
  width: 8rem;
  height: 8rem;
  margin: 0.5rem;
  float: left;
}
.msgWrap {
  padding: 0.5rem;
}
@media (max-width: 1024px) {
  .userPicture {
    width: 5rem;
    height: 5rem;
  }
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
    justify-content: center;
    margin-left: 0;
  }
}
</style>

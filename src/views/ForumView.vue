<template>
  <v-main class="mainContent">
    <h2>Chat</h2>
    <div class="pa-4 forumWrap">
      <v-progress-circular
        v-if="isLoading"
        :size="100"
        indeterminate
      ></v-progress-circular>
      <section v-for="(message, index) in messages" :key="index">
        <div class="msgWrap">
          <!--<v-img
            :src="message.userImage"
            alt="Eivind"
            class="userPicture"
          />-->
          <p class="name">{{ message.user.user_fullname }}</p>
          <p class="msg">{{ message.forum_message }}</p>
        </div>
      </section>
    </div>
    <div class="pa-4 forumInput">
      <v-text-field
        v-model="forumMessage"
        label="Skriv en besked"
        outlined
        dense
        @keyup.enter="sendMessage"
      ></v-text-field>
      <v-btn color="primary" @click="sendMessage">Send</v-btn>
    </div>
  </v-main>
</template>

<script>
import axiosInstance from "@/api/axiosInstance";
import { useLoggedInUserStore } from "../stores/loggedInUser";
export default {
  name: "ForumView",
  data() {
    return {
      messages: {},
      forumMessage: '',
      communityId: null,
      isLoading: false,
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
      this.isLoading = true;
      try {
        const response = await axiosInstance.get("forum/" + this.communityId);
        const messages = response.data;

        // Vi har brug for at hente bruger-billeder individuelt, så vi nemt kan vise dem i forumet
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
            message.userImage = "/images/placeholder.png";
          }
        }

        this.messages = messages;
      } catch (error) {
        this.statusMessage =
          error.message || "Kunne ikke indlæse fællesskaber.";
      } finally {
        this.isLoading = false;
      }
    },
    async sendMessage() {
      if (this.forumMessage === "") return;

      const newMessageObj = {
        user_id: this.loggedInUser.userId,
        forum_message: this.forumMessage,
      };

      try {
        await axiosInstance.post("forum/" + this.communityId, newMessageObj);
        newMessageObj.user = {}
        newMessageObj.user.user_fullname = this.loggedInUser.fullname;
        this.messages.push(newMessageObj);
        this.loadLatest();
        this.forumMessage = "";
      } catch (error) {
        console.error("Error sending message:", error);
      }
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
    this.fetchForumMessages();
  },
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
  border-radius: 1rem;
}
section p {
  margin: 1rem;
  font-size: medium;
}
section:nth-child(odd) {
  background-color: #e2e2e2;
}
section:nth-child(even) {
  background-color: #eeeeee;
}
.userPicture {
  width: 8rem;
  height: 8rem;
  margin: 0.5rem;
  float: left;
}
.msgWrap .name {
  font-weight: bold;
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

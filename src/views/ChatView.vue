<template>
  <v-main class="mainContent">
    <h2>Chat</h2>
    <div class="pa-4 chatWrap">
      <v-progress-circular v-if="isLoading" :size="100" indeterminate></v-progress-circular>
      <section v-for="(message, index) in messages" :key="index">
        <div class="msgWrap">
          <!--<v-img
            :src="message.userImage"
            alt="Eivind"
            rounded="circle"
            class="userPicture"
          />-->
          <p class="name">{{ message.user.user_fullname }}</p>
          <p class="msg">{{ message.chat_message }}</p>
          
        </div>
      </section>
    </div>
    <div class="pa-4 chatInput">
      <v-text-field
        v-model="message"
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
  name: "ChatView",
  data() {
    return {
      messages: {},
      communityId: null,
      isLoading: false
    };
  },
  methods: {
    async fetchChatMessages() {
      this.isLoading = true;
      try {
        const response = await axiosInstance.get("chat/" + this.communityId);
        const messages = response.data;

        // Vi har brug for at hente bruger-billeder individuelt, så vi nemt kan vise dem i chatten
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
      if (this.newMessage === "") return;

      const newMessageObj = {
        user_id: this.loggedInUser.id,
        chat_message: this.newMessage,
        user_fullname: this.loggedInUser.user_fullname,
        userImage: this.loggedInUser.userImage || "/images/placeholder.png",
      };

      try {
        await axiosInstance.post("chat/" + this.communityId, newMessageObj);
        this.messages.push(newMessageObj);
        this.newMessage = "";
        this.scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
  },
  computed: {
    loggedInUser() {
      // Vi kan eksempelvis bruge det til, at fremhæve den indloggede bruger i chatten
      // Retuner user-objektet for den bruger, som er logget ind
      return useLoggedInUserStore().user;
    },
  },
  created() {
    this.communityId = this.$route.params.id;
    console.log("idi:" + this.$route.params.id);
  },
  mounted() {
    this.fetchChatMessages();
    console.log(this.messages);
  },
};
</script>

<style scoped>
.chatWrap {
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}

.chatInput {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background-color: white
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

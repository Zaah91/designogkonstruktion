<template>
  <v-row class="fill-height bgrnd" justify="center" align="center">
  <v-col cols="11" sm="8" md="6">
    <v-card variant="flat" class="pa-5 usrActionBox">
      <h1 class="text-h4 mb-4 text-center">Venner For Livet</h1>

      <v-container v-if="showLogin">
        <p class="text-left pb-8">
          Indtast din e-mail adresse og dit kodeord for at logge ind:
        </p>
        <v-text-field
          label="Indtast email"
          v-model="email"
          variant="outlined"
          bg-color="inputBg"
          @keyup.enter="handleLogin"
        ></v-text-field>
        <v-text-field
          label="Indtast kodeord"
          v-model="password"
          type="password"
          variant="outlined"
          bg-color="inputBg"
          @keyup.enter="handleLogin"
        ></v-text-field>

        <v-row justify="left">
          <v-col cols="auto">
            <v-btn
              min-width="144"
              color="primary"
              elevation="2"
              size="large"
              @click="handleLogin"
            >
              Log Ind
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              min-width="144"
              color="primary"
              variant="outlined"
              size="large"
              @click="toggleView"
            >
              Ny bruger
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <p class="text-left pb-8">
          Eller log ind med dit Google- eller Apple ID nedenfor:
        </p>
        <v-row class="loginWith">
          <v-col>
            <v-btn
              class="goodleId"
              color="primary"
              variant="tonal"
              elevation="2"
              block
              size="large"
              @click="basicLogin"
            >
              <template v-slot:prepend>
                <img src="@/assets/small-g.png" alt="Log ind med Google" />
              </template>
              Log ind med Google
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="appleId"
              color="primary"
              variant="tonal"
              elevation="2"
              block
              size="large"
              @click="basicLogin"
            >
              <template v-slot:prepend>
                <img src="@/assets/small-apple.png" alt="Log ind med Apple" />
              </template>
              Log ind med Apple
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="createUser" v-else>
        <p class="text-left pb-8">Opret en ny bruger:</p>
        <v-text-field
          label="Navn"
          v-model="newUser.user_fullname"
          variant="outlined"
          bg-color="inputBg"
        ></v-text-field>
        <v-text-field
          label="E-mail"
          variant="outlined"
          bg-color="inputBg"
          v-model="newUser.user_mail"
        ></v-text-field>
        <v-text-field
          type="password"
          label="Kodeord"
          v-model="newUser.user_password"
          variant="outlined"
          bg-color="inputBg"
        ></v-text-field>

        <v-btn color="primary" size="large" elevation="2" @click="registerUser">
          Opret
        </v-btn>
        <v-divider class="my-4"></v-divider>
        <v-btn
          class="my-4"
          color="primary"
          variant="outlined"
          size="large"
          @click="toggleView"
        >
          Tilbage til logind
        </v-btn>
      </v-container>
    </v-card>
  </v-col>
</v-row>

  <transition name="fade" @after-leave="onAfterLeave">
    <v-container v-if="showStatus" class="statusMessageContainer">
      <v-row justify="center">
        <v-col cols="11" sm="8" md="6">
          <v-alert
            class="statusMessage"
            v-if="statusMessage"
            :text="statusMessage.text"
            density="compact"
            :type="statusMessage.type"
            :icon="'$' + statusMessage.type"
            variant="tonal"
          ></v-alert>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script>
import axiosInstance from "@/api/axiosInstance";
import { useLoggedInUserStore } from "../stores/loggedInUser";

export default {
  name: "LogIn",
  props: {
    siteInfo: Object,
  },
  data() {
    return {
      isMobile: false,
      email: "", // Login
      password: "", // Login
      showStatus: false,
      statusMessage: null,
      showLogin: true,
      newUser: {
        // New user details
        user_fullname: "",
        user_mail: "",
        user_password: "",
        user_admin: false,
      },
    };
  },
  methods: {
    handleLogin() {
      if (this.email?.length < 1 || this.password?.length < 1) {
        this.showMessage("E-mail eller Kodeord mangler!", "error");
        return;
      }
      axiosInstance
        .post("/login", {
          user_mail: this.email,
          user_password: this.password,
        })
        .then((response) => {
          const loggedInUserStore = useLoggedInUserStore();

          // Indsæt dataerne for den indloggede bruger i loggedInUserStore
          loggedInUserStore.setUser({
            userId: response.data.user.userId,
            fullname: response.data.user.fullname,
            email: response.data.user.email,
            communities: response.data.user.communities,
            admin: response.data.user.admin,
          });
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            this.showMessage(error.response.data.message, "error");
          }
        });
    },
    basicLogin() {
      this.showMessage("Logger ind med en standardbruger", "info");
      this.email = "jac@vfl.dk";
      this.password = "123456";
      setTimeout(() => this.handleLogin(), 1000);
    },
    toggleView() {
      this.showLogin = !this.showLogin;
    },
    async registerUser() {
      if (
        this.newUser.user_fullname?.length < 1 ||
        this.newUser.user_mail?.length < 1 ||
        this.newUser.user_password?.length < 1
      ) {
        this.showMessage("Felterne må altså ikke være tomme!", "error");
        return;
      }
      try {
        const response = await axiosInstance.post("/users", this.newUser);
        this.showMessage(response.data.message, "success");
        this.showLogin = true;
        this.newUser.user_mail = "";
        this.newUser.user_password = "";
        this.newUser.user_fullname = "";
      } catch (error) {
        this.showMessage(
          "Kunne ikke oprette brugeren. Måske findes den allerede!",
          "warning"
        );
      }
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
    revalidateLoginToken() {
      const loggedInUserStore = useLoggedInUserStore();
      if (loggedInUserStore.user) {
        return;
      }

      // If the user is not logged in, let's check if we can revalidate an existing token
      axiosInstance
        .get("/handshake")
        .then((response) => {
          // Indsæt dataerne for den indloggede bruger i loggedInUserStore
          loggedInUserStore.setUser({
            userId: response.data.user.userId,
            fullname: response.data.user.fullname,
            email: response.data.user.email,
            communities: response.data.user.communities,
            admin: response.data.user.admin,
          });
          this.statusMessage = { text: "Velkommen!", type: "success" };
          this.showStatus = true;
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            // this.statusMessage = error.response.data.message;
          } else {
            console.error("Error:", error);
          }
        });
    },
    checkScreenSize() {
      this.isMobile = this.$vuetify.display.xs;
    },
  },
  created() {
    const loggedInUserStore = useLoggedInUserStore();
    if (!loggedInUserStore?.loggedOut) {
      this.revalidateLoginToken();
    } else {
      this.statusMessage = {
        text: loggedInUserStore.loggedOut,
        type: "success",
      };
      this.showStatus = true;
      loggedInUserStore.loggedOut = null;
    }
  },
  mounted() {
    this.checkScreenSize();
  },
  watch: {
    "$vuetify.display.xs"(val) {
      this.isMobile = val;
    },
  },
};
</script>

<style scoped>
.usrActionBox {
  min-height:36vw;
}
.loginWith {
  padding: 0.5rem;
}
.loginWith button {
  justify-content: left;
}
.goodleId img,
.appleId img {
  height: 2rem;
}
.linkStyle {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
.bgrnd {
  background-color: rgb(var(--v-theme-primary));
}
.hvid {
  background-color: white;
}
.statusMessageContainer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 1rem;
}
.statusMessage {
  background: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

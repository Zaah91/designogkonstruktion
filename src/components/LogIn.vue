<template>
  <v-container
    fluid
    class="bgrnd fill-height d-flex justify-center align-center"
  >
    <v-card class="pa-5" max-width="400" min-height="700" outlined>
      <h1 class="text-h4 mb-5 text-center">Venner For Livet</h1>

      <div v-if="showLogin">
        <div class="statusMessage">
          <v-alert v-if="statusMessage"
            :text="statusMessage"
            density="compact"
            :type="statusType"
            :icon="'$' + statusType"
            variant="tonal"
          ></v-alert>
        </div>
        <p class="text-left pb-8">
          Indtast din e-mail adresse og dit kodeord for at logge ind:
        </p>
        <v-text-field
          label="Indtast email"
          v-model="email"
          outlined
          @keyup.enter="handleLogin"
        ></v-text-field>
        <v-text-field
          label="Indtast kodeord"
          v-model="password"
          type="password"
        ></v-text-field>

        <div style="display: flex; justify-content: space-between">
          <v-btn
            class="my-4"
            min-width="164"
            color="primary"
            elevation="2"
            size="large"
            @click="handleLogin"
          >
            Log Ind
          </v-btn>
          <v-btn
            class="my-4"
            min-width="164"
            color="primary"
            variant="outlined"
            size="large"
            @click="toggleView"
          >
            Ny bruger
          </v-btn>
        </div>
        <v-divider class="my-4"></v-divider>
        <p class="text-left pb-8">
          Eller log ind med dit Google- eller Apple ID nedenfor:
        </p>
        <div class="loginWith">
          <v-btn
            class="my-8 goodleId"
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

          <v-btn
            class="my-8 appleId"
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
        </div>
      </div>

      <div class="createUser" v-else>
        <h2>Opret en ny bruger</h2>
        <v-text-field
          label="Navn"
          v-model="newUser.user_fullname"
        ></v-text-field>
        <v-text-field label="E-mail" v-model="newUser.user_mail"></v-text-field>
        <v-text-field
          type="password"
          label="Kodeord"
          v-model="newUser.user_password"
        ></v-text-field>

        <v-btn color="primary" size="large" elevation="2" @click="registerUser">
          Opret
        </v-btn>
        <v-divider class="my-4"></v-divider>
        <v-btn
          class="my-4"
          min-width="164"
          color="primary"
          variant="outlined"
          size="large"
          @click="toggleView"
        >
          Tilbage til logind
        </v-btn>
      </div>
    </v-card>
  </v-container>
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
      email: "", // Login
      password: "", // Login
      statusType: "info",
      statusMessage: "",
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
      if (this.email) {
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
              this.statusType = "warning";
              this.statusMessage = error.response.data.message;
            } else {
              console.error("Error:", error);
            }
          });
      } else {
        this.statusType = "warning";
        this.statusMessage = "E-mail og Kodeord mangler!";
      }
    },
    basicLogin() {
      this.statusType = "info";
      this.statusMessage = "Logger ind med en standardbruger";
      this.email = "jac@vfl.dk";
      this.password = "123456";
      setTimeout(() => this.handleLogin(), 1000);
    },
    toggleView() {
      this.showLogin = !this.showLogin;
    },
    async registerUser() {
      try {
        const response = await axiosInstance.post("/users", this.newUser);
        this.statusMessage = response.data.message;
        this.statusType = "success";
        this.showLogin = true;
        this.newUser.user_mail = '';
        this.newUser.user_password = '';
        this.newUser.user_fullname = '';
      } catch (error) {
        this.statusType = "warning";
        this.statusMessage = "Kunne ikke oprette brugeren. Måske findes den allerede!s";
        console.error("Error registering user:", error);
      }
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
          });
          this.statusType = "success";
          this.statusMessage = "Velkommen!";
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            // this.statusMessage = error.response.data.message;
          } else {
            console.error("Error:", error);
          }
        });
    },
  },
  created() {
    this.revalidateLoginToken();
  },
};
</script>

<style>
.createUser {
  min-width: 300px;
}
.loginWith {
  padding: 0.5rem;
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
.statusMessage {
  min-height: 6rem;
}
</style>

<template>
  <v-container
    fluid
    class="bgrnd fill-height d-flex justify-center align-center"
  >
    <v-card class="pa-5 text-center" max-width="400" min-height="700" outlined>
      <h1 class="text-h4 mb-5">Venner For Livet</h1>
      <p class="text-left pb-8">
        Indtast din e-mail adresse og dit kodeord for at logge ind:
      </p>

      <div v-if="showLogin">
        <div class="statusMessage" v-if="statusMessage">
          {{ statusMessage }}
        </div>
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

        <div style="display:flex;justify-content:space-between;">
          <v-btn class="my-4" min-width="164" color="primary" large @click="handleLogin">
            Log Ind
          </v-btn>
          <v-btn class="my-4" min-width="164" color="primary" variant="outlined" large @click="toggleView"
            >Ny bruger</v-btn
          >
        </div>
        <v-divider class="my-4"></v-divider>
        <p class="text-left pb-8">Eller log ind med dit Google- eller Apple ID nedenfor:</p>
        <div class="loginWith">
          <button @click="basicLogin" class="goodleId">
            <img src="@/assets/web_neutral_rd_SI@1x.png" alt="" />
          </button>
          <button @click="basicLogin" class="appleId">
            <img src="@/assets/app-login.png" alt="" />
          </button>
        </div>
      </div>

      <div class="createUser" v-else>
        <h2>Opret bruger</h2>
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

        <v-btn color="blue darken-3" large @click="registerUser"> Opret </v-btn>
        <v-divider class="my-4"></v-divider>
        <v-btn height="72" min-width="164" variant="text" @click="toggleView"
          >Tilbage</v-btn
        >
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
            console.error(
              "login: Error while communicating with the backend.",
              error
            );
          });
      } else {
        alert("Indtast venligst et email");
      }
    },
    basicLogin() {
      this.email = "jac@vfl.dk";
      this.password = "123456";
      this.handleLogin();
    },
    toggleView() {
      this.showLogin = !this.showLogin;
    },
    async registerUser() {
      try {
        const response = await axiosInstance.post("/users", this.newUser);
        this.statusMessage = response.data.message;
        this.showLogin = true;
      } catch (error) {
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
        })
        .catch((error) => {
          console.error(
            "login: Error while communicating with the backend.",
            error
          );
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
  display: flex;
  justify-content: space-between;
}
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
  min-height: 2rem;
}
</style>

import { defineStore } from 'pinia';
import axiosInstance from "@/api/axiosInstance";

export const useLoggedInUserStore = defineStore('loggedInUser', {
  state: () => ({
    user: null // Hvis brugeren ikke er logget ind, så er objektet sat til null
  }),
  actions: {
    setUser(userDetails) {
      this.user = userDetails;
    },
    clearUser() {
      this.user = null;
    },
    async logout(router) {
      axiosInstance
        .post("/logout")
        .then((response) => {
          // console.log(response.data);
          if (response?.data?.message) {
            this.clearUser();
            this.loggedOut = "Du er nu logget ud.";
            if (router.currentRoute.value.name !== 'Home') {
              router.push({ name: 'Home' });
            }
          }
        })
        .catch(() => {
          // console.error("login: ", error); // Lad os undgå at skrive fejl i loggen, når vi ikke debugger
        });
    },
  }
});
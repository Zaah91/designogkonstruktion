import { defineStore } from 'pinia';

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
    }
  }
});
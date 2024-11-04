<template>
  <header>
    <v-container v-if="siteInfo.loggedIn" class="headerWrapper">
      <v-row class="flex-nowrap headerRow" no-gutters>
        <v-col class="flex-grow-0 flex-shrink-0">
          <div class="d-flex justify-content-start m-0 p-0">
            <router-link to="/"
              ><img id="logo" :alt="siteInfo.sitename" :src="siteInfo.logo"
            /></router-link>
          </div>
        </v-col>

        <v-col class="flex-grow-1 flex-shrink-1 userListCol">

        </v-col>

        <v-col class="flex-grow-0 flex-shrink-0">
          <div class="d-flex justify-end">
            <nav>
              <ol class="d-flex justify-center headerNavigation">
                <li>
                  <v-btn
                    text
                    icon
                    color="secondary"
                    :to="{ name: 'Support' }"
                    class="navBtn"
                    ><v-icon color="actionTxt" icon="mdi-face-agent"
                  /></v-btn>
                </li>
                <li v-if="route.name == 'Home'">
                  <v-btn text icon color="secondary" class="navBtn"
                    ><v-icon color="actionTxt" icon="mdi-close" @click="logout"
                  /></v-btn>
                </li>
                <li v-else>
                  <v-btn text icon color="secondary" class="navBtn"
                    ><v-icon color="actionTxt" icon="mdi-close" @click="goBack"
                  /></v-btn>
                </li>
                <li>
                  <v-btn
                    text
                    icon
                    color="secondary"
                    :to="{ name: 'Settings' }"
                    class="navBtn"
                    ><v-icon color="actionTxt" icon="mdi-cog"
                  /></v-btn>
                </li>
              </ol>
            </nav>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </header>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  name: "NavHeader",
  props: {
    siteInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isLoggedIn() {
      // Tjek om vi er logget ind (meget simpelt tjek, fordi vi ved ikke, om vi når at lave login)
      // Skal dog have noget, så vi kan vise login-forsiden
      return this.siteInfo.loggedIn;
    },
    orderedUsers() {
      return this.siteInfo.users.slice().sort((user) => {
        if (user.username === this.siteInfo.username) {
          return -1; // Flyt forrest hvis logget ind
        }
        return 1;
      });
    },
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      const loggedInUser = this.siteInfo.users.find(
        (user) => user.username === this.siteInfo.username
      );
      if (loggedInUser) {
        return loggedInUser
      } else {
        return this.siteInfo.users.find((user) => user.username === 'Ulla');
      }
    },
  },
  methods: {
    logout() {
      this.$emit('logout')
    }
  },
  setup() {
    const route = useRoute();
    return { route };
  }
};
</script>

<style scoped>
.userPicture {
  width: 100%;
  border-radius: 9999px;
  display: block;
}
.loggedInAs {
  width: 98%;
  padding: 1rem;
}
.userList {
  width: 95%;
}
.userListItem {
  width: 50%;
  padding: 0.5rem;
}

#logo {
  height: 4rem;
}

header {
  background: #fa8073;
  width: 25%;
  height: 100%;
  position: fixed;
  left: 0;
  min-height: 3rem;
}

nav {
  display: flex;
  width: 33%;
  justify-content: right;
  padding: 0.5rem;
}
header .navBtn {
  font-size: 2rem;
}

ul,
ol {
  list-style-type: none;
  padding: 0;
}
header li {
  padding: 0.5rem;
}

/* Mobile styles */
@media (max-width: 480px) {
  .headerNavigation {
    flex-direction: column;
  }
}
@media (max-width: 570px) {
  .userPicture,
  .userListItem, .loggedInAs {
    width: 2rem;
  }
  .loggedInAs {
    width:5rem;
    padding: 1rem;
  }
  header .navBtn {
    font-size: 1rem !important;
    width: 2rem;
    height: 2rem;
  }
}
@media (max-width: 1024px) {
  header {
    position:relative;
    width: 100%;
    top: 0;
    height: auto;
  }
  .headerRow {
    flex-direction: row;
  }
  .userPicture,
  .userListItem {
    width: 5rem;
  }
  .loggedInAs {
    width: 8rem;
  }
  header .navBtn {
    font-size: 2rem;
  }
  .userListCol {
    display: flex;
  }
}

/* Small Desktop styles */
@media (min-width: 1024px) {
  .headerRow {
    flex-direction: column;
    height: 100%;
  }
  .headerWrapper {
    height: 100vh;
  }
}

/* Large Desktop styles */
@media (min-width: 1200px) {
}
</style>

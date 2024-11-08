<template>
  <v-main v-if="this.siteInfo.loggedIn" class="mainContent">
    <div class="pa-4 flexWrap">
      <div class="flex-grow-1 flex-shrink-1">
        <h1>Indstillinger</h1>
        <v-container>
          <v-text-field
            label="Fulde navn"
            prepend-icon="mdi-pencil"
            v-model="this.selectedUser.name"
          />
          <v-text-field
            label="Email"
            prepend-icon="mdi-mail"
            v-model="this.selectedUser.email"
          />
        </v-container>
      </div>
      <div class="flex-grow-1 flex-shrink-1 pt-4">
        <v-img
          :src="loggedInUser.photo"
          :alt="loggedInUser.username"
          class="d-flex justify-center userPicture"
        />
        <v-container class="pa-0">
          <h2>Interesser</h2>
          <template
            v-for="(community, index) in this.selectedUser.communities"
            :key="index"
          >
            <template v-if="this.selectedUser.communities">
              <v-checkbox color="btnPrimary"
                class="ma-0 pa-0"
                :label="community.name"
                v-model="this.selectedUser.communities[index].value"
              ></v-checkbox>
            </template>
          </template>
        </v-container>
      </div>
    </div>
  </v-main>
</template>

<script>
export default {
  name: "SettingsView",
  data() {
    return {
      selectedUser: false,
      tempCommunityUpdated: false,
    };
  },
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
  methods: {
    addMissingCommunitiesAndValuesInTmp() {
      this.tempCommunityUpdated = true;
      // Tilføl en midlertidig "value" property, som vi så kan binde via v-modal i vores v-for (fjernes igen inden dataen evt sendes tilbage selvfølgelig)
      for (let i = 0; i < this.selectedUser.communities.length; i++) {
        if (typeof this.selectedUser.communities[i].value == "undefined") {
          this.selectedUser.communities[i].value = true;
        }
      }

      // Bemærk: I app.vue har vi defineret den fulde liste af ting, brugeren kan tilmelde sig.
      // Nu skal vi lige sikre, at alle tingene eksistere i det midlertidige community array. Hvis ikke, så tilføjer vi det som mangler..
      for (let i = 0; i < this.siteInfo.communities.length; i++) {
        // iterer igennem det midlertidige community array
        let foundThing = this.selectedUser.communities.find(
          (community) => community.name === this.siteInfo.communities[i].name
        );
        if (!foundThing) {
          this.siteInfo.communities[i].value = false;
          this.selectedUser.communities.push(this.siteInfo.communities[i]);
        }
      }
    },
  },
  computed: {
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      const loggedInUser = this.siteInfo.users.find(
        (user) => user.username === this.siteInfo.username
      );
      if (loggedInUser) {
        return loggedInUser;
      } else {
        return this.siteInfo.users.find((user) => user.username === "Ulla");
      }
    },
  },
  mounted() {
    if (!this.tempCommunityUpdated) {
      // Gem en midlertidig kopi af den bruger, som er logget ind, inklusiv deres settings, som de så kan ændre for deres aktive session
      this.selectedUser = this.loggedInUser;
      // --------------------------------------------------
      // Jeg har haft et fantastisk problem med arrays af UI komponenter (v-checkbox i det her tilfælde), fordi man ikke nødvendigvis binde direkte til dem via v-model
      // Funktionskald nedenfor er et sindsygt hack til at omgå problemet..
      // Jeg ved godt, jeg bare kunne tilføje "value" manuelt i App.vue, men jeg har før haft situationer, hvor jeg ikke har haft kontrol over den data jeg fik.
      // Nu prøver jeg lige at løse det på denne her måde...
      // Forbered vores midlertidige kopi af communities arraryet på denne her sindsyge besværlige måde!!
      this.addMissingCommunitiesAndValuesInTmp();
      // --------------------------------------------------
    }
  },
};
</script>

<style scoped>
.userPicture {
  width: 100%;
  border-radius: 1rem;
}
@media (max-width: 1024px) {
  .flexWrap {
    display: block;
    justify-content: center;
    margin-left: 0;
    min-width:300px;
    width:90%;
  }
}
@media (min-width: 1024px) {
  .flexWrap {
    display: flex;
    justify-content: center;
    margin-left: 0;
  }
}
</style>

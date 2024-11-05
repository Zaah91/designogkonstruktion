<template>
  <v-main class="mainContent">
    <div class="pa-4 chatWrap">
      <h1>Chat</h1>

      <!-- TODO: dummy beskederne skal flyttes til et array under siteIfor, så vi er forberedt på at få hentet chatten fra en leverandør. Eks. Vores egen database.  -->
      <section>
        <v-img
          :src="this.findUser('Eivind').photo"
          :alt="this.findUser('Eivind').username"
          rounded="circle"
          class="userPicture"
        />
        <div class="msgWrap">
          <p class="msg">
            STOP så begge to! Denne opførsel hører ingen steder hjemme her i
            gruppen. Jeg forventer, at I viser respekt for hinanden og holder en
            ordentlig tone. Én gang til, og I bliver begge bandlyst fra chatten!
            Få det nu løst som voksne mennesker.
          </p>
          <p class="name">{{ this.findUser("Eivind").name }}</p>
        </div>
      </section>
      <section>
        <v-img
          :src="this.findUser('Karan').photo"
          :alt="this.findUser('Karan').username"
          rounded="circle"
          class="userPicture"
        />
        <div class="msgWrap">
          <p class="msg">
            Jamen altså, Ulla, det er jo lige netop dét! Din håndskrift er som
            hieroglyffer – ingen kan læse det! Hvis du skrev tydeligt, ville jeg
            ikke sidde her og bakse med noget, der ligner en strikket
            kludedukke!
          </p>
          <p class="name">{{ this.findUser("Karan").name }}</p>
        </div>
      </section>
      <section>
        <v-img
          :src="this.findUser('Ulla').photo"
          :alt="this.findUser('Ulla').username"
          rounded="circle"
          class="userPicture"
        />
        <div class="msgWrap">
          <p class="msg">
            Helt ærligt, Karen! Hvis du nu bare fulgte opskriften ORDENTLIGT og
            ikke fumlede rundt hele tiden, så var du nok færdig nu! Det er altså
            ikke opskriftens skyld, hvis man ikke læser den ordentligt!
          </p>
          <p class="name">{{ this.findUser("Ulla").name }}</p>
        </div>
      </section>
      <section>
        <v-img
          :src="this.findUser('Karan').photo"
          :alt="this.findUser('Karan').username"
          rounded="circle"
          class="userPicture"
        />
        <div class="msgWrap">
          <p class="msg">
            Altså, jeg forstår simpelthen ikke denne opskrift! Har tre gange
            pillet det op nu, og det ligner stadig alt andet end en sweater.
            Måske er det min hjerne eller opskriften, men noget går HELT galt
            her!
          </p>
          <p class="name">{{ this.findUser("Karan").name }}</p>
        </div>
      </section>
    </div>
  </v-main>
</template>

<script>
export default {
  name: "ChatView",
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
  methods: {
    findUser(username) {
      // Retuner user-objektet for den bruger, som er logget ind
      const loggedInUser = this.siteInfo.users.find(
        (user) => user.username === username
      );
      if (loggedInUser) {
        return loggedInUser;
      } else {
        return this.siteInfo.users.find((user) => user.username === "Ulla");
      }
    },
  },
};
</script>

<style scoped>
.chatWrap {
  display: block;
}
section {
  display: flex;
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 1rem;
}
section p {
  margin: 1rem;
}
section:nth-child(odd) {
  background-color: #e2e2e2;
}
section:nth-child(even) {
  background-color: #eeeeee;
}
.userPicture {
  width: 13rem;
  margin: 1rem;
  border-radius: 1rem;
}
.msgWrap .name {
  font-weight: bold;
}
@media (max-width: 1024px) {
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

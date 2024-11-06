<template>
  <v-app>
    <NavHeader :siteInfo="siteInfo" @logout="handleLogout" />
    <router-view />
  </v-app>
</template>

<script>
// Komponenter
import NavHeader from "@/components/NavHeader.vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

export default {
  name: "App",
  components: {
    NavHeader,
  },
  data() {
    return {
      siteInfo: {
        sitename: "Gammelchat",
        logo: require("@/assets/gammelchat-logo.webp"),
        loggedIn: false,
        loggedInUser: {},
        users: [
          {
            username: "Eivind",
            name: "Eivind Johannes Goldenstein Hansen",
            email: "eivind@example.com",
            photo: require("@/assets/eivind.webp"),
            communities: [
              {
                name: "Fiskehjørnet",
              },
              {
                name: "Lotusklubben",
              },
            ],
          },
          {
            username: "Karan",
            name: "Karen Elisabeth Johannesson",
            email: "karen@example.com",
            photo: require("@/assets/karan.webp"),
            communities: [
              {
                name: "Strikkeklubben",
              },
            ],
          },
          {
            username: "Ulla",
            name: "Ulla Hansen",
            email: "ulla@example.com",
            photo: require("@/assets/ulla.webp"),
            communities: [
              {
                name: "Strikkeklubben",
              },
            ],
          },
        ],
        communities: [
          {
            name: "Strikkeklubben",
          },
          {
            name: "Lotusklubben",
          },
          {
            name: "Fiskehjørnet",
          },
        ],
        activeSection: "sectionOne",
        sections: {
          sectionOne: {
            mainTitle: "Svømmeklubben Ishøj",
            title: "Velkommen til Senior Svømmeklubben",
            text1:
              "Skønt at se jer alle ved bassinet igen! I dag varmer vi op med nogle rolige baner, og så laver vi lidt vandgymnastik, som styrker både balance og led. Som altid tager vi det i eget tempo, så alle kan være med – det vigtigste er, at vi får bevæget os og har det sjovt sammen.",
            text2:
              "Efter svømningen samles vi til en kop kaffe og en hyggelig snak. Hvis nogen har tips til afslapning efter svømmetræning eller små øvelser, de gerne vil dele, så er I meget velkomne. Og husk, næste uge planlægger vi en tur til wellness-bassinet, så glæd jer til en ekstra afslappende session!",
          },
          sectionTwo: {
            mainTitle: "Bage Klubben",
            title: "Velkommen til Eftermiddagsklubben!",
            text1:
              "Tag plads, og få dig en kop kaffe – vi har også friskbagte småkager, som altid. Vi glæder os til endnu en hyggelig eftermiddag sammen, hvor vi kan snakke, grine og dele minder. Der er planlagt banko og musik fra vores unge dage, og selvfølgelig vores faste quizrunde – så hiv jeres bedste minder frem og vær klar til lidt venlig konkurrence!",
            text2:
              "Og husk, vi har også vores Del et minde-session i dag. Hvis nogen af jer har gamle billeder eller spændende historier, I gerne vil dele, så tag dem endelig med. Vi glæder os til at høre om jeres oplevelser og minder.",
          },
          sectionThree: {
            mainTitle: "Gå-klubben Amager",
            title: "Velkommen til Gå-klubben Amager",
            text1:
              "Godt at se jer alle igen! Vi har en dejlig rute planlagt i dag – vi starter ved parken og fortsætter langs søen, hvor efterårsfarverne virkelig står flot lige nu. Vi tager det stille og roligt, så alle kan følge med, og som altid holder vi en lille pause halvvejs til en kop kaffe og en snak.",
            text2:
              "Husk også at tage godt fodtøj på, og hvis nogen har lyst til at dele deres yndlingssted fra dagens tur, så har vi en kort hyggesession efter gåturen. Det er altid spændende at høre historierne og minderne fra de steder, vi besøger!",
          },
        },
      },
    };
  },
  provide() {
    // Fordi siteInfo ikke er direkte tilgængelig i vores views, bliver vi nødt til at dele den først via provide
    // Inde i de views, som skal bruge den, skal vi huske at lave en inject af den. Se eks HomeView.
    return {
      siteInfo: this.siteInfo, // Providing `siteInfo` for child components
    };
  },
  methods: {
    handleLogin(username) {
      this.siteInfo.loggedIn = true;
      this.siteInfo.username = username;
    },
    handleLogout() {
      this.siteInfo.loggedIn = false;
      this.siteInfo.username = "";
      this.siteInfo.loggedInUser = {};
    },
    redirectToHome() {
      const router = useRouter();
      if (!this.siteInfo.loggedIn && this.route.name !== "Home") {
        router.push({ name: "Home" }); // Redirect til home, hvis route name ikke matcher, og brugeren ikke er logget ind
      }
    },
    setActiveSection(section) {
      this.activeSection = section;
    },
  },
  computed: {
    activeSectionData() {
      return this.sections[this.activeSection];
    },
  },
  mounted() {
    // Når vores app bliver "mounted", tjek om brugeren er logget ind; hvis ikke omstiller vi til forsiden
    this.redirectToHome();
  },
  setup() {
    // route komponentet skal bruges til at sammenligne sider
    const route = useRoute();
    return { route };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
}
a {
  color: #0c8a6f;
}
</style>

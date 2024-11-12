<template>
  <div>
    <v-btn
      text
      icon
      @click="drawer = !drawer"
      id="burgerMenu"
      color="secondary"
    >
      <v-icon :icon="drawer ? 'mdi-close' : 'mdi-menu'"></v-icon>
    </v-btn>
  </div>

  <v-navigation-drawer
    v-if="!isMobile"
    color="primary"
    class="drawerMobile"
    v-model="drawer"
    temporary
    sticky
    :scrim="false"
  >
    <v-list base-color="secondary" color="primary" variant="elevated">
      <v-list-item
        color="#000"
        prepend-icon="mdi-face-agent"
        title="Kontakt"
        :to="{ name: 'Support' }"
      ></v-list-item>
      <v-list-item
        color="#000"
        prepend-icon="mdi-cog"
        title="Indstillinger"
        :to="{ name: 'Settings' }"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-btn
        @click="logout"
        class="rounded-0"
        prepend-icon="mdi-close"
        color="secondary"
        block
        >Log ud</v-btn
      >
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "BurgerMenuNav",
  data() {
    return {
      drawer: false,
      isMobile: false
    };
  },
  props: {
    // Vi skal bruge en prop for at dele siteInfo objektet fra App.vue meed NavHeader
    siteInfo: {
      type: Object,
      required: true
    },
  },
  methods: {
    logout() {
      this.$emit("logout");
    }
  },
  watch: {
    "$vuetify.breakpoint.width"(newWidth) {
      this.drawer = this.isMobile = newWidth <= 1024;
    }
  },
};
</script>

<style scoped>
#burgerMenu {
  position: fixed;
  top: 0.9rem;
  left: 7rem;
  z-index: 9999;
  font-size:1.7rem;
  width: 3rem;
  height: 3rem;
}
.drawerMobile {
  padding-top: 7rem;
}
.drawerMobile .v-list-item {
  position:relative;
  z-index:9999;
}

@media (min-width: 1024px) {
  #burgerMenu,
  .drawerMobile {
    display: none;
  }
}
</style>

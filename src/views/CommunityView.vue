<template>
  <v-main class="mainContent">
    <div class="pa-4 flexWrap">
      <h1>Fællesskab</h1>
      <v-btn color="secondary" class="d-block pa-2" :to="{ name: 'Chat' }">Chat</v-btn>
      <v-btn color="secondary" class="d-block mt-8 pa-2" :to="{ name: 'Video' }">Video</v-btn>
      <v-btn color="secondary" class="d-block mt-8 pa-2" :to="{ name: 'Forum' }">Forum</v-btn>
    </div>
  </v-main>
</template>

<script>
export default {
  name: "CommunityView",
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
};
</script>

<style scoped>
.flexWrap {
  width: 20rem;
}
</style>

<template>
  <v-main class="mainContent">
    <div class="pa-4 flexWrap">
      <h1>Forum</h1>
    </div>
  </v-main>
</template>

<script>
export default {
  name: "ForumView",
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
};
</script>

<style scoped>
h1 {
  color: #000000;
}
</style>

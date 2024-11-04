<template>
  <div>
    <h1>Community</h1>
  </div>
</template>

<script>
export default {
  name: "CommunityView",
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
};
</script>

<style scoped>
h1 {
  color: #000000;
}
</style>

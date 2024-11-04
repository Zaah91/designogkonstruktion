<template>
  <div>
    <h1>Indstillinger</h1>
  </div>
</template>

<script>
export default {
  name: "SettingsView",
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
};
</script>

<style scoped>
h1 {
  color: #000000;
}
</style>

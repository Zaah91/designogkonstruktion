<template>
  <div>
    <h1>Chat</h1>
  </div>
</template>

<script>
export default {
  name: "ChatView",
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
};
</script>

<style scoped>
h1 {
  color: #000000;
}
</style>

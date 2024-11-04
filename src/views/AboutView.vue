<template>
    <div>
      <h1>Om os</h1>
      <p>Dette er Gammelchatten.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutView',
    inject: ['siteInfo'], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
  }
  </script>
  
  <style scoped>
  h1 {
    color: #000000;
  }
  </style>

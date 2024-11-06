<template>
  <v-app>
    <v-app-bar class="bbb">
      <v-btn icon @click="drawer = !drawer" class="navigationBar">
        <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :temporary="true"
      location="left">
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          @click="drawer = false" >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    const drawer = ref(false);
    const menuItems = ref([
      { title: "Home" },
      { title: "Profile" },
      { title: "Help" },
      { title: "Forum" },
      { title: "Chatrum" },
    ]);

    return { drawer, menuItems };
  },
};
</script>

<style scoped>
.bbb{
  color: brown;
  background-color: aquamarine;
}
.navigationBar{
  top: 10px;
  left: 20px;
  width: 50px;
  position: absolute;
  transition: background-color 0.3s;;
}
</style>

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import af routeren
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import '@/assets/styles/global.scss';  // Delte SCSS styles
import { createPinia } from 'pinia';

loadFonts();

const app = createApp(App);
app.config.globalProperties.$apiUrl = process.env.VUE_APP_API_BASE_URL;

// Tilføj vuetify
app.use(vuetify);

// Tilføj routeren til app'en
app.use(router);

// Opret en pinia instance til opbevaring af globale data i form af ./stores/*
const pinia = createPinia();
app.use(pinia);

// Mount app'en til #app containeren
app.mount('#app');
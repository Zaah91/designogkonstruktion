import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import af routeren
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

loadFonts();

const app = createApp(App);

// Tilføj vuetify
app.use(vuetify);

// Tilføj routeren til app'en
app.use(router);

// Mount app'en til #app containeren
app.mount('#app');
import { createVuetify } from "vuetify";
import "vuetify/styles";

// Importer kun de components, som vi faktisk bruger. Eks. VIcon eller VBtn.
// import { VIcon, VBtn, VMain, VTextField, VDivider } from 'vuetify/components';
import * as components from "vuetify/components";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          actionTxt: "#fff",
          primary: "#FA8073",
          secondary: "#AD5950",
          btnPrimary: "#0C8A6F",
        },
      },
    },
  },
});

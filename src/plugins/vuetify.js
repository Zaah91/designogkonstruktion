import { createVuetify } from "vuetify";
import "vuetify/styles";
import da from 'vuetify/lib/locale/da';

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
          inputBg: "#f6f6f6",
          inputSecondaryBg: "#ececec",
          actionTxt: "#fff",
          primary: "#FA8073",
          secondary: "#AD5950",
          btnPrimary: "#0C8A6F",
        },
      },
    },
  },
  locale: {
    locale: 'da',
    messages: { da },
  },
});

const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', // Når vi deploy'er appen skal vi bruge relative stier, fordi ellers kan vi ikke placere appen i en subfolder på vores domæne. Denne indstilling slår det til for os.
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ],
  },
})

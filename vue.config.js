const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './' // Når vi deploy'er appen skal vi bruge relative stier, fordi ellers kan vi ikke placere appen i en subfolder på vores domæne. Denne indstilling slår det til for os.
})

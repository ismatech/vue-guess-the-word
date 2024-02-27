const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/guess-the-word/' : './',
  productionSourceMap: false,
  filenameHashing: false
})

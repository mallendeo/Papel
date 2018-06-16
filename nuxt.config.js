module.exports = {
  mode: 'spa',
  env: {
    contractDev: process.env.CONTRACT_DEV || 'n1wTbrMK62W9EnmeKRJmbFeXpJFpxS7xWYA',
    contractProd: process.env.CONTRACT_PROD || 'DO_NOT_SEND'
  },
  head: {
    title: 'Code Playground on the Blockchain - Papel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Code Playground on the Blockchain' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons|Comfortaa|Source+Code+Pro|Inconsolata' },
      { rel: 'stylesheet', href: 'https://unpkg.com/firacode@1.205.0/distr/fira_code.css' }
    ]
  },
  loading: { color: '#3B8070' },
  plugins: [
    '~/plugins/vue-codemirror',
    '~/plugins/vue-observe-visibility',
    '~/plugins/v-click-outside'
  ],

  build: {
    maxChunkSize: 300000,

    vendor: [
      'axios',
      'ipfs-api',
      'nebpay.js',
      'nebulas',
      'shortid',
      'split.js',
      'vue-codemirror',
      'vue-observe-visibility',
      'v-click-outside'
    ],

    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (isClient) {
        config.module.rules.push({
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
          exclude: /(node_modules)/
        })
      }
    }
  }
}

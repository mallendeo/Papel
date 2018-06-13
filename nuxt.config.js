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
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons|Comfortaa' }
    ]
  },
  loading: { color: '#3B8070' },
  plugins: [
    '~/plugins/vue-codemirror',
    '~/plugins/vue-observe-visibility',
    '~/plugins/v-click-outside'
  ],

  build: {
    vendor: [
      'vue-codemirror',
      'vue-observe-visibility',
      'v-click-outside',
      'split.js',
      'ipfs-api',
      'axios',
      'nebpay.js',
      'nebulas',
      'shortid'
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

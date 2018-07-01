module.exports = {
  mode: 'spa',
  env: {
    contractDev: process.env.CONTRACT_DEV || 'n1tVbiJotXAa64LN3it23YooZqBh82jqUXu',
    contractProd: process.env.CONTRACT_PROD || 'n1hy1FLTrw6uEf22Cbm4fBQKxVdHNipnGSa'
  },
  head: {
    title: 'Code Playground on the Blockchain - Papel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Code Playground on the Blockchain' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png' },
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/icons/favicon.ico' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#6e87f7' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons|Comfortaa|Source+Code+Pro|Inconsolata' },
      { rel: 'stylesheet', href: 'https://unpkg.com/firacode@1.205.0/distr/fira_code.css' }
    ]
  },
  loadingIndicator: {
    name: 'pulse',
    color: '#6e87f7',
    background: '#292d3d'
  },
  plugins: [
    '~/plugins/vue-codemirror',
    '~/plugins/vue-observe-visibility',
    '~/plugins/v-click-outside',
    '~/plugins/vue-clipboard',
    '~/plugins/vue-notifications'
  ],

  build: {
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

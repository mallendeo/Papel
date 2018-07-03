module.exports = {
  mode: 'spa',
  env: {
    contractDev: process.env.CONTRACT_DEV || 'n1tVbiJotXAa64LN3it23YooZqBh82jqUXu',
    contractProd: process.env.CONTRACT_PROD || 'n1hy1FLTrw6uEf22Cbm4fBQKxVdHNipnGSa',
    mainnetUrl: 'https://mainnet.nebulas.io',
    testnetUrl: 'https://testnet.nebulas.io'
  },

  modules: [
    '@nuxtjs/pwa',
  ],

  workbox: {
    runtimeCaching: [
      { urlPattern: 'https://papel.app/.*' }
    ]
  },

  manifest: {
    name: 'Papel Code Playground',
    short_name: 'Papel',
    start_url: '.',
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    theme_color: '#292D3D',
    background_color: '#292D3D',
    display: 'standalone'
  },
  meta: {
    charset: 'utf-8',
    description: 'Code Playground on the Blockchain'
  },
  head: {
    title: 'Code Playground on the Blockchain - Papel',
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png' },
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

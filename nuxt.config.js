const {
  USE_MAINNET,
  CONTRACT_DEV = 'n1pUi7bZQeXEWcP4rbC1SXnZPcLdaiFZGmj',
  CONTRACT_PROD = 'n1y6zyNJb9iHkjdk3jbhL1iPKkDvigSbSYE'
} = process.env

module.exports = {
  mode: 'spa',
  env: {
    contractDev: CONTRACT_DEV,
    contractProd: CONTRACT_PROD,
    mainnetUrl: 'https://mainnet.nebulas.io',
    testnetUrl: 'https://testnet.nebulas.io',
    useMainnet: typeof USE_MAINNET !== 'undefined' && JSON.stringify(USE_MAINNET) === '"true"',
    ipfsHost: process.env.IPFS_HOST,
    ipfsPort: process.env.IPFS_PORT,
    extLink: 'https://chrome.google.com/webstore/detail/gehjkhmhclgnkkhpfamakecfgakkfkco'
  },

  modules: [
    '@nuxtjs/pwa'
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
    meta: [
      { name: 'google-site-verification', content: 'moKe0I2qNGqO4OWhWFwdjkT6lAWbrD8ochICI3hl48M' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png' },
      { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#6e87f7' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons|Raleway' }
    ]
  },

  loadingIndicator: 'static/loading.html',

  plugins: [
    '~/plugins/vue-codemirror',
    '~/plugins/vue-observe-visibility',
    '~/plugins/v-click-outside',
    '~/plugins/vue-clipboard',
    '~/plugins/vue-notifications'
  ],

  router: {
    extendRoutes (routes, resolve) {
      const home = resolve(__dirname, 'pages/index.vue')
      const profile = resolve(__dirname, 'pages/_username/index.vue')
      const editor = resolve(__dirname, 'pages/_username/_editor.vue')
      const profileSettings = resolve(__dirname, 'pages/_username/edit.vue')

      // Workaround for dynamic routes like:
      // -- /user/project
      // -- /popular/12
      // -- /user/private/2

      routes.splice(0, routes.length)
      routes.push(
        {
          name: 'getting-started',
          path: '/getting-started',
          component: resolve(__dirname, 'pages/getting-started.vue')
        },

        { name: 'home', path: '/', component: home },
        { name: 'home-picks', path: '/picks/:page?', component: home },
        // { name: 'home-popular', path: '/popular/:page?', component: home },
        { name: 'home-public', path: '/public/:page?', component: home },

        { name: 'profile', path: '/:username', component: profile },
        { name: 'profile-settings', path: '/:username/edit', component: profileSettings },
        // { name: 'profile-popular', path: '/:username/popular/:page?', component: profile },
        // { name: 'profile-public', path: '/:username/public/:page?', component: profile },
        // { name: 'profile-private', path: '/:username/private/:page?', component: profile },

        { name: 'editor', path: '/:username/:slug', component: editor }
      )
    }
  },

  build: {
    postcss: [
      require('postcss-cssnext')({
        features: {
          customProperties: false
        }
      })
    ],

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

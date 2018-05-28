module.exports = {
  mode: 'spa',
  env: {
    contractDev: 'n1nquzBQ1kmkDbR9ChKJvdnPzD87kjLq33H',
    contractProd: 'DO_NOT_SEND'
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
  plugins: [{ src: '~/plugins/vue-codemirror' }],

  build: {
    vendor: ['vue-codemirror', 'split.js'],

    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

const LANG_MAP = {
  babel: {
    global: 'Babel',
    url: '/vendor/babel.min.js'
  },
  stylus: {
    global: 'stylus',
    url: '/vendor/stylus.min.js'
  },
  pug: {
    global: 'pug',
    url: '/vendor/pug.min.js'
  }
}

const transform = async (code, lang) => {
  const prepros = LANG_MAP[lang]

  let loadedLib = self[prepros.global]

  if (!loadedLib) {
    self.postMessage({ lang, loading: true })
    importScripts(prepros.url)

    loadedLib = self[prepros.global] // re-assign once loaded

    self.postMessage({ lang, loading: false })
  }

  return new Promise((resolve, reject) => {
    if (['html', 'css', 'js'].indexOf(lang) > -1) {
      resolve(code)
      return
    }

    if (!prepros) return reject('Preprocessor not supported.')
    try {
      switch (lang) {
        case 'pug':
          resolve(loadedLib.render(code))
          break
        case 'stylus':
          loadedLib(code)
            .render((err, str) => {
              if (err) return reject(err)
              resolve(str)
            })
          break
        case 'babel':
          const out = loadedLib.transform(code, {
            presets: ['es2015', 'stage-0']
          })
          resolve(out.code)
          break
        default:
          throw Error(`Invalid lang: ${lang}`)
      }
    } catch (err) {
      reject(err)
    }
  })
}

self.addEventListener('message', async event => {
  // type can be html, css or js
  const { type, code, lang } = event.data
  if (!lang) return

  try {
    const output = await transform(code, lang)

    self.postMessage({ type, output, lang })
  } catch (err) {
    console.error(err)
    self.postMessage({ type, error: err.message, lang })
  }
}, false)


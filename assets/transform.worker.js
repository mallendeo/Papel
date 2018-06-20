const LANG_MAP = {
  md: { global: 'showdown', url: '/vendor/showdown.min.js' },
  pug: { global: 'pug', url: '/vendor/pug.min.js' },
  stylus: { global: 'stylus', url: '/vendor/stylus.min.js' },
  scss: { global: 'sass', url: '/vendor/sass.sync.js' },
  sass: { global: 'sass', url: '/vendor/sass.sync.js' },
  babel: { global: 'Babel', url: '/vendor/babel.min.js' },
  ts: { global: 'ts', url: '/vendor/typescriptServices.js' },
  coffee: { global: 'CoffeeScript', url: '/vendor/coffeescript.js' }
}

const transform = async (code, lang) => {
  if (['html', 'css', 'js'].indexOf(lang) > -1) {
    return Promise.resolve(code)
  }

  const prepros = LANG_MAP[lang]

  let lib = self[prepros.global]

  if (!lib) {
    self.postMessage({ lang, loading: true })
    importScripts(prepros.url)

    lib = self[prepros.global] // re-assign once loaded

    self.postMessage({ lang, loading: false })
  }

  return new Promise((resolve, reject) => {
    if (!prepros) return reject('Preprocessor not supported.')
    let out = ''

    try {
      switch (lang) {
        // HTML
        case 'pug':
          resolve(lib.render(code, { pretty: true }))
          break

        case 'md':
          resolve(new lib.Converter().makeHtml(code))
          break

        // CSS
        case 'stylus':
          lib(code)
            .render((err, str) => {
              if (err) return reject(err)
              resolve(str)
            })
          break
        case 'sass':
        case 'scss':
          const opts = { indentedSyntax: lang === 'sass' }
          Sass.compile(code, opts, result => {
            if (result.status) {
              return reject(Error(result.formatted))
            }

            resolve(result.text)
          })
          break

        // JS
        case 'babel':
          out = lib.transform(code, {
            presets: ['es2015', 'stage-0']
          })
          resolve(out.code)
          break
        case 'ts':
          out = lib.transpile(code, { target: ts.ScriptTarget.ES5 })
          resolve(out)
          break
        case 'coffee':
          try {
            out = lib.compile(code)
            resolve(out)
          } catch (err) {
            reject(err)
          }
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
    self.postMessage({
      kind: 'prepros',
      output: await transform(code, lang),
      type,
      lang
    })
  } catch (err) {
    self.postMessage({
      kind: 'prepros',
      error: err.message,
      type,
      lang
    })
  }
}, false)


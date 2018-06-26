const LANG_MAP = {
  md: { global: 'showdown', url: '/vendor/showdown.min.js' },
  pug: { global: 'pug', url: '/vendor/pug.min.js' },
  stylus: { global: 'stylus', url: '/vendor/stylus.min.js' },
  scss: { global: 'sass', url: '/vendor/sass.sync.js' },
  sass: { global: 'sass', url: '/vendor/sass.sync.js' },
  less: { global: 'less', url: '/vendor/less.min.js' },
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

    // FIXME:
    // Workaround for less not being loaded
    // on the first run
    if (lang === 'less') {
      window = self
      window.document = {
        getElementsByTagName (tagName) {
          if (tagName === 'script') {
            return [{ dataset: {} }]
          } else if (tagName === 'style') {
            return []
          } else if (tagName === 'link') {
            return []
          }
        }
      }

      setTimeout(() => importScripts(prepros.url), 0)
      await new Promise(r => setTimeout(r, 16))
    } else {
      importScripts(prepros.url)
    }

    lib = self[prepros.global] // re-assign once loaded
    self.postMessage({ lang, loading: false })
  }

  return new Promise((resolve, reject) => {
    if (!prepros) return reject('Preprocessor not supported.')

    let output = ''

    try {
      switch (lang) {
        // HTML
        case 'pug':
          resolve(pug.render(code, { pretty: true }))
          break

        case 'md':
          resolve(new showdown.Converter().makeHtml(code))
          break

        // CSS
        case 'stylus':
          stylus(code)
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
        case 'less':
          less.render(code)
            .then(({ css }) => resolve(css))
            .catch(reject)
          break

        // JS
        case 'babel':
          output = Babel.transform(code, {
            presets: ['es2015', 'stage-0']
          })
          resolve(output.code)
          break
        case 'ts':
          output = ts.transpile(code, { target: ts.ScriptTarget.ES5 })
          resolve(output)
          break
        case 'coffee':
          output = CoffeeScript.compile(code)
          resolve(output)
          break

        default:
          throw Error(`Invalid lang: ${lang}`)
      }
    } catch (err) {
      reject(err)
    }
  })
}

const compile = async (type, code, lang) => {
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
  } finally {
    setProp(lang, 'processing', false)
  }
}

const setProp = (lang, prop, value) => {
  if (!lang || !prop) throw Error('Missing props')

  // Only for languages that needs preprocessing
  if (['html', 'css', 'js'].indexOf(lang) > -1) return
  LANG_MAP[lang][prop] = value
}

const getProp = (lang, prop) => {
  if (!lang || !prop) throw Error('Missing props')
  return LANG_MAP[lang] && LANG_MAP[lang][prop]
}

self.addEventListener('message', async event => {
  // type can be html, css or js
  const { type, code, lang } = event.data
  setProp(lang, 'src', { code, type })
  if (!lang) return

  const now = Date.now()
  setProp(lang, 'lastModified', now)
  if (getProp(lang, 'processing')) return

  setProp(lang, 'processing', true)
  await compile(type, code, lang)

  // Check if there is new code
  if (getProp(lang, 'lastModified') > now) {
    const newCode = getProp(lang, 'src')
    await compile(newCode.type, newCode.code, lang)
  }

  setProp(lang, 'processing', false)
}, false)


importScripts('./vendor/stylus.min.js')
importScripts('./vendor/pug.min.js')
importScripts('./vendor/babel.min.js' )

const transform = async (code, lang) =>
  new Promise((resolve, reject) => {
    try {
      switch (lang) {
        case 'html':
        case 'css':
        case 'js':
          resolve(code)
          break
        case 'pug':
          pug && resolve(pug.render(code))
          break
        case 'stylus':
          stylus && stylus(code)
            .render((err, str) => {
              if (err) return reject(err)
              resolve(str)
            })
          break
        case 'babel':
          const out = Babel && Babel.transform(code, {
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

self.addEventListener('message', async event => {
  // type can be html, css or js
  const { type, code, lang } = event.data
  if (!lang) return

  try {
    const output = await transform(code, lang)

    self.postMessage({ type, output, lang })
  } catch (err) {
    self.postMessage({ type, error: err.message, lang })
  }
}, false)


importScripts('./vendor/stylus.min.js')
importScripts('./vendor/pug.min.js')
importScripts('./vendor/babel.min.js' )

const transform = async (code, type) =>
  new Promise((resolve, reject) => {
    try {
      switch (type) {
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
          throw Error(`Invalid type: ${type}`)
      }
    } catch (err) {
      reject(err)
    }
  })

self.addEventListener('message', async event => {
  // lang can be html, css or js
  const { type, code, lang } = event.data
  if (!type || !code) return
  try {
    const output = await transform(code, type)

    self.postMessage({ type, output, lang })
  } catch (err) {
    self.postMessage({ type, error: err.message, lang })
  }
}, false)


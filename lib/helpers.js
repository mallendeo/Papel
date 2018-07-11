import { HOST as IPFS_HOST } from './ipfs'

/**
 * Repeat an async function within an interval
 * until a condition is met, or the iteration is stopped
 * by the `finish` prop on the returned value.
 *
 * @param {Function} func Function to evaluate at each iteration
 * @param {Number} retries
 * @param {Number} _delay Delay of the next iteration in milliseconds
 * @returns {Promise}
 *
 * @example
 * const payload = await asyncUntil(async (retry, timeout) => {
 *   const { done } = await axios('https://api.example.com')
 *   if (done.status === 404) return { finish: true }
 *   if (done.status === 202) return { delay: delay / 2 }
 *
 *   return { done }
 * }, 10, 4000)
 */
export const asyncUntil = async (func, retries = 10, _delay = 2000) => {
  return new Promise((resolve, reject) => {
    const loop = async (timeout = _delay, retry = 0) => {
      const { delay, finish, done } = (await func(retry, timeout) || {})

      if (done) return resolve(done)

      const last = retry + 1 === retries
      if (finish || last) return reject({ finish, last })
      const newDelay = typeof delay === 'number' ? delay : timeout

      setTimeout(() => loop(newDelay, retry + 1), newDelay)
    }

    loop()
  })
}

export const generateHTML = (opts, extra = {}) => {
  if (!opts) throw Error('Missing parameter')
  const {
    code = {},
    styles = [],
    scripts = []
  } = opts

  const { preview, liveCss } = extra

  const scriptArr = code.js && !preview ? [...scripts, 'main.js'] : scripts
  const styleArr = code.css && !preview ? [...styles, 'main.css'] : styles

  const attr = [
    opts.htmlClasses ? `class="${opts.htmlClasses}"` : '',
    `lang="${opts.lang || 'en'}"`
  ].filter(Boolean)

  return `
    <!DOCTYPE html>
    <html ${attr.join(' ')}>

    <head>
      <meta charset="UTF-8">
      ${opts.ipfsDir ? `<base href="https://${IPFS_HOST}/ipfs/${opts.ipfsDir}">` : ''}

      ${opts.icon ? `<link rel="shortcut icon" type="image/x-icon" href="${opts.icon}" />`: ''}
      ${opts.title ? `<title>${opts.title}</title>` : ''}
      ${opts.headContent || ''}

      ${styleArr.reduce((str, href) => (str + `<link rel="stylesheet" href="${href}">\n`), '')}
      ${preview ? `<style id="__papel-styles">${code.css}</style>` : ''}
    </head>

    <body>
      ${code.html || ''}
      ${scriptArr.reduce((str, src) => (str + `<script src="${src}"></script>\n`), '')}
      ${preview && liveCss ? `<script>
        window.addEventListener('message', event => {
          const { data, origin } = event
          if (data && data.type === 'papel:reload') location.reload()
          if (data && data.type !== 'papel:codeupdate') return
          if (data.event.type === 'css') {
            document.querySelector('#__papel-styles').innerHTML = data.event.output
            return
          }

          location.reload()
        }, false)
      </script>` : ''}
      ${preview ? `<script>${code.js}</script>` : ''}
    </body>
    </html>
  `
}

import { HOST as IPFS_HOST } from './ipfs'

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

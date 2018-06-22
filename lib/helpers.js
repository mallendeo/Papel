export const generateHTML = opts => {
  if (!opts) throw Error('Missing parameter')
  const {
    code = {},
    styles = [],
    scripts = []
  } = opts

  const scriptArr = code.js ? [...scripts, 'main.js'] : scripts
  const styleArr = code.css ? [...styles, 'main.css'] : styles

  const htmlClasses = opts.classes ? `class="${opts.classes}"` : ''
  const attr = [
    opts.classes ? `class="${opts.classes}"` : '',
    `lang="${opts.lang || 'en'}"`
  ].filter(Boolean)

  return `
    <!DOCTYPE html>
    <html ${attr.join(' ')}>

    <head>
      <meta charset="UTF-8">

      ${opts.icon ? `<link rel="shortcut icon" type="image/x-icon" href="${opts.icon}" />`: ''}
      ${opts.title ? `<title>${opts.title}</title>` : ''}
      ${opts.head || ''}
      ${styleArr.reduce((str, href) => (str + `<link rel="stylesheet" href="${href}">\n`), '')}
    </head>

    <body>
      ${opts.body || ''}
      ${scriptArr.reduce((str, src) => (str + `<script src="${src}"></script>\n`), '')}
    </body>
    </html>
  `
}

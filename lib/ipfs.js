import ipfsAPI from 'ipfs-api'

export const HOST = 'ipfs.infura.io'
export const ipfs = ipfsAPI(HOST, '5001', { protocol: 'https' })

/**
 * [{
 *   path: '/tmp/myfile.txt',
 *   content: <data> // A Buffer, Readable Stream or Pull Stream with the contents of the file
 * }]
 */
export const saveFiles = async (files, opts = {}) => ipfs.files.add(files, opts)

export const getContent = async (hash, opts = {}) => {
  const file = await ipfs.files.cat(hash)
  const str = file.toString()
  if (opts.parse) return JSON.parse(str)
  return str
}

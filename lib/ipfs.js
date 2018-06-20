import ipfsAPI from 'ipfs-api'

export const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

/**
 * [{
 *   path: '/tmp/myfile.txt',
 *   content: <data> // A Buffer, Readable Stream or Pull Stream with the contents of the file
 * }]
 */
export const saveFiles = async (files, opts) => ipfs.files.add(files, opts)

export const getContent = async hash => {
  const file = await ipfs.files.cat(hash)
  return file.toString()
}

import ipfsAPI from 'ipfs-api'
import { checkExt, EXT_ERROR } from './nebulas'

const { ipfsHost = 'ipfs.infura.io' } = process.env
const { ipfsPort = '5001' } = process.env

export const HOST = ipfsHost
export const IPFS_URL = `https://${HOST}/ipfs`

export const ipfs = ipfsAPI(ipfsHost, ipfsPort, { protocol: 'https' })

/**
 * @example
 * [{
 *   path: '/tmp/myfile.txt',
 *   content: <data> // A Buffer, Readable Stream or Pull Stream with the contents of the file
 * }]
 */
export const saveFiles = async (files, opts = {}) => {
  if (!checkExt()) throw Error(EXT_ERROR)
  return ipfs.files.add(files, opts)
}

export const getContent = async (hash, opts = {}) => {
  if (!checkExt()) throw Error(EXT_ERROR)
  const file = await ipfs.files.cat(hash)
  const str = file.toString()
  if (opts.parse) return JSON.parse(str)
  return str
}

import ipfsAPI from 'ipfs-api'

export const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

export const saveFiles = async files => ipfs.files.add(files)
export const getContent = async hash => {
  const file = await ipfs.files.cat(hash)
  return file.toString()
}

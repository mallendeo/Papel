/* global Contract */
import './smart-contract/extensions'

export const checkExt = () => true
export const EXT_ERROR = 'NasExtWallet is not installed'
console.log(Contract)
const contract = new Contract()
if (!localStorage.getItem('init')) {
  contract.init()
  localStorage.setItem('init', '1')
}

export const getAddress = async (wait, retries = 10) => '0000'

export const getAccount = async (address, retries) => {
  let addr = address
  if (!addr) {
    addr = await getAddress()
  }

  return { address: { currentBalance: 0 } }
}

export const callFunction = (fn, args = [], opts = {}) => {
  if (!fn) throw Error(`'fn' is required`)

  return contract[fn](args)
}

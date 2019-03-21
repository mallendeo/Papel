/* global Contract */
import './smart-contract/extensions'

export const checkExt = () => true
export const EXT_ERROR = 'NasExtWallet is not installed'

const contract = new Contract()
if (!localStorage.getItem('init')) {
  contract.init()
  localStorage.setItem('init', '1')
}

export const getAddress = async (wait, retries = 10) => 'address_1'

export const getAccount = async (address, retries) => {
  let addr = address
  if (!addr) {
    addr = await getAddress()
  }

  return {
    address: { currentBalance: 1 }
  }
}

export const callFunction = (fn, args = [], opts = {}) => {
  if (!fn) throw Error(`'fn' is required`)
  return contract[fn](...args)
}

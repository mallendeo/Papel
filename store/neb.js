/* import {
  HttpRequest,
  Neb,
  Account,
  Transaction,
  Unit
} from 'nebulas' */

import NebPay from 'nebpay.js'

const mainnetUrl = 'https://mainnet.nebulas.io'
const testnetUrl = 'https://testnet.nebulas.io'

// see https://nuxtjs.org/api/configuration-env/#process-env-
const { contractDev } = process.env
const { contractProd } = process.env

const prod = process.env.NODE_ENV === 'production'

// const neb = new Neb()
const nebPay = new NebPay()

//neb.setRequest(new HttpRequest(testnetUrl))

export const state = () => ({
  useMainnet: prod,
  contract: prod ? contractProd : contractDev,
  hostUrl: prod ? mainnetUrl : testnetUrl,
  callback: prod ? NebPay.config.mainnetUrl : NebPay.config.testnetUrl
})

export const actions = {
  pay ({ state }) {
    // setItem, getItem, removeItem
    const callFunction = 'setItem'
    const callArgs = JSON.stringify(['asd', { type: 'image/jpg', data: 'test' }])
    const value = 0

    console.log(prod, state.callback)

    const options = {
      callback: state.callback,
      listener: resp => {
        console.log('RESP', resp)
      }
    }

    const serialNumber = nebPay.call(state.contract, value, callFunction, callArgs, options)
    console.log({serialNumber})

    /*
    let itv = setInterval(async () => {
      try {
        const res = await nebPay.queryPayInfo(serialNumber)
        const obj = JSON.parse(res)
        if (obj.code === 0){
          // The transaction is successful
          console.log('DONE', obj)
          clearInterval(itv)
          itv = null
          return
        }
        console.log('STATUS', obj)
      } catch (err) {
        console.log('ERROR', err.message)
      }
    }, 10000)
    */
  }
}

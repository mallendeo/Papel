import NebPay from 'nebpay.js'
import * as types from './mutation-types'

const mainnetUrl = 'https://mainnet.nebulas.io'
const testnetUrl = 'https://testnet.nebulas.io'

// see https://nuxtjs.org/api/configuration-env/#process-env-
const { contractDev } = process.env
const { contractProd } = process.env

const prod = process.env.NODE_ENV === 'production'

const nebPay = new NebPay()

export const state = () => ({
  useMainnet: prod,
  contract: prod ? contractProd : contractDev,
  hostUrl: prod ? mainnetUrl : testnetUrl,
  currTxHash: null,
  callback: prod ? NebPay.config.mainnetUrl : NebPay.config.testnetUrl
})

export const mutations = {
  [types.SET_CURR_TXHASH] (state, hash) {
    state.currTxHash = hash
  }
}

export const actions = {
  callFunction: ({ state, commit }, { fn, args = [], value = 0, info = false }) =>
    new Promise((resolve, reject) => {
      if (!fn) throw Error(`'fn' is required`)

      const timeout = (sn, delay = 10000, retry = true) => setTimeout(async () => {
        try {
          const res = await nebPay.queryPayInfo(sn)
          const obj = JSON.parse(res)

          // nebpay query codes
          // 0 -> succeed
          // 1 -> failed

          // nebulas tx codes
          // 0 -> failed
          // 1 -> successful
          // 2 -> pending

          if (obj.code === 1 && retry) return timeout(sn, 5000, false)
          if (obj.code === 0) {
            console.log('RESULT', obj.data.execute_result)
            const parsed = obj.data.execute_result
              ? JSON.parse(obj.data.execute_result)
              : ''

            switch (obj.data.status) {
              case 0: return reject(obj.data)
              case 1: return resolve(info ? parsed : obj.data)
              case 2: timeout(sn, 5000)
            }
          }
        } catch (err) {
          reject(err)
        }
      }, delay)

      const sn = nebPay.call(state.contract, value, fn, JSON.stringify(args), {
        callback: state.callback,
        listener: res => {
          commit(types.SET_CURR_TXHASH, res.txhash)
          timeout(sn)
        }
      })
    })
}

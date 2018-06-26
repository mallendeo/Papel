import NebPay from 'nebpay.js'

const mainnetUrl = 'https://mainnet.nebulas.io'
const testnetUrl = 'https://testnet.nebulas.io'

// see https://nuxtjs.org/api/configuration-env/#process-env-
const { contractDev } = process.env
const { contractProd } = process.env

const prod = process.env.NODE_ENV === 'production'
const callback = prod ? NebPay.config.mainnetUrl : NebPay.config.testnetUrl
const hostUrl = prod ? mainnetUrl : testnetUrl
const contract = prod ? contractProd : contractDev

const nebPay = new NebPay()

export const callFunction = (fn, args = [], { value = 0, info = false } = {}) =>
  new Promise((resolve, reject) => {
    if (!fn) throw Error(`'fn' is required`)

    const timeout = (sn, delay = 10000, retries = 0) => setTimeout(async () => {
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

        if (obj.code === 1) {
          return timeout(sn, 5000, retries + 1)
        }

        if (obj.code === 0) {
          const parsed = obj.data.execute_result
            ? JSON.parse(obj.data.execute_result)
            : ''

          switch (obj.data.status) {
            case 0: return reject(obj.data)
            case 1: return resolve(info ? parsed : obj.data)
            case 2: timeout(sn, 5000, retries + 1)
          }
        }
      } catch (err) {
        reject(err)
      } finally {
        if (retries > 9) return reject('Max retries number exceeded')
      }
    }, delay)

    const sn = nebPay.call(contract, value, fn, JSON.stringify(args), {
      callback,
      listener: res => {
        commit(types.SET_CURR_TXHASH, res.txhash)
        timeout(sn)
      }
    })
  })

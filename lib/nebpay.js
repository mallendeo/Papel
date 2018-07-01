import NebPay from 'nebpay.js'

const mainnetUrl = 'https://mainnet.nebulas.io'
const testnetUrl = 'https://testnet.nebulas.io'

// see https://nuxtjs.org/api/configuration-env/#process-env-
const { contractDev } = process.env
const { contractProd } = process.env

const prod = process.env.NODE_ENV === 'production'
export const callback = prod ? NebPay.config.mainnetUrl : NebPay.config.testnetUrl
export const hostUrl = prod ? mainnetUrl : testnetUrl
export const contract = prod ? contractProd : contractDev

const nebPay = new NebPay()

export const callFunction = (fn, args = [], opts = {}) =>
  new Promise((resolve, reject) => {
    const { value = 0, info = false } = opts
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
          if (obj.data.execute_error) {
            return reject(obj.data.execute_result)
          }

          const parsed = obj.data.execute_result
            ? JSON.parse(obj.data.execute_result)
            : ''

          switch (obj.data.status) {
            case 0: return reject(obj.data)
            case 1: return resolve(info ? parsed : obj.data)
            case 2: retries < 2 && timeout(sn, 5000, retries + 1)
          }
        }
      } catch (err) {
        reject(err)
      } finally {
        if (retries > 2) return reject('Max retries number exceeded')
      }
    }, delay)

    const callFn = opts.simulate ? 'simulateCall' : 'call'
    const sn = nebPay[callFn](contract, value, fn, JSON.stringify(args), {
      callback,
      listener: res => {
        if (res.result) {
          if (res.execute_err) {
            reject(res.result)
          }

          try {
            const data = JSON.parse(res.result)
            return resolve(data)
          } catch (err) {
            return resolve(res.result)
          }
        }

        timeout(sn)
      }
    })
  })

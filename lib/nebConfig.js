import NebPay from 'nebpay.js'

// We can't destructure process.env like { contractDev, contractProd }
// see https://nuxtjs.org/api/configuration-env/#process-env-
const { contractDev } = process.env
const { contractProd } = process.env
const { testnetUrl } = process.env
const { mainnetUrl } = process.env
const { useMainnet: mainnet } = process.env

export const useMainnet = mainnet || process.env.NODE_ENV === 'production'
export const hostUrl = mainnet ? mainnetUrl : testnetUrl
export const contract = mainnet ? contractProd : contractDev
export const callback = mainnet ? NebPay.config.mainnetUrl : NebPay.config.testnetUrl

export const testApiUrl = 'https://explorer.nebulas.io/test/api'
export const mainApiUrl = 'https://explorer.nebulas.io/main/api'

export const apiUrl = mainnet ? mainApiUrl : testApiUrl

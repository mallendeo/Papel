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

export const testApiUrl = 'https://explorer-test-backend.nebulas.io/api'
export const mainApiUrl = 'https://explorer-backend.nebulas.io/api'

export const apiUrl = mainnet ? mainApiUrl : testApiUrl

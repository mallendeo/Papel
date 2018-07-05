// We can't destructure process.env like { contractDev, contractProd }
// see https://nuxtjs.org/api/configuration-env/#process-env-
const { contractDev } = process.env
const { contractProd } = process.env
const { testnetUrl } = process.env
const { mainnetUrl } = process.env

export const prod = process.env.NODE_ENV === 'production'
export const hostUrl = prod ? mainnetUrl : testnetUrl
export const contract = prod ? contractProd : contractDev

export const testApiUrl = 'https://explorer.nebulas.io/test/api'
export const mainApiUrl = 'https://explorer.nebulas.io/main/api'

export const apiUrl = prod ? mainApiUrl : testApiUrl

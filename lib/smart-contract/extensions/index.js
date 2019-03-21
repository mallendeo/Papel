import BigNumber from 'bignumber.js'
import ContractStorage from './storage'
import Contract from '../'

// Assign to Global
const LocalContractStorage = ContractStorage.lcs

Object.assign(window, {
  BigNumber,
  Contract,
  ContractStorage,
  LocalContractStorage,
  Blockchain: {
    transaction: {
      from: 'address_1',
      to: 'contract_address'
    }
  },
  Events: {}
})

import { callFunction } from './nebpay'

// Sheets / Projects
export const saveSheet = (slug, data) =>
  callFunction('saveSheet', [slug, data])

export const getSheet = slug =>
  callFunction('getSheet', [slug], { simulate: true })

// Users
export const getProfile = username =>
  callFunction('getUserFullProfile', [username], { simulate: true })

export const saveUser = user =>
  callFunction('saveUser', [user])

export const getUserSheets = (username, page = 1) =>
  callFunction(
    'getUserSheets',
    [username, page, { reverse: true }],
    { simulate: true }
  )

export const listSheets = (type = 'public', page = 1) =>
  callFunction(
    'listSheets',
    [type, page],
    { simulate: true }
  )

/* global Blockchain, BigNumber */

import { initStorage } from '../lib/helpers'
import { checkRoles } from '../lib/middleware'

import {
  AppError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError
} from '../lib/errors'

export default app => {
  const store = initStorage(app)({
    admin: null,
    softBanTimeout: null
  })

  const init = () => {
    store.admin = app.from
    store.softBanTimeout = 15000
  }

  const _checkRoles = checkRoles(app)

  const _updateUser = (username, opts) => {
    const userStore = app.users.store
    const userAddr = userStore.usernameMap.get(username)
    if (!userAddr) throw NotFoundError(`Couldn't find user ${username}`)

    const profile = userStore.users.get(userAddr)
    return userStore.users.put(userAddr, { ...profile, ...opts })
  }

  const setUserBan = (username, isBanned = true) => {
    _checkRoles('moderator')
    _updateUser(username, { isBanned })
  }

  const setUserRoles = (username, roles = []) => {
    _checkRoles('admin')
    _updateUser(username, { roles })
  }

  const setPick = (slug, remove) => {
    _checkRoles('moderator')
    const store = app.sheets.store
    const id = store.sheetSlugMap.get(slug)
    if (!id) throw NotFoundError()

    const pickId = store.sheetPicksIndexMap.get(id)
    const exists = pickId && store.sheetPicksMap.get(pickId)

    if (exists) {
      store.sheetPicksMap.del(pickId)
      store.sheetPicksIndexMap.del(id)
      store.sheetPicksSize -= 1
    }

    if (remove) return

    store.sheetPicksMap.put(store.sheetPicksSize, id)
    store.sheetPicksIndexMap.put(id, store.sheetPicksSize)
    store.sheetPicksSize += 1
  }

  const setSoftBanTimeout = (ms = 15000) => {
    _checkRoles('admin')

    if (typeof ms !== 'number') {
      throw BadRequestError(`param 'ms' must be a number`)
    }

    app.softBanTimeout = ms
  }

  const withdraw = balance => {
    const { from } = Blockchain.transaction
    if (store.admin !== from) {
      throw UnauthorizedError(`You're not the owner.`)
    }

    const result = Blockchain.transfer(from, new BigNumber(balance * 10 ** 18))

    if (!result) {
      throw AppError(null, 'Transfer failed.')
    }
  }

  return {
    init,
    store,
    withdraw,
    setUserBan,
    setUserRoles,
    setPick,
    setSoftBanTimeout
  }
}

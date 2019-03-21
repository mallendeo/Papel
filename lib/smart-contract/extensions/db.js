import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

export default low(new LocalStorage('db'))

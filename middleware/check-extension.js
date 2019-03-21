import { getAccount, checkExt } from '@/lib/nebulas'

export default async function({ redirect }) {
  if (!checkExt() || !localStorage.getItem('app_init'))
    return redirect('/getting-started')
  try {
    await getAccount(null, 5)
  } catch (err) {
    return redirect('/getting-started')
  }
}

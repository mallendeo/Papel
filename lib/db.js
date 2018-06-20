export const set = (key, val) => {
  const str = JSON.stringify(val)
  return localStorage.setItem(key, str)
}

export const get = key => {
  const str = localStorage.getItem(key)
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

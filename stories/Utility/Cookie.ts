export const cookieGet = (cookieName: string, cookieString = document.cookie) => {
  let name          = cookieName + "="
  let decodedCookie = decodeURIComponent(cookieString)
  let ca            = decodedCookie.split(';')


  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }

  return ""
}

export const cookieSet = (cookieName: string, value: string) => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  document.cookie = `${cookieName}=${value}; expires=${date.getUTCDate()}; path=/`
}
import cookie from 'js-cookie'
import _ from 'lodash'

const isBrowser = typeof window !== 'undefined'

export const setCookie = (key, value) => { // accessToken , refreshToken for the key, value should be token
  if (isBrowser) {
    cookie.set(key, value, {
      expires: 1,
      path: '/',
    })
  }
}

export const getCookie = (key, ctx) => {
  if (isBrowser) {
    return cookie.get(key)
  }

  // get cookie from server req obj.
  if (!ctx.req.headers.cookie) {
    return undefined
  }
  const rawCookie = ctx.req.headers.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${key}=`))
  if (!rawCookie) {
    return undefined
  }
  return rawCookie.split('=')[1]
}

export const hasSession = () => getCookie('jwt') !== undefined

export const removeSession = () => {
  cookie.remove('accessToken');
  cookie.remove('refreshToken');
}

export const removeAllCookies = () => (
  _.keys(cookie.get()).forEach((cookieName) => cookie.remove(cookieName))
)

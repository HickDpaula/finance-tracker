interface JwtPayload {
  sub: string
  email: string
  exp: number
}

export function decodeJwt(token: string): JwtPayload {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(''),
  )
  return JSON.parse(json) as JwtPayload
}

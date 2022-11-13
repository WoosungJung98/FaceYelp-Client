import { redirect } from "react-router-dom";

export const ctxRedirect = (url, ctx) => {
  if (typeof window === 'undefined') {
    ctx.res.writeHead(302, { Location: url })
    ctx.res.end()
  } else {
    redirect(url);
  }
  return {}
}

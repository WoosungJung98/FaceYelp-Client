import axios from 'axios'
import { ctxRedirect } from '../auth/authUtil'
import * as session from '../api/session'


export const tokenRefresh = async (ctx) => {
  const refreshToken = session.getCookie('refreshToken', ctx);

  return axios.post(`https://faceyelp.com/api/user/login/refresh`, {},
    { headers: { Authorization: `Bearer ${refreshToken}` } })
    .then((response) => {
      session.setCookie('accessToken', response.data.accessToken);
      return response.data.accessToken;
    })
    .catch((response) => ctxRedirect('/login', ctx))
}

export const callWithToken = async (method, url, data, ctx) => {
  const axiosObject = {
    method,
    url,
  }

  if (method === 'get') {
    axiosObject.params = data;
  } else {
    axiosObject.data = data;
  }

  const accessToken = session.getCookie('accessToken', ctx);
  axiosObject.headers = { Authorization: `Bearer ${accessToken}` }

  return axios(axiosObject)
    .catch(error => {
      if ([401, 422].includes(error.response.status)) {
        return tokenRefresh(ctx).then((newAccessToken) => {
          return axios({ ...axiosObject, headers: { Authorization: `Bearer ${newAccessToken}` } })
        })
      }
      return error.response;
    })
}

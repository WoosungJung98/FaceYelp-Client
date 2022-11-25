import axios from 'axios';
import * as session from '../api/session';
import { APIHOST } from '../../../config';


export const tokenRefresh = async (ctx) => {
  const axiosObject = {
    method: 'post',
    url: `${APIHOST}/api/user/login/refresh`,
  }
  const refreshToken = session.getCookie('refreshToken', ctx);
  axiosObject.headers = { Authorization: `Bearer ${refreshToken}` };

  return axios(axiosObject)
    .then((response) => {
      session.setCookie('accessToken', response.data.accessToken);
      return response.data.accessToken;
    })
    .catch((err) => alert(err));
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
        return tokenRefresh(ctx).then((newAccessToken) =>
          axios({ ...axiosObject, headers: { Authorization: `Bearer ${newAccessToken}` } })
        )
      }
      return error.response;
    })
}

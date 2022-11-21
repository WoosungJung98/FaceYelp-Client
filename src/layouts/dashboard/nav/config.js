// component
import axios from 'axios';
import { useRef } from 'react-router-dom';
import { callWithToken } from '../../../common/helpers/utils/common';
import SvgColor from '../../../components/svg-color';
import { APIHOST, HOSTNAME } from '../../../config';
import { getCookie } from '../../../common/helpers/api/session';


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${name}`} sx={{ width: 1, height: 1 }} />;

// {notifications.slice(0, 2).map((notification) => (
//   <NotificationItem key={notification.id} notification={notification} />
// ))}
const accessToken = getCookie();
let myResponse;
if (accessToken !== undefined){
  callWithToken('get', `${APIHOST}/api/user/info`, {})
  .then((response) => {
    myResponse = response.data.userName;
  })}

const navConfig = [
  {
    title: 'Christian Choi',
    path: '/christianchoi',
    icon: icon("http://cdn.onlinewebfonts.com/svg/img_183066.png"),
  },
  {
    title: 'Christian Choi',
    path: '/dashboard/app',
    icon: icon("http://cdn.onlinewebfonts.com/svg/img_183066.png"),
  },
  {
    title: 'Christian Choi',
    path: '/dashboard/app',
    icon: icon("http://cdn.onlinewebfonts.com/svg/img_183066.png"),
  },
  {
    title: 'Christian Choi',
    path: '/dashboard/app',
    icon: icon("http://cdn.onlinewebfonts.com/svg/img_183066.png"),
  },
  {
    title: 'Christian Choi',
    path: '/dashboard/app',
    icon: icon("http://cdn.onlinewebfonts.com/svg/img_183066.png"),
  },
  {
    title: 'Christian Choi',
    path: '/dashboard/app',
    icon: icon("http://cdn.onlinewebfonts.com/svg/img_183066.png"),
  },
  {
    title: 'Christian Choi',
    path: '/dashboard/app',
    icon: icon("http://cdn.onlinewebfonts.com/svg/img_183066.png"),
  },
  {
    title: 'Christian Choi',
    path: '/dashboard/app',
    icon: icon("http://cdn.onlinewebfonts.com/svg/img_183066.png"),
  },
  {
    title: 'William Jung',
    path: '/dashboard/user',
    icon: icon('https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png')
  },
  {
    title: 'jessica romero',
    path: '/dashboard/products',
    icon: icon('http://cdn.onlinewebfonts.com/svg/img_183066.png'),
  }

];

export default navConfig;

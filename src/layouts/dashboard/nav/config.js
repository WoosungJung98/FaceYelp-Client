// component
import SvgColor from '../../../components/svg-color';
import { getCookie } from '../../../common/helpers/api/session';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const getNavConfig = () => {
  const isAuthenticated = getCookie("refreshToken") !== undefined;
  const navConfigList = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: icon('ic_analytics'),
    }
  ];
  if(isAuthenticated) {
    navConfigList.push(
      {
        title: 'find friends',
        path: '/dashboard/user',
        icon: icon('ic_user'),
      },
      {
        title: 'Upcoming Meals',
        path: '/dashboard/upcoming-meals',
        icon: icon('ic_blog'),
      }
    );
  }
  else {
    navConfigList.push(
      {
        title: 'login',
        path: '/login',
        icon: icon('ic_lock'),
      },
      {
        title: 'create account',
        path: '/create-account',
        icon: icon('ic_create_account'),
      }
    );
  }
  return navConfigList;
}

export default getNavConfig;

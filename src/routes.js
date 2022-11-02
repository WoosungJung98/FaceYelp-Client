import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
const DashboardLayout = lazy(() => import('./layouts/dashboard'));
const SimpleLayout = lazy(() => import('./layouts/simple'));
// pages
const BlogPage = lazy(() => import('./pages/BlogPage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Page404 = lazy(() => import('./pages/Page404'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const DashboardAppPage = lazy(() => import('./pages/DashboardAppPage'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <Suspense fallback={<>...</>}>
          <DashboardLayout />
        </Suspense>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: (
          <Suspense fallback={<>...</>}>
            <DashboardAppPage />
          </Suspense>
        )},
        { path: 'user', element: (
          <Suspense fallback={<>...</>}>
            <UserPage />
          </Suspense>
        )},
        { path: 'products', element: (
          <Suspense fallback={<>...</>}>
            <ProductsPage />
          </Suspense>
        )},
        { path: 'blog', element: (
          <Suspense fallback={<>...</>}>
            <BlogPage />
          </Suspense>
        )},
      ],
    },
    {
      path: 'login',
      element: (
        <Suspense fallback={<>...</>}>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      element: (
        <Suspense fallback={<>...</>}>
          <SimpleLayout />
        </Suspense>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: (
          <Suspense fallback={<>...</>}>
            <Page404 />
          </Suspense>
        )},
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

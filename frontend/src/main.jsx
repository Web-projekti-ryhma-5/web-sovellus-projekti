import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import { SearchProvider } from './context/SearchContext.jsx';
import { GroupProvider } from './context/GroupContext';
import HomePage from './pages/HomePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import GroupList from './components/GroupList';
import GroupPage from './pages/GroupPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import Authentication, {AuthenticationMode} from './screens/Authentication.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx';
// import UserProvider from './context/UserProvider.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/groups',
        element: <GroupList />,
        children: [
          {
            path: 'groups/:id',
            element: <GroupPage />
          },
        ],
      },
    ],
  }
  // {
  //   path: '/signin',
  //   element: <Authentication authenticationMode={AuthenticationMode.Login}></Authentication>
  // },
  // {
  //   path: '/signup',
  //   element: <Authentication authenticationMode={AuthenticationMode.Register}></Authentication>
  // },
  // {
  //   element: <ProtectedRoute></ProtectedRoute>,
  //   children: [
  //     {
  //       path: '/',
  //       element: <Home></Home>
  //     }
  //   ]
  // }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>
      <GroupProvider>
        <RouterProvider router={router}></RouterProvider>
      </GroupProvider>
    </SearchProvider>
  </StrictMode>
);

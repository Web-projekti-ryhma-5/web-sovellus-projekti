import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import HomePage from './pages/HomePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
// import Authentication, {AuthenticationMode} from './screens/Authentication.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx';
// import UserProvider from './context/UserProvider.jsx';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/',
    element: <HomePage></HomePage>
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
    {/* <UserProvider> */}
      <RouterProvider router={router}></RouterProvider>
    {/* </UserProvider> */}
  </StrictMode>
);

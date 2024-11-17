import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import HomePage from './pages/HomePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import App from './App.jsx';
import { SearchProvider } from './context/SearchContext.jsx';
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
      <RouterProvider router={router}></RouterProvider>
    </SearchProvider>
  </StrictMode>
);

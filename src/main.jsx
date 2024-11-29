import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext.jsx';
import { GroupProvider } from './context/GroupContext';
import HomePage from './pages/HomePage.jsx';
import MoviePage from './pages/MoviePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import GroupList from './components/GroupList';
import GroupPage from './pages/GroupPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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
        path: '/movie',
        element: <MoviePage />
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
        <GroupProvider>
          <RouterProvider router={router}></RouterProvider>
        </GroupProvider>
      </SearchProvider>
    </AuthProvider>
  </StrictMode>
);

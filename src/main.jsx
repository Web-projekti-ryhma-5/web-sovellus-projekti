import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './context/Notification.css';

import App from './App.jsx';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext.jsx';
import { GroupProvider } from './context/GroupContext';

import ErrorPage from './pages/ErrorPage.jsx';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage.jsx';
import MoviePage from './pages/MoviePage.jsx';
import GroupList from './components/group/GroupList';
import GroupPage from './components/group/GroupPage';
import GroupForm from './components/group/GroupForm';
import IMDbPage from './pages/IMDbPage.jsx';

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
      },
      {
        path: '/imdb',
        element: <IMDbPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/groups/:groupId',
            element: <GroupPage />
          },
          {
            path: '/groups/new',
            element: <GroupForm />
          },
        ],
      },
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <SearchProvider>
          <GroupProvider>
            <RouterProvider router={router}></RouterProvider>
          </GroupProvider>
        </SearchProvider>
      </AuthProvider>
    </NotificationProvider>
  </StrictMode>
);

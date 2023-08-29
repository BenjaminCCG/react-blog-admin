import React from 'react';
import { useRoutes } from 'react-router-dom';
// import Home from '@/views/Home';
import About from '@/views/About';
import Layout from '@/layout';
import Tech from '@/views/Tech';
import Life from '@/views/Life';
import Login from '@/views/Login';
export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/tech" />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: 'tech',
          element: <Tech />
        },
        {
          path: 'life',
          element: <Life />
        },
        {
          path: '/about',
          element: <About />
        }
      ]
    }
  ]);
}

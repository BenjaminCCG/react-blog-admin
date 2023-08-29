import React from 'react';
import { useRoutes } from 'react-router-dom';
// import Home from '@/views/Home';
import About from '@/views/About';
import Layout from '@/layout';
import Tech from '@/views/Tech';
import Life from '@/views/Life';
export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/tech" />
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

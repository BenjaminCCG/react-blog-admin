import React from 'react';
import { useRoutes } from 'react-router-dom';
// import Home from '@/views/Home';
import About from '@/views/About';
import Layout from '@/layout';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Layout />
    },
    {
      path: '/about',
      element: <About />
    }
  ]);
}

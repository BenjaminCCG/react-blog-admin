/*
 * @Author: ChangCheng
 * @Date: 2023-08-24 20:03:06
 * @LastEditTime: 2023-08-24 20:19:02
 * @LastEditors: ChangCheng
 * @Description:
 * @FilePath: \react-blog-admin\src\components\Auth.tsx
 */
import React from 'react';

export default function Auth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');

  return <>{token ? children : <Navigate to="/login" replace />}</>;
}

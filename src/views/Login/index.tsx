/*
 * @Author: ChangCheng
 * @Date: 2023-08-23 21:22:58
 * @LastEditTime: 2023-08-23 21:31:44
 * @LastEditors: ChangCheng
 * @Description:
 * @FilePath: \react-blog-admin\src\views\Login\index.tsx
 */
import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

export default function Login() {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className=" w-1/3 flex justify-center items-center h-screen mx-auto">
      <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item name="用户名" rules={[{ required: true, message: 'Please input your Username!' }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="密码" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

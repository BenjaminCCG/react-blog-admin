import React from 'react';
import { Layout as Layouts } from 'antd';

const { Header, Sider, Content } = Layouts;
export default function Layout() {
  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea'
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9'
  };

  const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9'
  };

  return (
    <Layouts>
      <Sider style={siderStyle}>Sider</Sider>
      <Layouts>
        <Header style={headerStyle}>Header</Header>
        <Content style={contentStyle}>Content</Content>
      </Layouts>
    </Layouts>
  );
}

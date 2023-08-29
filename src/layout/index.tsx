import React from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';

const { Header, Sider, Content } = Layout;
export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const navigate = useNavigate();
  const menuClick = (e: { key: string }) => {
    navigate(e.key);
  };
  const { pathname } = useLocation();

  const { logout } = useUserStore();

  const outClick = () => {
    logout().then(() => {
      navigate('/login');
    });
  };

  return (
    <Layout className="h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          onClick={menuClick}
          items={[
            {
              key: '/tech',
              icon: <UserOutlined />,
              label: '技术文章'
            },
            {
              key: '/life',
              icon: <VideoCameraOutlined />,
              label: '生活杂谈'
            },
            {
              key: '/about',
              icon: <UploadOutlined />,
              label: '自我介绍'
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className="flex justify-between">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
            }}
          />
          <span className="mr-8 cursor-pointer" onClick={outClick}>
            退出
          </span>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflowY: 'auto',
            height: 'calc(100vh - 64px - 48px)'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

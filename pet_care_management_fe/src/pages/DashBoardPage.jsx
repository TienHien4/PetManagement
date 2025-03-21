import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import { Button, Layout, Menu, theme, Row, Col, Avatar } from 'antd';
  const { Header, Sider, Content } = Layout;
const DashBoardPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    return (
        <Layout>
          <Sider collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <UserOutlined />,
                  label: 'Accounts',
                },
                {
                  key: '2',
                  icon: <VideoCameraOutlined />,
                  label: 'nav 2',
                },
                {
                  key: '3',
                  icon: <UploadOutlined />,
                  label: 'nav 3',
                },
              ]}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            >
    
            <Row>
                <Col md={2}>
                <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
                </Col>
                <Col md={18}>
                 
                </Col>
                <Col md={4}>
                    <a href='/logout' style={{cursor: 'pointer'}}>
                        <Avatar style={{marginRight: 10}} size='default' icon={<UserOutlined/>} ></Avatar>
                          {localStorage.getItem("UserName").toUpperCase()}
                    </a>
                </Col>
            </Row>
              
            </Header>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
            borderRadius: borderRadiusLG,
            
              }}
            >
          
            </Content>
          </Layout>
        </Layout>
      );
};

export default DashBoardPage;
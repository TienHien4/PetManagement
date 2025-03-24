import React, { useState } from "react";
import axios from "axios";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import { Button, Layout, Menu, theme, Row, Col, Avatar } from 'antd';
import { useNavigate } from "react-router-dom";
import User from "../components/User";
  const { Header, Sider, Content } = Layout;
const DashBoardPage = () => {
  const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();

      const handleLogout = async () => {
        try {
  
            let token = localStorage.getItem("accessToken");
    
            if (!token) {
                console.error("Error: accessToken is null or undefined before logout.");
                return;
            }
    
            console.log("Logging out with accessToken:", token);
    
            // Gửi yêu cầu logout đến backend
            const response = await axios.post("http://localhost:8080/api/logout", 
                { token: token }, 
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json" 
                    }
                }
            );
    
            console.log("Logout response:", response.data);
    
            // Xóa token khỏi localStorage sau khi logout thành công
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("UserName");
    
            // Điều hướng về trang đăng nhập
            navigate("/login");
    
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
        }
    };

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
                    <button onClick={handleLogout} style={{cursor: 'pointer'}}>
                        <Avatar style={{marginRight: 10}} size='default' icon={<UserOutlined/>} ></Avatar>
                          {localStorage.getItem("UserName").toUpperCase()}
                    </button>
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
            <User/>
          
            </Content>
          </Layout>
        </Layout>
      );
};

export default DashBoardPage;
import React, { useEffect, useState } from 'react';

import DashboardContent from '../components/DashboardContent';
import axios from "axios";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Row, Col, Avatar } from 'antd';
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

function DashboardPage() {
  useEffect(() => {
    // Initialize scripts that would normally run on page load
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
      });
    }
  }, []);

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
 
       localStorage.removeItem("accessToken");
       localStorage.removeItem("refreshToken");
       localStorage.removeItem("UserName");
 
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
               icon: <AreaChartOutlined />,
               label: 'Thống kê',
             },
             {
               key: '2',
               icon: '🐾',
               label: <a href="/admin/petmanagement" style={{ textDecoration: "none", color: "inherit" }}>Thú cưng</a>,
             },
             {
               key: '3',
               icon: <UserOutlined />,
               label: <a href="/admin/usermanagement" style={{ textDecoration: "none", color: "inherit" }}>Tài khoản</a>,
             },
           ]}
         />
       </Sider>
       <Layout>
         <Header style={{ padding: 0, background: colorBgContainer }}>
           <Row>
             <Col md={2}>
               <Button
                 type="text"
                 icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                 onClick={() => setCollapsed(!collapsed)}
                 style={{ fontSize: '16px', width: 64, height: 64 }}
               />
             </Col>
             <Col md={18}></Col>
             <Col md={4}>
               <button onClick={handleLogout} style={{ backgroundColor: 'white', cursor: 'pointer', display: "flex", alignItems: "center", border: "none", background: "none" }}>
                 <Avatar style={{ marginRight: 10 }} size='default' icon={<UserOutlined />} />
                 <h4 style={{color: "black", marginTop: "3px"}}>{localStorage.getItem("UserName") ? localStorage.getItem("UserName").toUpperCase() : "Guest"}</h4>
               </button>
             </Col>
           </Row>
         </Header>
         <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
           <DashboardContent></DashboardContent>
         </Content>
       </Layout>
     </Layout>
   );
}

export default DashboardPage;
import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, NavDropdown, Card } from 'react-bootstrap';
import { FaHome, FaCalendarAlt, FaChartBar, FaUser, FaSignOutAlt, FaBars, FaPaw } from 'react-icons/fa';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './VetLayout.css';

const VetLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        switch (path) {
            case '/vet/dashboard':
                return 'Dashboard';
            case '/vet/appointments':
                return 'Quản lý cuộc hẹn';
            case '/vet/profile':
                return 'Thông tin cá nhân';
            default:
                return 'VET Dashboard';
        }
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="vet-layout">
            {/* Top Navigation */}
            <Navbar bg="white" expand="lg" className="top-navbar shadow-sm">
                <Container fluid>
                    <div className="d-flex align-items-center">
                        <Button
                            variant="link"
                            className="sidebar-toggle me-3"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            <FaBars />
                        </Button>
                        <Navbar.Brand className="brand-title">
                            <FaPaw className="me-2 text-primary" />
                            PetCare VET
                        </Navbar.Brand>
                    </div>

                    <Nav className="ms-auto">
                        <NavDropdown
                            title={
                                <span>
                                    <FaUser className="me-1" />
                                    Bác sĩ
                                </span>
                            }
                            id="user-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item as={Link} to="/vet/profile">
                                <FaUser className="me-2" />
                                Thông tin cá nhân
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>
                                <FaSignOutAlt className="me-2" />
                                Đăng xuất
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>

            <div className="layout-content">
                {/* Sidebar */}
                <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-content">
                        <Nav className="flex-column sidebar-nav">
                            <Nav.Link
                                as={Link}
                                to="/vet/dashboard"
                                className={`sidebar-link ${isActiveRoute('/vet/dashboard') ? 'active' : ''}`}
                            >
                                <FaHome className="sidebar-icon" />
                                <span className="sidebar-text">Dashboard</span>
                            </Nav.Link>

                            <Nav.Link
                                as={Link}
                                to="/vet/appointments"
                                className={`sidebar-link ${isActiveRoute('/vet/appointments') ? 'active' : ''}`}
                            >
                                <FaCalendarAlt className="sidebar-icon" />
                                <span className="sidebar-text">Cuộc hẹn</span>
                            </Nav.Link>


                        </Nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="content-header">
                        <h4 className="page-title">{getPageTitle()}</h4>
                        <div className="breadcrumb">
                            <span className="text-muted">VET / {getPageTitle()}</span>
                        </div>
                    </div>

                    <div className="content-body">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Fix Button import
const Button = ({ variant, className, onClick, children }) => {
    return (
        <button
            className={`btn ${variant === 'link' ? 'btn-link' : ''} ${className || ''}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default VetLayout;

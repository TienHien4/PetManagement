import React, { useEffect, useState } from 'react';
import { getToken } from '../services/localStorageService';
import apiClient from '../services/customizeAxios';
import { Link, useNavigate } from 'react-router-dom';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './Employee.css';
import { Pagination } from 'antd';

const User  = () => {
    const [user, setUsers] = useState([]); // Danh sách nhân viên
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [pageSize] = useState(5); // Số lượng mỗi trang
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate("/login");
        } else {
            getUser(accessToken, currentPage, pageSize); // Lấy danh sách nhân viên
        }
    }, [navigate, currentPage, pageSize]); // Gọi lại khi currentPage thay đổi

    const getUser = async (accessToken, pageNo, pageSize) => {
        try {
            const res = await apiClient.get("/api/user/getAll", {
                params: { pageNo, pageSize },
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res && res.data) {
                setUsers(res.data.content); // Lấy danh sách nhân viên từ `content`
                setTotalPages(res.data.totalPages); // Cập nhật tổng số trang
                console.log(res.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật trang hiện tại
    };

    return (
        <div>
            <Link to="/register">
                <UserAddOutlined /> Thêm nhân viên
            </Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>

                    </tr>
                </thead>
                <tbody>
                    {user.map((item, index) => (
                        <tr key={index}>
                            <td>{item.userName}</td>
                
                            <td>{item.email}</td>
                            <td>{item.password}</td>
                            <td style={{ width: 10 }}>
                        
                            </td>
                            <td>
                                <Link to="/delete">
                                    <DeleteOutlined />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Sử dụng Pagination của Ant Design */}
            <Pagination
                current={currentPage} // Trang hiện tại
                pageSize={pageSize} // Số lượng mỗi trang
                total={totalPages * pageSize} // Tổng số item
                onChange={handlePageChange} // Hàm thay đổi trang
            />
        </div>
    );
};

export default User;
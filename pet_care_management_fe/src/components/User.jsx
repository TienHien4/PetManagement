import React, { useEffect, useState } from 'react';
import { getToken } from '../services/localStorageService';
import axios from '../services/customizeAxios';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import '../assets/css/user.css';
import { Pagination } from 'antd';

const User = () => {
    const [user, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);
    const [search, setSearch] = useState("")
    const navigate = useNavigate();


    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate("/login");
        } else {
            getUser(accessToken, currentPage, pageSize);
        }
    }, [navigate, currentPage, pageSize]);

    const getUser = async (accessToken, pageNo, pageSize) => {
        try {
            const res = await axios.get("/api/user/getAll", {
                params: { pageNo, pageSize },
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res && res.data) {
                setUsers(res.data.content);
                setTotalPages(res.data.totalPages);
                console.log(res.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFindUser = async (search) => {
        try {
            const accessToken = localStorage.getItem("accessToken")
            const res = await axios.get(`/api/user/getUsers/${search}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            console.log(res.data)
            setUsers(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div>
            <h1 className="text-2xl font-bold" style={{ marginTop: "30px", marginBottom: "40px" }}>Quản Lý Tài Khoản</h1>
            <div className="flex gap-2 mb-4" style={{ marginTop: "30px" }}>
                <input style={{ width: "865px" }}
                    type="text"
                    placeholder="🔍 Tìm kiếm tài khoản..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => handleFindUser(search)}
                >
                    <h6 style={{ color: "black", margin: 0 }}>Tìm</h6>
                </button>



            </div>



            <table className="table" style={{ marginTop: "60px" }}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {user.map((item, index) => (
                        <tr key={index}>
                            <td>{item.userName}</td>
                            <td>{item.email}</td>
                            <td>
                                {item.roles && item.roles.length > 0
                                    ? item.roles.map((role, i) => (
                                        <span key={i}>
                                            {role.name}{i < item.roles.length - 1 ? ', ' : ''}
                                        </span>
                                    ))
                                    : 'Không có vai trò'}
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

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalPages * pageSize}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default User;

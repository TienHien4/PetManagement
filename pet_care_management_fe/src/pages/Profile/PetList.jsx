import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from '../../services/customizeAxios';
import "../../assets/css/profile.css";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import { Pagination } from 'antd';

function PetList() {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);
    const accessToken = localStorage.getItem("accessToken")
    useEffect(() => {
        const fetchData = async (accessToken, pageNo, pageSize) => {
            const res = await axios.get("api/pet/getPets",
                {
                    params: { pageNo, pageSize },
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            )
            console.log(res.data)
            setData(res.data.content)
            setTotalPages(res.data.totalPages)
        }
        fetchData(accessToken, currentPage, pageSize)
    }, [accessToken])

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="profile">
            <Header></Header>
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div className="main-content">
                    <div className="pet-list">
                        <h1>Danh Sách Thú Cưng</h1>
                        <p className="subtitle">Danh sách các thú cưng bạn đang sở hữu</p>

                        <table className="pet-table">
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Loài</th>
                                    <th>Giống</th>
                                    <th>Tuổi</th>
                                    <th>Cân nặng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.species}</td>
                                        <td>{item.breed}</td>
                                        <td>{item.age}</td>
                                        <td>{item.weight}</td>

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
                </div>

            </div>
            <Footer></Footer>
        </div>
    );
}

export default PetList;

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/profile.css";
import Header from "../../components/home/Header";
import axios from '../../services/customizeAxios';
import Footer from "../../components/home/Footer";
import { Pagination } from 'antd';

function Schedule() {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);
    const accessToken = localStorage.getItem("accessToken")
    useEffect(() => {
        try {
            const fetchData = async (accessToken, pageNo, pageSize) => {
                const res = await axios.get("api/appointment/getAppointments",
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
        } catch (error) {
            console.log(error)
        }
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
                    <div className="schedule">
                        <h1>Lịch Khám Thú Cưng</h1>
                        <p className="subtitle">Quản lý lịch khám cho các thú cưng của bạn</p>

                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th>Ngày khám</th>
                                    <th>Mã bác sĩ</th>
                                    <th>Dịch vụ</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>{new Date(item.date).toLocaleDateString("vi-VN")}</td>
                                        <td>{item.vetId}</td>
                                        <td>
                                            {item.services.map((service, index) => (
                                                <div key={index}>
                                                    {service.name} - {service.price.toLocaleString()} VND
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {item.services.reduce((total, service) => total + service.price, 0).toLocaleString()} VND
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
                </div>

            </div>
            <Footer></Footer>
        </div>
    );
}

export default Schedule;

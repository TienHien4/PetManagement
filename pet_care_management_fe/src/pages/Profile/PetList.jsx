import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from '../../services/customizeAxios';
import "../../assets/css/profile.css";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import { Pagination } from 'antd';

function PetList() {
    const userId = localStorage.getItem("Id")
    const [data, setData] = useState([])
    const accessToken = localStorage.getItem("accessToken")
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`api/pet/getPetsByUser/${userId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            )
            console.log(res.data)
            setData(res.data)
        }
        fetchData()
    }, [])

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

                    </div>
                </div>

            </div>
            <Footer></Footer>
        </div>
    );
}

export default PetList;

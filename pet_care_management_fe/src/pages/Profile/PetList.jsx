import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Edit, Trash2 } from "lucide-react";
import axios from '../../services/customizeAxios';
import "../../assets/css/profile.css";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import { Pagination } from 'antd';
import { useNavigate } from "react-router-dom";

function PetList() {
    const userId = localStorage.getItem("Id")
    const [pets, setPets] = useState([])
    const navigate = useNavigate()
    const accessToken = localStorage.getItem("accessToken")
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`api/pet/getPetsByUser/${userId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            )
            console.log(res.data)
            setPets(res.data)
        }
        fetchData()
    }, [])
    const handleDelete = async (id) => {
        const accessToken = localStorage.getItem("accessToken"); // Lấy token trong hàm

        try {
            await axios.post(`/api/pet/delete/${id}`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            setPets(pets.filter((pet) => pet.id !== id));
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };
    const handleAddPet = () => {
        navigate("/")
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
                        <div className="flex justify-end mb-4">
                            <button
                                className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                                onClick={() => handleAddPet()}
                            >
                                Thêm Thú Cưng
                            </button>
                        </div>


                        <table className="pet-table">
                            <thead>
                                <tr>
                                    <th className="p-2">Ảnh</th>
                                    <th className="p-2">Tên</th>
                                    <th className="p-2">Loài</th>
                                    <th className="p-2">Giống</th>
                                    <th className="p-2">Tuổi</th>
                                    <th className="p-2">Chủ sở hữu</th>
                                    <th className="p-2">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pets.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-2">
                                            <img
                                                src={item.imageUrl || 'https://via.placeholder.com/70'}
                                                alt={item.name}
                                                style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                                            />
                                        </td>
                                        <td className="p-2">{item.name}</td>
                                        <td className="p-2">{item.species}</td>
                                        <td className="p-2">{item.breed}</td>
                                        <td className="p-2">{item.age}</td>
                                        <td className="p-2">{item.ownerId}</td>
                                        <td className="p-2 flex gap-2">
                                            <button
                                                className="bg-yellow-500 text-black px-2 py-1 rounded-lg hover:bg-yellow-600"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="bg-red-500 text-black px-2 py-1 rounded-lg hover:bg-red-600"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
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

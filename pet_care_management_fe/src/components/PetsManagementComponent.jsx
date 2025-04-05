import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import axios from "../services/customizeAxios";
import { Pagination } from 'antd';
import { useNavigate } from "react-router-dom";

const PetsManagement = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);
  // const [editPet, setEditPet] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
    } else {
      getPets(accessToken, currentPage, pageSize);
    }
  }, [navigate, currentPage, pageSize]);

  const getPets = async (accessToken, pageNo, pageSize) => {
    try {
      const res = await axios.get("/api/pet/getPets", {
        params: { pageNo, pageSize },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res && res.data) {
        setPets(res.data.content);
        setTotalPages(res.data.totalPages);
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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

  const handleFindPetByKeyword = async (search) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!search) {
      const res = await axios.get("/api/pet/getAllPet", {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setPets(res.data)
    } else {

      try {
        const res = await axios.get(`/api/pet/getPets/${search}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setPets(res.data)

      } catch (error) {
        console.error("Pet not found!", error);
      }
    }
  };



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🐾 Quản lý Thú Cưng</h1>
        <a
          href="/admin/addPet"
          style={{
            border: "1px solid black",
            borderRadius: "4px",
            padding: "8px 16px",
            backgroundColor: "white",
            color: "black",
            textDecoration: "none",
            display: "inline-block",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            ':hover': {
              backgroundColor: "#f8f9fa",
              color: "black"
            }
          }}
        >
          <h5 style={{ margin: 0 }}>Thêm thú cưng</h5>
        </a>
      </div>

      <div className="flex gap-2 mb-4" >
        <input style={{ width: "865px" }}
          type="text"
          placeholder="🔍 Tìm kiếm thú cưng theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => handleFindPetByKeyword(search)}
        >
          <h6 style={{ color: "black", margin: 0 }}>Tìm</h6>
        </button>

        <select
          className="border border-gray-300 rounded-lg p-2"
          onChange={(e) => handleFindPetByKeyword(e.target.value)}
        >
          <option value="">Tất cả loài</option>
          <option value="Dog">Chó</option>
          <option value="Cat">Mèo</option>
        </select>

      </div>


      <table style={{ width: "1315px" }}>
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Tên</th>
            <th className="p-2">Loài</th>
            <th className="p-2">Giống</th>
            <th className="p-2">Tuổi</th>
            <th className="p-2">Chủ sở hữu</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id} className="border-t">
              <td className="p-2">{pet.name}</td>
              <td className="p-2">{pet.species}</td>
              <td className="p-2">{pet.breed}</td>
              <td className="p-2">{pet.age}</td>
              <td className="p-2">{pet.ownerId}</td>
              <td className="p-2 flex gap-2">
                <button style={{ color: "black" }}
                  className="bg-yellow-500 text-black px-2 py-1 rounded-lg hover:bg-yellow-600"

                >
                  <Edit size={16} />

                </button>
                <button style={{ color: "black" }}
                  className="bg-red-500 text-black px-2 py-1 rounded-lg hover:bg-red-600"
                  onClick={() => handleDelete(pet.id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalPages * pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default PetsManagement;
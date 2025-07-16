"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2 } from "lucide-react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const PetsManagement = () => {
  const [pets, setPets] = useState([])
  const [petSearch, setPetSearch] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize] = useState(5)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      window.location.href = "/login"
    } else {
      getPets(accessToken, currentPage, pageSize)
    }
  }, [currentPage, pageSize])

  const getPets = async (accessToken, pageNo, pageSize) => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:8080/api/pet/getPets", {
        params: { pageNo, pageSize },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (res && res.data) {
        setPetSearch([])
        setPets(res.data.content)
        setTotalPages(res.data.totalPages)
        console.log(res.data)
      }
    } catch (error) {
      console.error("Error fetching pet data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thú cưng này?")) {
      return
    }

    const accessToken = localStorage.getItem("accessToken")
    try {
      await axios.post(
        `http://localhost:8080/api/pet/delete/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      setPets(pets.filter((pet) => pet.id !== id))
      alert("Xóa thú cưng thành công!")
    } catch (error) {
      console.error("Error deleting pet:", error)
      alert("Có lỗi xảy ra khi xóa thú cưng!")
    }
  }

  const handleFindPetByKeyword = async (searchTerm) => {
    const accessToken = localStorage.getItem("accessToken")
    setLoading(true)

    if (!searchTerm) {
      try {
        const res = await axios.get("http://localhost:8080/api/pet/getAllPet", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setPetSearch(res.data)
        setPets([])
      } catch (error) {
        console.error("Error fetching all pets:", error)
      }
    } else {
      try {
        const res = await axios.get(`http://localhost:8080/api/pet/getPets/${searchTerm}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setPets([])
        setPetSearch(res.data)
      } catch (error) {
        console.error("Pet not found!", error)
        setPetSearch([])
      }
    }
    setLoading(false)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleAddPet = () => {
    window.location.href = "/admin/addPet"
  }

  const handleEditPet = (petId) => {
    window.location.href = `/admin/editPet/${petId}`
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className="btn btn-outline-primary me-1"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="bi bi-chevron-left"></i>
      </button>,
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn me-1 ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        className="btn btn-outline-primary"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="bi bi-chevron-right"></i>
      </button>,
    )

    return <div className="d-flex justify-content-center align-items-center">{pages}</div>
  }

  const displayData = Array.isArray(petSearch) && petSearch.length > 0 ? petSearch : pets

  return (
    <>
      <style jsx>{`
        .pets-management {
          padding: 0;
        }

        .search-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .search-input {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
          outline: none;
        }

        .search-select {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 1rem;
          background: white;
          transition: all 0.3s ease;
        }

        .search-select:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
          outline: none;
        }

        .btn-search {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .btn-search:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
          color: white;
        }

        .btn-add {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          text-decoration: none;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
          color: white;
          text-decoration: none;
        }

        .pets-table-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 24px;
        }

        .pets-table {
          margin: 0;
          font-size: 0.95rem;
        }

        .pets-table thead th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          padding: 16px 12px;
          border: none;
          text-align: center;
          vertical-align: middle;
        }

        .pets-table tbody td {
          padding: 16px 12px;
          vertical-align: middle;
          text-align: center;
          border-bottom: 1px solid #f1f3f4;
        }

        .pets-table tbody tr:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .pet-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .pet-image:hover {
          transform: scale(1.1);
        }

        .action-btn {
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          margin: 0 4px;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .btn-edit {
          background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
          color: white;
        }

        .btn-delete {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
        }

        .btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
          color: white;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4facfe;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 24px;
        }

        @media (max-width: 768px) {
          .search-section {
            padding: 16px;
          }
          
          .pets-table-container {
            overflow-x: auto;
          }
          
          .pets-table {
            min-width: 800px;
          }
          
          .search-controls {
            flex-direction: column;
            gap: 12px;
          }
          
          .search-controls > * {
            width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="pets-management">
        {/* Search Section */}
        <div className="search-section">
          <div className="d-flex search-controls" style={{ gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm thú cưng theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              style={{ flex: 1, minWidth: "250px" }}
            />
            <button className="btn-search" onClick={() => handleFindPetByKeyword(search)} disabled={loading}>
              <i className="bi bi-search me-2"></i>
              Tìm kiếm
            </button>
            <select
              className="search-select"
              style={{ width: "160px" }}
              onChange={(e) => handleFindPetByKeyword(e.target.value)}
              disabled={loading}
            >
              <option value="">Tất cả loài</option>
              <option value="Dog">🐕 Chó</option>
              <option value="Cat">🐱 Mèo</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="pets-table-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : displayData && displayData.length > 0 ? (
            <table className="table pets-table">
              <thead>
                <tr>
                  <th style={{ width: "12%" }}>Ảnh</th>
                  <th style={{ width: "20%" }}>Tên</th>
                  <th style={{ width: "15%" }}>Loài</th>
                  <th style={{ width: "15%" }}>Giống</th>
                  <th style={{ width: "10%" }}>Tuổi</th>
                  <th style={{ width: "18%" }}>Chủ sở hữu</th>
                  <th style={{ width: "10%" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((pet) => (
                  <tr key={pet.id}>
                    <td>
                      <img
                        src={pet.imageUrl || "/placeholder.svg?height=60&width=60"}
                        alt={pet.name}
                        className="pet-image"
                      />
                    </td>
                    <td>
                      <strong>{pet.name}</strong>
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {pet.species === "Dog" ? "🐕 Chó" : pet.species === "Cat" ? "🐱 Mèo" : pet.species}
                      </span>
                    </td>
                    <td>{pet.breed}</td>
                    <td>
                      <span className="badge bg-secondary">{pet.age} tuổi</span>
                    </td>
                    <td>ID: {pet.ownerId}</td>
                    <td>
                      <button className="action-btn btn-edit" onClick={() => handleEditPet(pet.id)} title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(pet.id)} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🐾</div>
              <h5>Không tìm thấy thú cưng nào</h5>
              <p>Hãy thử tìm kiếm với từ khóa khác hoặc thêm thú cưng mới</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {Array.isArray(pets) && pets.length > 0 && (!Array.isArray(petSearch) || petSearch.length === 0) && (
          <div className="pagination-container">{renderPagination()}</div>
        )}
      </div>
    </>
  )
}

export default PetsManagement

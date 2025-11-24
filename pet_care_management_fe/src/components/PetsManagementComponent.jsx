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

  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    dob: '',
    gender: '',
    weight: '',
    age: '',
    userId: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

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

  const handleEditPet = (pet) => {
    setEditingPet(pet)
    setFormData({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      dob: pet.dob || '',
      gender: pet.gender || '',
      weight: pet.weight || '',
      age: pet.age || '',
      userId: pet.userId || ''
    })
    setImagePreview(pet.image || null)
    setShowEditModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!')
        return
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF!')
        return
      }

      setImageFile(file)

      // Preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thú cưng!')
      return
    }

    if (!formData.species) {
      alert('Vui lòng chọn loại thú cưng!')
      return
    }

    try {
      const accessToken = localStorage.getItem('accessToken')

      const petRequest = {
        name: formData.name.trim(),
        userId: formData.userId ? parseInt(formData.userId) : null,
        species: formData.species,
        breed: formData.breed.trim() || null,
        dob: formData.dob || null,
        gender: formData.gender || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        age: formData.age ? parseInt(formData.age) : 0,
      }

      const formDataToSend = new FormData()
      formDataToSend.append('petRequest', JSON.stringify(petRequest))

      if (imageFile) {
        formDataToSend.append('imageFile', imageFile)
      }

      const response = await axios.post(
        `http://localhost:8080/api/pet/update/${editingPet.id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log('Update response:', response.data)
      alert('Cập nhật thú cưng thành công!')

      // Refresh list
      getPets(accessToken, currentPage, pageSize)
      handleCloseModal()
    } catch (error) {
      console.error('Error updating pet:', error)
      alert('Có lỗi xảy ra khi cập nhật thú cưng!')
    }
  }

  const handleCloseModal = () => {
    setShowEditModal(false)
    setEditingPet(null)
    setFormData({
      name: '',
      species: '',
      breed: '',
      dob: '',
      gender: '',
      weight: '',
      age: '',
      userId: ''
    })
    setImageFile(null)
    setImagePreview(null)
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

        .modal-content {
          border-radius: 24px;
          border: none;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 24px 24px 0 0;
          padding: 24px;
        }

        .modal-title {
          font-weight: 700;
          font-size: 1.5rem;
        }

        .btn-close {
          filter: brightness(0) invert(1);
        }

        .form-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .form-control, .form-select {
          border-radius: 12px;
          border: 2px solid #e0e0e0;
          padding: 12px 16px;
          transition: all 0.3s ease;
        }

        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .image-preview-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 16px auto;
          border-radius: 16px;
          overflow: hidden;
          border: 3px dashed #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
        }

        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image-placeholder {
          color: #999;
          text-align: center;
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
              placeholder="Tìm kiếm thú cưng theo tên..."
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
                        src={pet.image || "/placeholder.svg?height=60&width=60"}
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
                    <td>ID: {pet.userId}</td>
                    <td>
                      <button className="action-btn btn-edit" onClick={() => handleEditPet(pet)} title="Chỉnh sửa">
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

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050, overflowY: 'auto', padding: '20px 0' }}>
            <div className="modal-dialog modal-lg" style={{ margin: '0 auto', maxWidth: '800px' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil-square me-2"></i>
                    Chỉnh sửa thông tin thú cưng
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    {/* Image Preview */}
                    <div className="col-12">
                      <div className="image-preview-container">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="image-preview" />
                        ) : (
                          <div className="no-image-placeholder">
                            <i className="bi bi-image" style={{ fontSize: '48px' }}></i>
                            <p>Chưa có ảnh</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>

                    {/* Name */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Tên thú cưng <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Species */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Loại <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="species"
                        value={formData.species}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn loại</option>
                        <option value="Dog">Chó</option>
                        <option value="Cat">Mèo</option>
                        <option value="Bird">Chim</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>

                    {/* Breed */}
                    <div className="col-md-6">
                      <label className="form-label">Giống</label>
                      <input
                        type="text"
                        className="form-control"
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Gender */}
                    <div className="col-md-6">
                      <label className="form-label">Giới tính</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Male">Đực</option>
                        <option value="Female">Cái</option>
                      </select>
                    </div>

                    {/* DOB */}
                    <div className="col-md-4">
                      <label className="form-label">Ngày sinh</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Age */}
                    <div className="col-md-4">
                      <label className="form-label">Tuổi</label>
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>

                    {/* Weight */}
                    <div className="col-md-4">
                      <label className="form-label">Cân nặng (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                      />
                    </div>

                    {/* User ID */}
                    <div className="col-12">
                      <label className="form-label">ID Chủ nuôi</label>
                      <input
                        type="number"
                        className="form-control"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdate}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default PetsManagement

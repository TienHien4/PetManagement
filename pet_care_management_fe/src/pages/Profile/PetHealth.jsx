
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const PetHealth = () => {
    const { petId } = useParams()
    const [pet, setPet] = useState(null)
    const [healthRecords, setHealthRecords] = useState([])
    const [vaccinations, setVaccinations] = useState([])
    const [weightRecords, setWeightRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('records')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            window.location.href = "/login"
            return
        }

        fetchPetHealthData(accessToken)
    }, [petId])

    const fetchPetHealthData = async (accessToken) => {
        setLoading(true)
        try {
            // Fetch pet info
            const petRes = await axios.get(`http://localhost:8080/api/pet/${petId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            console.log("Pet data:", petRes.data)
            setPet(petRes.data)
            // Fetch health records
            const petHealthRes = await axios.get(`http://localhost:8080/api/medical-records/pet/${petId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            console.log("Health records:", petHealthRes.data)
            setHealthRecords(petHealthRes.data)
            // Fetch vaccinations
            const petVac = await axios.get(`http://localhost:8080/api/vaccinations/pet/${petId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            console.log("Vaccination::", petVac.data)
            setVaccinations(petVac.data)

            // Fetch weight records
            const petWeight = await axios.get(`http://localhost:8080/api/weight-records/pet/${petId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            console.log("Weight records:", petWeight.data)
            setWeightRecords(petWeight.data)

        } catch (error) {
            console.error("Error fetching pet health data:", error)
            alert("Không thể tải dữ liệu sức khỏe thú cưng!")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteRecord = async (recordId) => {
        if (!window.confirm('Đồng ý xóa hồ sơ bệnh án này?')) {
            return
        }

        const accessToken = localStorage.getItem("accessToken")
        try {
            await axios.delete(`http://localhost:8080/api/medical-records/${recordId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            alert('Xóa hồ sơ bệnh án thành công!')
            // Refresh data
            fetchPetHealthData(accessToken)
        } catch (error) {
            console.error("Error deleting record:", error)
            alert('Không thể xóa hồ sơ bệnh án!')
        }
    }

    const handleViewDetail = (record) => {
        setSelectedRecord(record)
        setShowDetailModal(true)
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { label: "Hoàn thành", className: "badge bg-success" },
            due_soon: { label: "Sắp đến hạn", className: "badge bg-warning text-dark" },
            overdue: { label: "Quá hạn", className: "badge bg-danger" },
            active: { label: "Đang dùng", className: "badge bg-primary" }
        }
        const config = statusConfig[status] || statusConfig.completed
        return <span className={config.className}>{config.label}</span>
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'records':
                return (
                    <div className="health-records">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4>Hồ sơ khám bệnh</h4>
                            <button
                                className="btn btn-primary"
                                onClick={() => window.location.href = `/pet/health/${petId}/add`}
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    border: 'none',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    padding: '10px 20px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Thêm hồ sơ
                            </button>
                        </div>

                        {healthRecords.map(record => (
                            <div key={record.id} className="record-card mb-3">
                                <div className="record-header">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">
                                            <i className="bi bi-clipboard-pulse me-2"></i>
                                            {new Date(record.recordDate).toLocaleDateString('vi-VN')}
                                        </h5>
                                        <div className="d-flex gap-2">
                                            <span className="badge" style={{
                                                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontWeight: '600'
                                            }}>
                                                Khám bệnh
                                            </span>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleViewDetail(record)}
                                                title="Xem chi tiết"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteRecord(record.id)}
                                                title="Xóa hồ sơ"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="record-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Bác sĩ:</strong> {record.veterinarian || 'Chưa có thông tin'}</p>
                                            <p><strong>Phòng khám:</strong> {record.clinic || 'Chưa có thông tin'}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Triệu chứng:</strong> {record.symptoms || 'Chưa có thông tin'}</p>
                                            <p><strong>Ngày tạo:</strong> {new Date(record.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
                                </div>
                            </div>
                        ))}

                        {healthRecords.length === 0 && (
                            <div className="text-center py-5">
                                <i className="bi bi-clipboard-data text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="text-muted mt-3">Chưa có hồ sơ khám bệnh nào</p>
                                <p className="text-muted small"><i className="bi bi-info-circle"></i> Hồ sơ khám bệnh được tạo bởi bác sĩ thú y sau khi khám</p>
                            </div>
                        )}
                    </div>
                )

            case 'vaccinations':
                return (
                    <div className="vaccinations">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4>Lịch sử tiêm chủng</h4>
                            <div className="alert alert-info mb-0 py-2 px-3" style={{ fontSize: '0.85rem' }}>
                                <i className="bi bi-info-circle me-2"></i>
                                Lịch sử tiêm chủng được cập nhật bởi bác sĩ thú y
                            </div>
                        </div>

                        {vaccinations.map(vaccine => (
                            <div key={vaccine.id} className="vaccine-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">
                                            <i className="bi bi-shield-check me-2"></i>
                                            {vaccine.vaccineName}
                                        </h5>
                                        <p className="text-muted mb-1">
                                            <strong>Ngày tiêm:</strong> {new Date(vaccine.vaccinationDate).toLocaleDateString('vi-VN')}
                                        </p>
                                        {vaccine.nextDueDate && (
                                            <p className="text-muted mb-1">
                                                <strong>Tiêm tiếp theo:</strong> {new Date(vaccine.nextDueDate).toLocaleDateString('vi-VN')}
                                            </p>
                                        )}
                                        {vaccine.veterinarian && (
                                            <p className="text-muted mb-1">
                                                <strong>Bác sĩ:</strong> {vaccine.veterinarian}
                                            </p>
                                        )}
                                        {vaccine.clinic && (
                                            <p className="text-muted mb-1">
                                                <strong>Phòng khám:</strong> {vaccine.clinic}
                                            </p>
                                        )}
                                        {vaccine.batchNumber && (
                                            <p className="text-muted mb-0">
                                                <strong>Số lô:</strong> {vaccine.batchNumber}
                                            </p>
                                        )}
                                    </div>
                                    <span className="badge" style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontWeight: '600'
                                    }}>Đã tiêm</span>
                                </div>
                                {vaccine.notes && (
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            <strong>Ghi chú:</strong> {vaccine.notes}
                                        </small>
                                    </div>
                                )}
                            </div>
                        ))}

                        {vaccinations.length === 0 && (
                            <div className="text-center py-5">
                                <i className="bi bi-shield-check text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="text-muted mt-3">Chưa có lịch sử tiêm chủng nào</p>
                            </div>
                        )}
                    </div>
                )

            case 'medications':
                return (
                    <div className="weight-records">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4>Theo dõi cân nặng</h4>
                            <button
                                className="btn btn-warning"
                                onClick={() => window.location.href = `/pet/${petId}/health/add`}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Thêm cân nặng
                            </button>
                        </div>

                        {weightRecords.map(record => (
                            <div key={record.id} className="medication-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">
                                            <i className="bi bi-speedometer2 me-2"></i>
                                            {record.weight} kg
                                        </h5>
                                        <p className="text-muted mb-1">
                                            <strong>Ngày cân:</strong> {new Date(record.recordDate).toLocaleDateString('vi-VN')}
                                        </p>
                                        <p className="text-muted mb-0">
                                            <strong>Ghi chú:</strong> {record.notes || 'Không có ghi chú'}
                                        </p>
                                    </div>
                                    <span className="badge" style={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontWeight: '600'
                                    }}>Ghi nhận</span>
                                </div>
                            </div>
                        ))}

                        {weightRecords.length === 0 && (
                            <div className="text-center py-5">
                                <i className="bi bi-speedometer2 text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="text-muted mt-3">Chưa có bản ghi cân nặng nào</p>
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted fs-5">Đang tải hồ sơ sức khỏe...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <style jsx>{`
        .health-container {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .health-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
          position: sticky;
          top: 0;
          z-index: 999;
          box-shadow: 0 4px 30px rgba(139, 92, 246, 0.15);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          padding: 0 32px;
        }

        .back-btn {
          border: none;
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
          font-size: 16px;
          padding: 12px 24px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(6, 182, 212, 0.4);
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
          color: white;
          text-decoration: none;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .content-wrapper {
          padding: 20px;
          position: relative;
          z-index: 1;
        }

        .health-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .pet-overview {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
          padding: 24px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .pet-info-grid {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
        }

        .pet-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .pet-details h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .pet-details p {
          line-height: 1.5;
          margin-bottom: 0;
        }

        .health-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
        }

        .nav-tabs {
          border-bottom: 2px solid rgba(139, 92, 246, 0.1);
          padding: 0 20px;
          background: linear-gradient(to right, #faf5ff 0%, #f5f3ff 100%);
        }

        .nav-link {
          border: none;
          border-bottom: 3px solid transparent;
          color: #64748b;
          font-weight: 600;
          padding: 14px 20px;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .nav-link.active {
          color: #6366f1;
          border-bottom-color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 8px 8px 0 0;
        }

        .nav-link:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 8px 8px 0 0;
          border-color: transparent;
        }

        .tab-content {
          padding: 20px;
        }

        .record-card, .vaccine-card, .medication-card {
          background: linear-gradient(135deg, #ffffff 0%, #fefce8 100%);
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 2px 15px rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.1);
          transition: all 0.3s ease;
          line-height: 1.6;
        }

        .record-card:hover, .vaccine-card:hover, .medication-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.2);
        }

        .record-header {
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f3f4;
        }

        .record-body p {
          margin-bottom: 8px;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .record-body strong {
          margin-right: 6px;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-element {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .floating-element:nth-child(1) {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-element:nth-child(2) {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .floating-element:nth-child(3) {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 16px;
          }

          .content-wrapper {
            padding: 16px;
          }

          .pet-info-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 16px;
          }

          .tab-content {
            padding: 16px;
          }
        }
      `}</style>

            <div className="health-container">
                <div className="floating-elements">
                    <div className="floating-element"></div>
                    <div className="floating-element"></div>
                    <div className="floating-element"></div>
                </div>

                {/* Header */}
                <div className="health-header">
                    <div className="header-content">
                        <button className="back-btn" onClick={() => window.location.href = "/user/pets"}>
                            <i className="bi bi-arrow-left"></i>
                            Quay lại
                        </button>
                        <h1 className="page-title">
                            <i className="bi bi-heart-pulse-fill me-2"></i>
                            Hồ sơ sức khỏe
                        </h1>
                        <div></div>
                    </div>
                </div>

                {/* Content */}
                <div className="content-wrapper">
                    <div className="health-card">
                        {/* Pet Overview */}
                        {pet && (
                            <div className="pet-overview">
                                <div className="pet-info-grid">
                                    <img
                                        src={pet.image || "/placeholder.svg?height=80&width=80"}
                                        alt={pet.name}
                                        className="pet-avatar"
                                    />
                                    <div className="pet-details">
                                        <h3>{pet.name}</h3>
                                        <p className="text-muted mb-2">
                                            {pet.species === "Dog" ? "🐕 Chó" : pet.species === "Cat" ? "🐱 Mèo" : pet.species} •
                                            {pet.breed} • {pet.age} tuổi
                                        </p>
                                    </div>
                                    <div
                                        className="health-status"
                                        style={{
                                            backgroundColor: '#28a74520',
                                            color: '#28a745',
                                            border: '1px solid #28a74530'
                                        }}
                                    >
                                        <i className="bi bi-heart-pulse"></i>
                                        <span>Sức khỏe tốt</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Tabs */}
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'records' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('records')}
                                >
                                    <i className="bi bi-clipboard-data me-2"></i>
                                    Hồ sơ khám bệnh
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'vaccinations' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('vaccinations')}
                                >
                                    <i className="bi bi-shield-check me-2"></i>
                                    Tiêm chủng
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'medications' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('medications')}
                                >
                                    <i className="bi bi-speedometer2 me-2"></i>
                                    Cân nặng
                                </button>
                            </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedRecord && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-clipboard-data me-2"></i>
                                    Chi tiết hồ sơ bệnh án
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetailModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <strong><i className="bi bi-calendar me-2"></i>Ngày khám:</strong>
                                        <p>{new Date(selectedRecord.recordDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong><i className="bi bi-person-badge me-2"></i>Bác sĩ:</strong>
                                        <p>{selectedRecord.veterinarian || 'Chưa có thông tin'}</p>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-12">
                                        <strong><i className="bi bi-hospital me-2"></i>Phòng khám:</strong>
                                        <p>{selectedRecord.clinic || 'Chưa có thông tin'}</p>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-12">
                                        <strong><i className="bi bi-exclamation-triangle me-2"></i>Triệu chứng:</strong>
                                        <p>{selectedRecord.symptoms || 'Chưa có thông tin'}</p>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-12">
                                        <strong><i className="bi bi-clipboard-check me-2"></i>Chẩn đoán:</strong>
                                        <p>{selectedRecord.diagnosis}</p>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-12">
                                        <strong><i className="bi bi-bandaid me-2"></i>Điều trị:</strong>
                                        <p>{selectedRecord.treatment || 'Chưa có thông tin'}</p>
                                    </div>
                                </div>
                                {selectedRecord.notes && (
                                    <div className="row mb-3">
                                        <div className="col-md-12">
                                            <strong><i className="bi bi-journal-text me-2"></i>Ghi chú:</strong>
                                            <p>{selectedRecord.notes}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="row">
                                    <div className="col-md-12">
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-2"></i>
                                            Tạo lúc: {new Date(selectedRecord.createdAt).toLocaleString('vi-VN')}
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PetHealth

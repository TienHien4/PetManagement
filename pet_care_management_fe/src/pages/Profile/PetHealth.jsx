
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
    const [medications, setMedications] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('records')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
            setPet(petRes.data)

            // Mock health records data - replace with actual API calls
            setHealthRecords([
                {
                    id: 1,
                    date: "2024-01-15",
                    type: "checkup",
                    veterinarian: "Dr. Smith",
                    clinic: "Pet Care Center",
                    diagnosis: "Khỏe mạnh, cần tiêm phòng định kỳ",
                    treatment: "Khám tổng quát, cắt móng",
                    notes: "Thú cưng khỏe mạnh, hoạt động tốt",
                    weight: 5.2,
                    temperature: 38.5
                },
                {
                    id: 2,
                    date: "2023-12-10",
                    type: "vaccination",
                    veterinarian: "Dr. Johnson",
                    clinic: "Animal Hospital",
                    diagnosis: "Tiêm phòng định kỳ",
                    treatment: "Tiêm vaccine 5 trong 1",
                    notes: "Không có phản ứng phụ",
                    weight: 5.0,
                    temperature: 38.2
                }
            ])

            setVaccinations([
                {
                    id: 1,
                    name: "Vaccine 5 trong 1",
                    date: "2023-12-10",
                    nextDue: "2024-12-10",
                    status: "completed"
                },
                {
                    id: 2,
                    name: "Vaccine dại",
                    date: "2023-11-15",
                    nextDue: "2024-11-15",
                    status: "due_soon"
                }
            ])

            setMedications([
                {
                    id: 1,
                    name: "Viên tẩy giun",
                    dosage: "1 viên/tháng",
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    status: "active"
                }
            ])

        } catch (error) {
            console.error("Error fetching pet health data:", error)
            alert("Không thể tải dữ liệu sức khỏe thú cưng!")
        } finally {
            setLoading(false)
        }
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
                                            <i className={`bi ${record.type === 'checkup' ? 'bi-clipboard-pulse' : 'bi-shield-plus'} me-2`}></i>
                                            {new Date(record.date).toLocaleDateString('vi-VN')}
                                        </h5>
                                        <span className={`badge ${record.type === 'checkup' ? 'bg-info' : 'bg-success'}`}>
                                            {record.type === 'checkup' ? 'Khám bệnh' : 'Tiêm chủng'}
                                        </span>
                                    </div>
                                </div>

                                <div className="record-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Bác sĩ:</strong> {record.veterinarian}</p>
                                            <p><strong>Phòng khám:</strong> {record.clinic}</p>
                                            <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Điều trị:</strong> {record.treatment}</p>
                                            <p><strong>Cân nặng:</strong> {record.weight}kg</p>
                                            <p><strong>Nhiệt độ:</strong> {record.temperature}°C</p>
                                        </div>
                                    </div>
                                    <p><strong>Ghi chú:</strong> {record.notes}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case 'vaccinations':
                return (
                    <div className="vaccinations">
                        <h4 className="mb-4">Lịch sử tiêm chủng</h4>

                        {vaccinations.map(vaccine => (
                            <div key={vaccine.id} className="vaccine-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{vaccine.name}</h5>
                                        <p className="text-muted mb-0">
                                            Tiêm: {new Date(vaccine.date).toLocaleDateString('vi-VN')} |
                                            Tiêm tiếp: {new Date(vaccine.nextDue).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    {getStatusBadge(vaccine.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case 'medications':
                return (
                    <div className="medications">
                        <h4 className="mb-4">Thuốc đang sử dụng</h4>

                        {medications.map(med => (
                            <div key={med.id} className="medication-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{med.name}</h5>
                                        <p className="text-muted mb-0">
                                            Liều dùng: {med.dosage} |
                                            Từ {new Date(med.startDate).toLocaleDateString('vi-VN')} đến {new Date(med.endDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    {getStatusBadge(med.status)}
                                </div>
                            </div>
                        ))}
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .health-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 999;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          font-size: 16px;
          padding: 12px 24px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
          color: white;
          text-decoration: none;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .content-wrapper {
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        .health-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .pet-overview {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 32px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .pet-info-grid {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          align-items: center;
        }

        .pet-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .pet-details h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }

        .health-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
        }

        .nav-tabs {
          border-bottom: 2px solid #e9ecef;
          padding: 0 32px;
          background: white;
        }

        .nav-link {
          border: none;
          border-bottom: 3px solid transparent;
          color: #666;
          font-weight: 600;
          padding: 16px 24px;
          transition: all 0.3s ease;
        }

        .nav-link.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: none;
        }

        .nav-link:hover {
          color: #667eea;
          border-color: transparent;
        }

        .tab-content {
          padding: 32px;
        }

        .record-card, .vaccine-card, .medication-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f3f4;
          transition: all 0.3s ease;
        }

        .record-card:hover, .vaccine-card:hover, .medication-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .record-header {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f3f4;
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
                                        src={pet.imageUrl || "/placeholder.svg?height=80&width=80"}
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
                                    <i className="bi bi-capsule me-2"></i>
                                    Thuốc men
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
        </>
    )
}

export default PetHealth

"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const HealthDashboard = () => {
    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedFilter, setSelectedFilter] = useState('all')

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            window.location.href = "/login"
            return
        }

        fetchPets(accessToken)
    }, [])

    const fetchPets = async (accessToken) => {
        setLoading(true)
        try {
            const petsRes = await axios.get("http://localhost:8080/api/pet/getAllPet", {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            setPets(petsRes.data)
        } catch (error) {
            console.error("Error fetching pets:", error)
            alert("Không thể tải danh sách thú cưng!")
        } finally {
            setLoading(false)
        }
    }

    const getHealthStatus = (pet) => {
        // Mock logic for health status based on last checkup
        const lastCheckup = pet.lastCheckup || "2024-01-01"
        const daysSinceCheckup = Math.floor((new Date() - new Date(lastCheckup)) / (1000 * 60 * 60 * 24))

        if (daysSinceCheckup > 365) {
            return { status: 'critical', text: 'Cần khám ngay', color: 'danger', days: daysSinceCheckup }
        } else if (daysSinceCheckup > 180) {
            return { status: 'warning', text: 'Cần khám sớm', color: 'warning', days: daysSinceCheckup }
        } else {
            return { status: 'good', text: 'Tốt', color: 'success', days: daysSinceCheckup }
        }
    }

    const getVaccinationStatus = (pet) => {
        // Mock vaccination status
        const vaccines = pet.vaccines || []
        const dueVaccines = vaccines.filter(v => v.status === 'due').length

        if (dueVaccines > 0) {
            return { status: 'due', text: `${dueVaccines} mũi đến hạn`, color: 'warning' }
        }
        return { status: 'current', text: 'Đã cập nhật', color: 'success' }
    }

    const filteredPets = pets.filter(pet => {
        if (selectedFilter === 'all') return true
        const health = getHealthStatus(pet)
        return health.status === selectedFilter
    })

    const getFilterCounts = () => {
        const counts = {
            all: pets.length,
            good: 0,
            warning: 0,
            critical: 0
        }

        pets.forEach(pet => {
            const health = getHealthStatus(pet)
            counts[health.status]++
        })

        return counts
    }

    const filterCounts = getFilterCounts()

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted fs-5">Đang tải thông tin...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <style jsx>{`
        .dashboard-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          padding: 40px 0;
        }

        .dashboard-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .header-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .dashboard-title {
          font-size: 36px;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .dashboard-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .stat-card.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stat-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .pets-section {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-title {
          color: white;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }

        .pets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .pet-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .pet-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .pet-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .pet-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .pet-info h5 {
          margin: 0 0 4px 0;
          font-weight: 600;
          color: #333;
        }

        .pet-details {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .health-indicators {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .health-indicator {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 12px;
          text-align: center;
        }

        .indicator-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .indicator-value {
          font-weight: 600;
          font-size: 14px;
        }

        .pet-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-primary-custom {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary-custom:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          color: white;
          text-decoration: none;
        }

        .btn-outline-custom {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-outline-custom:hover {
          background: #667eea;
          color: white;
          text-decoration: none;
        }

        .emergency-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .emergency-title {
          color: #dc3545;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .emergency-text {
          color: #666;
          margin-bottom: 20px;
        }

        .emergency-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .emergency-btn:hover {
          background: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
          color: white;
          text-decoration: none;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .empty-text {
          font-size: 16px;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 0 16px;
          }

          .dashboard-title {
            font-size: 28px;
          }

          .stats-section {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .pets-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .pet-card {
            padding: 20px;
          }

          .health-indicators {
            grid-template-columns: 1fr;
          }

          .pet-actions {
            flex-direction: column;
          }
        }
      `}</style>

            <div className="dashboard-container">
                <div className="dashboard-content">
                    <div className="header-section">
                        <h1 className="dashboard-title">TỔNG QUAN SỨC KHỎE</h1>
                        <p className="dashboard-subtitle">Theo dõi tình trạng sức khỏe của tất cả thú cưng</p>
                    </div>

                    <div className="stats-section">
                        <div
                            className={`stat-card ${selectedFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedFilter('all')}
                        >
                            <i className="bi bi-heart-pulse stat-icon text-primary"></i>
                            <div className="stat-number">{filterCounts.all}</div>
                            <p className="stat-label">Tổng số thú cưng</p>
                        </div>

                        <div
                            className={`stat-card ${selectedFilter === 'good' ? 'active' : ''}`}
                            onClick={() => setSelectedFilter('good')}
                        >
                            <i className="bi bi-check-circle stat-icon text-success"></i>
                            <div className="stat-number">{filterCounts.good}</div>
                            <p className="stat-label">Sức khỏe tốt</p>
                        </div>

                        <div
                            className={`stat-card ${selectedFilter === 'warning' ? 'active' : ''}`}
                            onClick={() => setSelectedFilter('warning')}
                        >
                            <i className="bi bi-exclamation-triangle stat-icon text-warning"></i>
                            <div className="stat-number">{filterCounts.warning}</div>
                            <p className="stat-label">Cần chú ý</p>
                        </div>

                        <div
                            className={`stat-card ${selectedFilter === 'critical' ? 'active' : ''}`}
                            onClick={() => setSelectedFilter('critical')}
                        >
                            <i className="bi bi-x-circle stat-icon text-danger"></i>
                            <div className="stat-number">{filterCounts.critical}</div>
                            <p className="stat-label">Cần khám ngay</p>
                        </div>
                    </div>

                    <div className="pets-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                {selectedFilter === 'all' ? 'Tất cả thú cưng' :
                                    selectedFilter === 'good' ? 'Thú cưng có sức khỏe tốt' :
                                        selectedFilter === 'warning' ? 'Thú cưng cần chú ý' :
                                            'Thú cưng cần khám ngay'} ({filteredPets.length})
                            </h2>
                        </div>

                        {filteredPets.length > 0 ? (
                            <div className="pets-grid">
                                {filteredPets.map((pet) => {
                                    const healthStatus = getHealthStatus(pet)
                                    const vaccinationStatus = getVaccinationStatus(pet)

                                    return (
                                        <div key={pet.id} className="pet-card">
                                            <div className="pet-header">
                                                <img
                                                    src={pet.imageUrl || "/placeholder.svg?height=60&width=60"}
                                                    alt={pet.name}
                                                    className="pet-avatar"
                                                />
                                                <div className="pet-info">
                                                    <h5>{pet.name}</h5>
                                                    <p className="pet-details">
                                                        {pet.species === "Dog" ? "🐕 Chó" : pet.species === "Cat" ? "🐱 Mèo" : pet.species} •
                                                        {pet.breed} • {pet.age} tuổi
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="health-indicators">
                                                <div className="health-indicator">
                                                    <div className="indicator-label">Tình trạng sức khỏe</div>
                                                    <div className={`indicator-value text-${healthStatus.color}`}>
                                                        {healthStatus.text}
                                                    </div>
                                                </div>
                                                <div className="health-indicator">
                                                    <div className="indicator-label">Tiêm chủng</div>
                                                    <div className={`indicator-value text-${vaccinationStatus.color}`}>
                                                        {vaccinationStatus.text}
                                                    </div>
                                                </div>
                                                <div className="health-indicator">
                                                    <div className="indicator-label">Khám lần cuối</div>
                                                    <div className="indicator-value">
                                                        {healthStatus.days} ngày trước
                                                    </div>
                                                </div>
                                                <div className="health-indicator">
                                                    <div className="indicator-label">Cân nặng</div>
                                                    <div className="indicator-value">
                                                        {pet.weight || 'Chưa cập nhật'} kg
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pet-actions">
                                                <Link
                                                    to={`/pet/health/${pet.id}`}
                                                    className="action-btn btn-primary-custom"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                    Xem chi tiết
                                                </Link>
                                                <Link
                                                    to={`/pet/health/${pet.id}/add`}
                                                    className="action-btn btn-outline-custom"
                                                >
                                                    <i className="bi bi-plus-circle"></i>
                                                    Thêm hồ sơ
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <i className="bi bi-search empty-icon"></i>
                                <h3 className="empty-title">Không tìm thấy thú cưng</h3>
                                <p className="empty-text">
                                    {selectedFilter === 'all'
                                        ? 'Bạn chưa có thú cưng nào được đăng ký.'
                                        : 'Không có thú cưng nào phù hợp với bộ lọc đã chọn.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="emergency-section">
                        <h3 className="emergency-title">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            Trường hợp khẩn cấp?
                        </h3>
                        <p className="emergency-text">
                            Nếu thú cưng của bạn có triệu chứng bất thường hoặc cần cấp cứu ngay lập tức
                        </p>
                        <a href="tel:1900-1234" className="emergency-btn">
                            <i className="bi bi-telephone-fill"></i>
                            Gọi hotline: 1900-1234
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HealthDashboard

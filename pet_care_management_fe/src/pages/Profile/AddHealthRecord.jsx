
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const AddHealthRecord = () => {
    const { petId } = useParams()
    const [pet, setPet] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        type: 'checkup',
        date: new Date().toISOString().split('T')[0],
        veterinarian: '',
        clinic: '',
        diagnosis: '',
        treatment: '',
        weight: '',
        temperature: '',
        symptoms: [],
        medications: '',
        notes: '',
        nextCheckup: ''
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            window.location.href = "/login"
            return
        }

        fetchPetInfo(accessToken)
    }, [petId])

    const fetchPetInfo = async (accessToken) => {
        setLoading(true)
        try {
            const petRes = await axios.get(`http://localhost:8080/api/pet/${petId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            setPet(petRes.data)
        } catch (error) {
            console.error("Error fetching pet info:", error)
            alert("Không thể tải thông tin thú cưng!")
        } finally {
            setLoading(false)
        }
    }

    const symptomOptions = [
        'Sốt', 'Ho', 'Tiêu chảy', 'Nôn mửa', 'Mất cảm giác', 'Khó thở',
        'Yếu ớt', 'Không ăn', 'Ngứa', 'Đau', 'Khó đi lại', 'Khác'
    ]

    const validateForm = () => {
        const newErrors = {}

        if (!formData.date) {
            newErrors.date = "Vui lòng chọn ngày khám"
        }

        if (!formData.veterinarian.trim()) {
            newErrors.veterinarian = "Vui lòng nhập tên bác sĩ"
        }

        if (!formData.clinic.trim()) {
            newErrors.clinic = "Vui lòng nhập tên phòng khám"
        }

        if (!formData.diagnosis.trim()) {
            newErrors.diagnosis = "Vui lòng nhập chẩn đoán"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const handleSymptomChange = (symptom) => {
        const updatedSymptoms = formData.symptoms.includes(symptom)
            ? formData.symptoms.filter(s => s !== symptom)
            : [...formData.symptoms, symptom]

        handleInputChange('symptoms', updatedSymptoms)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        const accessToken = localStorage.getItem("accessToken")

        try {
            // In a real app, this would be an API call to save the health record
            console.log("Saving health record:", formData)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            alert("Thêm hồ sơ sức khỏe thành công!")
            window.location.href = `/pet/health/${petId}`

        } catch (error) {
            console.error("Error saving health record:", error)
            alert("Có lỗi xảy ra khi lưu hồ sơ!")
        } finally {
            setIsSubmitting(false)
        }
    }

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
        .add-record-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          padding: 40px 0;
        }

        .form-container {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .form-title {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .pet-info {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pet-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 15px;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .form-input.error, .form-select.error, .form-textarea.error {
          border-color: #ff6b6b;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
        }

        .symptoms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .symptom-option {
          position: relative;
          cursor: pointer;
        }

        .symptom-checkbox {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .symptom-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          background: white;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 14px;
        }

        .symptom-label:hover {
          border-color: #667eea;
        }

        .symptom-checkbox:checked + .symptom-label {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .error-message {
          color: #ff6b6b;
          font-size: 14px;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 30px;
        }

        .btn-cancel {
          background: #6c757d;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-cancel:hover {
          background: #5a6268;
          transform: translateY(-2px);
          color: white;
          text-decoration: none;
        }

        .btn-submit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-card {
            padding: 24px;
            margin: 20px;
          }

          .form-title {
            font-size: 24px;
          }

          .symptoms-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>

            <div className="add-record-container">
                <div className="container">
                    <div className="form-container">
                        <div className="form-card">
                            <div className="form-header">
                                <h1 className="form-title">THÊM HỒ SƠ SỨC KHỎE</h1>
                                <p className="text-muted">Ghi lại thông tin khám bệnh cho thú cưng</p>
                            </div>

                            {pet && (
                                <div className="pet-info">
                                    <img
                                        src={pet.imageUrl || "/placeholder.svg?height=60&width=60"}
                                        alt={pet.name}
                                        className="pet-avatar"
                                    />
                                    <div>
                                        <h5 className="mb-1">{pet.name}</h5>
                                        <p className="text-muted mb-0">
                                            {pet.species === "Dog" ? "🐕 Chó" : pet.species === "Cat" ? "🐱 Mèo" : pet.species} •
                                            {pet.breed} • {pet.age} tuổi
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-clipboard-pulse me-2"></i>
                                                Loại khám *
                                            </label>
                                            <select
                                                className="form-select"
                                                value={formData.type}
                                                onChange={(e) => handleInputChange('type', e.target.value)}
                                            >
                                                <option value="checkup">Khám định kỳ</option>
                                                <option value="illness">Khám bệnh</option>
                                                <option value="vaccination">Tiêm chủng</option>
                                                <option value="surgery">Phẫu thuật</option>
                                                <option value="emergency">Cấp cứu</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-calendar me-2"></i>
                                                Ngày khám *
                                            </label>
                                            <input
                                                type="date"
                                                className={`form-input ${errors.date ? 'error' : ''}`}
                                                value={formData.date}
                                                onChange={(e) => handleInputChange('date', e.target.value)}
                                            />
                                            {errors.date && (
                                                <div className="error-message">
                                                    <i className="bi bi-exclamation-circle"></i>
                                                    {errors.date}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-person-badge me-2"></i>
                                                Bác sĩ thú y *
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-input ${errors.veterinarian ? 'error' : ''}`}
                                                value={formData.veterinarian}
                                                onChange={(e) => handleInputChange('veterinarian', e.target.value)}
                                                placeholder="Nhập tên bác sĩ"
                                            />
                                            {errors.veterinarian && (
                                                <div className="error-message">
                                                    <i className="bi bi-exclamation-circle"></i>
                                                    {errors.veterinarian}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-hospital me-2"></i>
                                                Phòng khám *
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-input ${errors.clinic ? 'error' : ''}`}
                                                value={formData.clinic}
                                                onChange={(e) => handleInputChange('clinic', e.target.value)}
                                                placeholder="Nhập tên phòng khám"
                                            />
                                            {errors.clinic && (
                                                <div className="error-message">
                                                    <i className="bi bi-exclamation-circle"></i>
                                                    {errors.clinic}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-speedometer2 me-2"></i>
                                                Cân nặng (kg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="form-input"
                                                value={formData.weight}
                                                onChange={(e) => handleInputChange('weight', e.target.value)}
                                                placeholder="VD: 5.2"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-thermometer me-2"></i>
                                                Nhiệt độ (°C)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="form-input"
                                                value={formData.temperature}
                                                onChange={(e) => handleInputChange('temperature', e.target.value)}
                                                placeholder="VD: 38.5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Triệu chứng
                                    </label>
                                    <div className="symptoms-grid">
                                        {symptomOptions.map((symptom) => (
                                            <div key={symptom} className="symptom-option">
                                                <input
                                                    type="checkbox"
                                                    id={`symptom-${symptom}`}
                                                    className="symptom-checkbox"
                                                    checked={formData.symptoms.includes(symptom)}
                                                    onChange={() => handleSymptomChange(symptom)}
                                                />
                                                <label htmlFor={`symptom-${symptom}`} className="symptom-label">
                                                    {symptom}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-clipboard-check me-2"></i>
                                        Chẩn đoán *
                                    </label>
                                    <textarea
                                        className={`form-textarea ${errors.diagnosis ? 'error' : ''}`}
                                        value={formData.diagnosis}
                                        onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                                        placeholder="Nhập kết quả chẩn đoán của bác sĩ"
                                        rows={3}
                                    />
                                    {errors.diagnosis && (
                                        <div className="error-message">
                                            <i className="bi bi-exclamation-circle"></i>
                                            {errors.diagnosis}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-bandaid me-2"></i>
                                        Phương pháp điều trị
                                    </label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.treatment}
                                        onChange={(e) => handleInputChange('treatment', e.target.value)}
                                        placeholder="Mô tả phương pháp điều trị"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-capsule me-2"></i>
                                        Thuốc được kê
                                    </label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.medications}
                                        onChange={(e) => handleInputChange('medications', e.target.value)}
                                        placeholder="Danh sách thuốc và liều dùng"
                                        rows={2}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-calendar-plus me-2"></i>
                                        Lịch khám tiếp theo
                                    </label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.nextCheckup}
                                        onChange={(e) => handleInputChange('nextCheckup', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-journal-text me-2"></i>
                                        Ghi chú
                                    </label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        placeholder="Ghi chú thêm về tình trạng sức khỏe"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => window.location.href = `/pet/health/${petId}`}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Lưu hồ sơ
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddHealthRecord


import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "../../services/customizeAxios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const AddHealthRecord = () => {
    const { petId } = useParams()
    const navigate = useNavigate()
    const [pet, setPet] = useState(null)
    const [vetList, setVetList] = useState([])
    const [recordType, setRecordType] = useState('medical')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // Medical record form
    const [medicalForm, setMedicalForm] = useState({
        recordDate: new Date().toISOString().split('T')[0],
        diagnosis: '',
        treatment: '',
        veterinarian: '',
        clinic: '',
        symptoms: '',
        notes: ''
    })

    // Vaccination form
    const [vaccinationForm, setVaccinationForm] = useState({
        vaccineName: '',
        vaccinationDate: new Date().toISOString().split('T')[0],
        nextDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 1 year
        veterinarian: '',
        clinic: '',
        batchNumber: '',
        notes: ''
    })

    // Weight record form
    const [weightForm, setWeightForm] = useState({
        recordDate: new Date().toISOString().split('T')[0],
        weight: '',
        notes: ''
    })

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            window.location.href = "/login"
            return
        }

        fetchPet(accessToken)
        fetchVetList()
    }, [petId])

    const fetchVetList = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/vet/getAllVet")
            console.log("Vet list:", res.data)
            setVetList(res.data)
        } catch (error) {
            console.error("Error fetching vet list:", error)
            setErrorMessage("Không thể tải danh sách bác sĩ!")
        }
    }

    const fetchPet = async (accessToken) => {
        setLoading(true)
        try {
            const petRes = await axios.get(`http://localhost:8080/api/pet/${petId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            setPet(petRes.data)

            // Pre-fill weight form with pet's existing weight
            if (petRes.data.weight) {
                setWeightForm(prev => ({
                    ...prev,
                    weight: petRes.data.weight
                }))
            }
        } catch (error) {
            console.error("Error fetching pet:", error)
            setErrorMessage("Không thể tải thông tin thú cưng!")
        } finally {
            setLoading(false)
        }
    }

    const handleMedicalFormChange = (e) => {
        const { name, value } = e.target
        setMedicalForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleMedicalVetChange = (e) => {
        const vetId = e.target.value
        const selectedVet = vetList.find(vet => vet.veterinarianId === parseInt(vetId))

        setMedicalForm(prev => ({
            ...prev,
            veterinarian: selectedVet ? selectedVet.name : '',
            clinic: selectedVet ? selectedVet.clinicAddress : ''
        }))
    }

    const handleVaccinationFormChange = (e) => {
        const { name, value } = e.target
        setVaccinationForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleVaccinationVetChange = (e) => {
        const vetId = e.target.value
        const selectedVet = vetList.find(vet => vet.veterinarianId === parseInt(vetId))

        setVaccinationForm(prev => ({
            ...prev,
            veterinarian: selectedVet ? selectedVet.name : '',
            clinic: selectedVet ? selectedVet.clinicAddress : ''
        }))
    }

    const handleWeightFormChange = (e) => {
        const { name, value } = e.target
        setWeightForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const submitMedicalRecord = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            setSubmitting(true)

            const payload = {
                petId: parseInt(petId),
                recordDate: medicalForm.recordDate,
                diagnosis: medicalForm.diagnosis,
                treatment: medicalForm.treatment,
                veterinarian: medicalForm.veterinarian,
                clinic: medicalForm.clinic,
                symptoms: medicalForm.symptoms,
                notes: medicalForm.notes
            }

            await axios.post('http://localhost:8080/api/medical-records', payload, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            setSuccessMessage("Thêm hồ sơ bệnh án thành công!")
            setTimeout(() => {
                navigate(`/pet/health/${petId}`)
            }, 2000)
        } catch (error) {
            console.error("Error adding medical record:", error)
            setErrorMessage("Không thể thêm hồ sơ bệnh án!")
        } finally {
            setSubmitting(false)
        }
    }

    const submitVaccination = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            setSubmitting(true)

            const payload = {
                petId: parseInt(petId),
                vaccineName: vaccinationForm.vaccineName,
                vaccinationDate: vaccinationForm.vaccinationDate,
                nextDueDate: vaccinationForm.nextDueDate,
                veterinarian: vaccinationForm.veterinarian,
                clinic: vaccinationForm.clinic,
                batchNumber: vaccinationForm.batchNumber,
                notes: vaccinationForm.notes
            }

            await axios.post('http://localhost:8080/api/vaccinations', payload, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            setSuccessMessage("Thêm thông tin tiêm chủng thành công!")
            setTimeout(() => {
                navigate(`/pet/health/${petId}`)
            }, 2000)
        } catch (error) {
            console.error("Error adding vaccination:", error)
            setErrorMessage("Không thể thêm thông tin tiêm chủng!")
        } finally {
            setSubmitting(false)
        }
    }

    const submitWeightRecord = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            setSubmitting(true)

            const payload = {
                petId: parseInt(petId),
                weight: parseFloat(weightForm.weight),
                recordDate: weightForm.recordDate,
                notes: weightForm.notes
            }

            await axios.post('http://localhost:8080/api/weight-records', payload, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            setSuccessMessage("Thêm thông tin cân nặng thành công!")
            setTimeout(() => {
                navigate(`/pet/health/${petId}`)
            }, 2000)
        } catch (error) {
            console.error("Error adding weight record:", error)
            setErrorMessage("Không thể thêm thông tin cân nặng!")
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (recordType === 'medical') {
            await submitMedicalRecord()
        } else if (recordType === 'vaccination') {
            await submitVaccination()
        } else if (recordType === 'weight') {
            await submitWeightRecord()
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

        .form-check-input {
          margin-right: 8px;
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
                                <p className="text-muted">Ghi lại thông tin sức khỏe cho thú cưng</p>
                            </div>

                            {pet && (
                                <div className="pet-info">
                                    <img
                                        src={pet.image || "/placeholder.svg?height=60&width=60"}
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

                            {successMessage && (
                                <div className="alert alert-success">
                                    <i className="bi bi-check-circle me-2"></i>
                                    {successMessage}
                                </div>
                            )}

                            {errorMessage && (
                                <div className="alert alert-danger">
                                    <i className="bi bi-exclamation-circle me-2"></i>
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Record Type Selection */}
                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-clipboard-pulse me-2"></i>
                                        Loại hồ sơ sức khỏe *
                                    </label>
                                    <div className="d-flex gap-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="recordType"
                                                id="medical"
                                                value="medical"
                                                checked={recordType === 'medical'}
                                                onChange={(e) => setRecordType(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="medical">
                                                Hồ sơ bệnh án
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="recordType"
                                                id="vaccination"
                                                value="vaccination"
                                                checked={recordType === 'vaccination'}
                                                onChange={(e) => setRecordType(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="vaccination">
                                                Tiêm chủng
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="recordType"
                                                id="weight"
                                                value="weight"
                                                checked={recordType === 'weight'}
                                                onChange={(e) => setRecordType(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="weight">
                                                Cân nặng
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Record Form */}
                                {recordType === 'medical' && (
                                    <>
                                        <div className="row">

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-person-badge me-2"></i>
                                                        Bác sĩ thú y
                                                    </label>
                                                    <select
                                                        className="form-input"
                                                        name="veterinarian"
                                                        value={medicalForm.veterinarian}
                                                        onChange={handleMedicalVetChange}
                                                    >
                                                        <option value="">Chọn bác sĩ</option>
                                                        {vetList.map((vet) => (
                                                            <option key={vet.veterinarianId} value={vet.veterinarianId}>
                                                                {vet.name} - {vet.clinicAddress}
                                                            </option>
                                                        ))}
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
                                                        className="form-input"
                                                        name="recordDate"
                                                        value={medicalForm.recordDate}
                                                        onChange={handleMedicalFormChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                                        Triệu chứng
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        name="symptoms"
                                                        value={medicalForm.symptoms}
                                                        onChange={handleMedicalFormChange}
                                                        placeholder="Mô tả triệu chứng"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-clipboard-check me-2"></i>
                                                Chẩn đoán *
                                            </label>
                                            <textarea
                                                className="form-textarea"
                                                name="diagnosis"
                                                value={medicalForm.diagnosis}
                                                onChange={handleMedicalFormChange}
                                                placeholder="Nhập kết quả chẩn đoán của bác sĩ"
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-bandaid me-2"></i>
                                                Phương pháp điều trị
                                            </label>
                                            <textarea
                                                className="form-textarea"
                                                name="treatment"
                                                value={medicalForm.treatment}
                                                onChange={handleMedicalFormChange}
                                                placeholder="Mô tả phương pháp điều trị"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-journal-text me-2"></i>
                                                Ghi chú
                                            </label>
                                            <textarea
                                                className="form-textarea"
                                                name="notes"
                                                value={medicalForm.notes}
                                                onChange={handleMedicalFormChange}
                                                placeholder="Ghi chú thêm về tình trạng sức khỏe"
                                                rows={3}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Vaccination Form */}
                                {recordType === 'vaccination' && (
                                    <>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-shield-check me-2"></i>
                                                        Tên vaccine *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        name="vaccineName"
                                                        value={vaccinationForm.vaccineName}
                                                        onChange={handleVaccinationFormChange}
                                                        placeholder="VD: Rabies, DHPP"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-calendar me-2"></i>
                                                        Ngày tiêm *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-input"
                                                        name="vaccinationDate"
                                                        value={vaccinationForm.vaccinationDate}
                                                        onChange={handleVaccinationFormChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-calendar-plus me-2"></i>
                                                        Ngày tiêm tiếp theo
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-input"
                                                        name="nextDueDate"
                                                        value={vaccinationForm.nextDueDate}
                                                        onChange={handleVaccinationFormChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-upc-scan me-2"></i>
                                                        Số lô vaccine
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        name="batchNumber"
                                                        value={vaccinationForm.batchNumber}
                                                        onChange={handleVaccinationFormChange}
                                                        placeholder="Nhập số lô vaccine"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-person-badge me-2"></i>
                                                        Bác sĩ thú y
                                                    </label>
                                                    <select
                                                        className="form-input"
                                                        name="veterinarian"
                                                        value={vaccinationForm.veterinarian}
                                                        onChange={handleVaccinationVetChange}
                                                    >
                                                        <option value="">Chọn bác sĩ</option>
                                                        {vetList.map((vet) => (
                                                            <option key={vet.veterinarianId} value={vet.veterinarianId}>
                                                                {vet.name} - {vet.clinicAddress}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-journal-text me-2"></i>
                                                Ghi chú
                                            </label>
                                            <textarea
                                                className="form-textarea"
                                                name="notes"
                                                value={vaccinationForm.notes}
                                                onChange={handleVaccinationFormChange}
                                                placeholder="Ghi chú về vaccine hoặc phản ứng"
                                                rows={3}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Weight Record Form */}
                                {recordType === 'weight' && (
                                    <>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-calendar me-2"></i>
                                                        Ngày cân *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-input"
                                                        name="recordDate"
                                                        value={weightForm.recordDate}
                                                        onChange={handleWeightFormChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <i className="bi bi-speedometer2 me-2"></i>
                                                        Cân nặng (kg) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        className="form-input"
                                                        name="weight"
                                                        value={weightForm.weight}
                                                        onChange={handleWeightFormChange}
                                                        placeholder="VD: 5.2"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-journal-text me-2"></i>
                                                Ghi chú
                                            </label>
                                            <textarea
                                                className="form-textarea"
                                                name="notes"
                                                value={weightForm.notes}
                                                onChange={handleWeightFormChange}
                                                placeholder="Ghi chú về cân nặng"
                                                rows={3}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="form-actions">
                                    <Link
                                        to={`/pet/health/${petId}`}
                                        className="btn-cancel"
                                    >
                                        Hủy
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
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

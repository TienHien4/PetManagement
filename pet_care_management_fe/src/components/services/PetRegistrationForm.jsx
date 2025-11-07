
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../services/customizeAxios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const PetRegistrationForm = () => {
  const navigate = useNavigate()
  const userID = localStorage.getItem("userId")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    petId: "", // Changed from petSpecies to petId
    petSpecies: "",
    services: [],
    date: "",
    vetId: "",
    userId: Number(userID),
  })
  const [vetList, setVetList] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [userPets, setUserPets] = useState([]) // New state for user's pets
  const [selectedPet, setSelectedPet] = useState(null) // New state for selected pet details
  const [showCreatePetForm, setShowCreatePetForm] = useState(false) // Toggle between select pet or create new
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    featchVetList()
    fetchServices()
    fetchUserPets() // Add new function call
  }, [])

  const featchVetList = async () => {
    try {
      var res = await axios.get("/api/vet/getAllVet")
      console.log(res.data)
      setVetList(res.data)
    } catch (error) {
      console.error("Error fetching vet list:", error)
      alert("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau!")
    }
  }

  const fetchUserPets = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.get(`/api/pet/getPetsByUser/${userID}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("User pets:", res.data)
      setUserPets(res.data)

      // If no pets found, redirect to create new pet
      if (!res.data || res.data.length === 0) {
        navigate('/pet/add')
      }
    } catch (error) {
      console.error("Error fetching user pets:", error)
      // If no pets found, redirect to create new pet
      navigate('/pet/add')
    }
  }

  const handleCreateNewPet = () => {
    navigate('/pet/add')
  }

  const fetchServices = async () => {
    try {
      const res = await axios.get("/api/services/all")
      console.log("Services:", res.data)
      const formattedServices = res.data.map(service => ({
        value: service.name,
        icon: getServiceIcon(service.name),
        color: getServiceColor(service.name),
        price: service.price
      }))
      setServiceOptions(formattedServices)
    } catch (error) {
      console.error("Error fetching services:", error)
      // Fallback to hardcoded services if API fails
      setServiceOptions([
        { value: "Khám tổng quát", icon: "bi-heart-pulse", color: "#ff6b6b" },
        { value: "Tiêm phòng", icon: "bi-shield-plus", color: "#4ecdc4" },
        { value: "Tắm và cắt tỉa lông", icon: "bi-scissors", color: "#45b7d1" },
      ])
    }
  }

  const getServiceIcon = (serviceName) => {
    const iconMap = {
      "Khám tổng quát": "bi-heart-pulse",
      "Tiêm phòng": "bi-shield-plus",
      "Phẫu thuật": "bi-bandaid",
      "Nha khoa": "bi-tooth",
      "Tắm và cắt tỉa lông": "bi-scissors",
      "Siêu âm": "bi-soundwave",
      "X-quang": "bi-x-diamond",
      "Xét nghiệm máu": "bi-droplet"
    }
    return iconMap[serviceName] || "bi-gear"
  }

  const getServiceColor = (serviceName) => {
    const colorMap = {
      "Khám tổng quát": "#ff6b6b",
      "Tiêm phòng": "#4ecdc4",
      "Phẫu thuật": "#f39c12",
      "Nha khoa": "#9b59b6",
      "Tắm và cắt tỉa lông": "#45b7d1",
      "Siêu âm": "#2ecc71",
      "X-quang": "#e74c3c",
      "Xét nghiệm máu": "#34495e"
    }
    return colorMap[serviceName] || "#95a5a6"
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    // Validate pet selection based on mode
    if (!showCreatePetForm) {
      if (!formData.petId) {
        newErrors.petId = "Vui lòng chọn thú cưng"
      }
    } else {
      if (!formData.petSpecies) {
        newErrors.petSpecies = "Vui lòng chọn loại thú cưng"
      }
    }

    if (formData.services.length === 0) {
      newErrors.services = "Vui lòng chọn ít nhất một dịch vụ"
    }

    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày khám"
    }

    if (!formData.vetId) {
      newErrors.vetId = "Vui lòng chọn bác sĩ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleServiceChange = (service) => {
    const updatedServices = formData.services.includes(service)
      ? formData.services.filter((s) => s !== service)
      : [...formData.services, service]

    handleInputChange("services", updatedServices)
  }

  const handlePetSelection = (petId) => {
    const pet = userPets.find(p => p.id === parseInt(petId))
    if (pet) {
      setSelectedPet(pet)
      setFormData(prev => ({
        ...prev,
        petId: petId,
        petSpecies: pet.species || pet.type
      }))
    }

    // Clear error when pet is selected
    if (errors.petId) {
      setErrors(prev => ({ ...prev, petId: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    const accessToken = localStorage.getItem("accessToken")

    try {
      // Prepare appointment data
      let appointmentData = { ...formData }

      // If user selected existing pet, include pet details
      if (!showCreatePetForm && selectedPet) {
        appointmentData.name = formData.name // Use customer name instead
        // Include pet information
        appointmentData.petId = selectedPet.id
        appointmentData.petName = selectedPet.name
        appointmentData.petType = selectedPet.species || selectedPet.type
        appointmentData.petBreed = selectedPet.breed || 'Mixed'
        appointmentData.petAge = selectedPet.age ? selectedPet.age.toString() : 'N/A'
        appointmentData.petWeight = selectedPet.weight ? selectedPet.weight.toString() : 'N/A'
        appointmentData.petGender = selectedPet.gender || 'N/A'
        appointmentData.petImageUrl = selectedPet.image || '/placeholder.svg'
      } else {
        // For new pets, use customer name
        appointmentData.name = formData.name // Use customer name instead
        appointmentData.petType = formData.petSpecies
        appointmentData.petName = 'Chưa đặt tên'
        appointmentData.petBreed = 'Chưa xác định'
        appointmentData.petAge = 'N/A'
        appointmentData.petWeight = 'N/A'
        appointmentData.petGender = 'N/A'
      }

      // Remove the unnecessary fields  
      delete appointmentData.petSpecies

      console.log('Sending appointment data:', appointmentData)

      const res = await axios.post("/api/appointment/createAppointment", appointmentData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      console.log(res.data)
      setShowSuccess(true)

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          petId: "",
          petSpecies: "",
          services: [],
          date: "",
          vetId: "",
          userId: Number(userID),
        })
        setSelectedPet(null)
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.log(error)
      alert("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .registration-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          padding: 40px 0;
        }
        
        .registration-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          opacity: 0.3;
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
          padding: 50px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .form-title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 15px;
        }
        
        .form-subtitle {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 15px;
        }
        
        .form-input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e1e5e9;
          border-radius: 15px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }
        
        .form-input.error {
          border-color: #ff6b6b;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
        }
        
        .form-select {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e1e5e9;
          border-radius: 15px;
          font-size: 16px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          padding-right: 50px;
        }
        
        .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }
        
        .form-select.error {
          border-color: #ff6b6b;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
        }
        
        .services-section {
          margin-bottom: 30px;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .service-option {
          position: relative;
          cursor: pointer;
        }
        
        .service-checkbox {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }
        
        .service-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 20px;
          border: 2px solid #e1e5e9;
          border-radius: 15px;
          background: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .service-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.1);
        }
        
        .service-checkbox:checked + .service-card {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .service-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
          transition: all 0.3s ease;
        }
        
        .service-text {
          font-weight: 600;
          font-size: 15px;
        }
        
        .error-message {
          color: #ff6b6b;
          font-size: 14px;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 15px;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 20px;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .success-message {
          background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          margin-bottom: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .pet-icons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
          opacity: 0.6;
        }
        
        .pet-icon {
          font-size: 40px;
          color: #667eea;
          animation: float 3s ease-in-out infinite;
        }
        
        .pet-icon:nth-child(2) {
          animation-delay: 0.5s;
        }
        
        .pet-icon:nth-child(3) {
          animation-delay: 1s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .selected-pet-info {
          margin-top: 15px;
        }
        
        .pet-info-card {
          background: linear-gradient(135deg, #f8f9ff 0%, #fff5f5 100%);
          border: 2px solid #e1e5e9;
          border-radius: 15px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        
        .pet-info-card:hover {
          border-color: #667eea;
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.1);
        }
        
        .pet-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #667eea;
        }
        
        .pet-avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }
        
        .pet-name {
          color: #333;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .pet-details {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          font-size: 14px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          color: #666;
          background: rgba(255, 255, 255, 0.7);
          padding: 5px 10px;
          border-radius: 8px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .detail-item i {
          color: #667eea;
        }
        
        .btn-group-sm .btn {
          padding: 5px 12px;
          font-size: 12px;
          border-radius: 8px;
        }
        
        @media (max-width: 768px) {
          .form-card {
            padding: 30px 20px;
            margin: 20px;
          }
          
          .form-title {
            font-size: 24px;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
          }
          
          .pet-icons {
            gap: 15px;
          }
          
          .pet-icon {
            font-size: 30px;
          }
        }
      `}</style>

      <div className="registration-container">
        <div className="container">
          <div className="form-container">
            <div className="form-card">
              <div className="form-header">
                <h1 className="form-title">ĐĂNG KÝ KHÁM TƯ VẤN</h1>
                <h2 className="form-title" style={{ fontSize: "24px", marginTop: "-10px" }}>
                  CHĂM SÓC THÚ CƯNG
                </h2>
                <p className="form-subtitle">
                  Vui lòng điền thông tin để được hỗ trợ tốt nhất. Chúng tôi sẽ liên hệ lại ngay!
                </p>

                <div className="pet-icons">
                  <i className="bi bi-heart-fill pet-icon"></i>
                  <i className="bi bi-house-heart-fill pet-icon"></i>
                  <i className="bi bi-heart-pulse-fill pet-icon"></i>
                </div>
              </div>

              {showSuccess && (
                <div className="success-message">
                  <i className="bi bi-check-circle-fill"></i>
                  Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="bi bi-person-fill me-2"></i>
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${errors.name ? "error" : ""}`}
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nhập họ và tên của bạn"
                      />
                      {errors.name && (
                        <div className="error-message">
                          <i className="bi bi-exclamation-circle"></i>
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="bi bi-envelope-fill me-2"></i>
                        Email *
                      </label>
                      <input
                        type="email"
                        className={`form-input ${errors.email ? "error" : ""}`}
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Nhập địa chỉ email"
                      />
                      {errors.email && (
                        <div className="error-message">
                          <i className="bi bi-exclamation-circle"></i>
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pet Selection Section */}
                <div className="form-group">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label mb-0">
                      <i className="bi bi-heart-fill me-2"></i>
                      Thông tin thú cưng *
                    </label>
                    {userPets.length > 0 && (
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className={`btn ${!showCreatePetForm ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setShowCreatePetForm(false)}
                        >
                          <i className="bi bi-list-ul me-1"></i>
                          Chọn thú cưng có sẵn
                        </button>
                        <button
                          type="button"
                          className={`btn ${showCreatePetForm ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={handleCreateNewPet}
                        >
                          <i className="bi bi-plus-circle me-1"></i>
                          Thú cưng mới
                        </button>
                      </div>
                    )}
                  </div>

                  {!showCreatePetForm && userPets.length > 0 ? (
                    <div>
                      <select
                        className={`form-select ${errors.petId ? "error" : ""}`}
                        value={formData.petId}
                        onChange={(e) => handlePetSelection(e.target.value)}
                      >
                        <option value="">Chọn thú cưng của bạn</option>
                        {userPets.map((pet) => (
                          <option key={pet.id} value={pet.id}>
                            {pet.name} - {pet.species || pet.type} ({pet.breed || 'Không rõ giống'})
                          </option>
                        ))}
                      </select>
                      {errors.petId && (
                        <div className="error-message">
                          <i className="bi bi-exclamation-circle"></i>
                          {errors.petId}
                        </div>
                      )}

                      {/* Selected Pet Information Display */}
                      {selectedPet && (
                        <div className="selected-pet-info mt-3">
                          <div className="pet-info-card">
                            <div className="row align-items-center">
                              <div className="col-md-3">
                                {selectedPet.image ? (
                                  <img
                                    src={selectedPet.image}
                                    alt={selectedPet.name}
                                    className="pet-avatar"
                                  />
                                ) : (
                                  <div className="pet-avatar-placeholder">
                                    <i className="bi bi-heart-fill"></i>
                                  </div>
                                )}
                              </div>
                              <div className="col-md-9">
                                <h6 className="pet-name">
                                  <i className="bi bi-heart-fill me-2 text-danger"></i>
                                  {selectedPet.name}
                                </h6>
                                <div className="pet-details">
                                  <span className="detail-item">
                                    <i className="bi bi-list me-1"></i>
                                    <strong>Loài:</strong> {selectedPet.species || selectedPet.type}
                                  </span>
                                  <span className="detail-item">
                                    <i className="bi bi-award me-1"></i>
                                    <strong>Giống:</strong> {selectedPet.breed || 'Không rõ giống'}
                                  </span>
                                  <span className="detail-item">
                                    <i className="bi bi-calendar me-1"></i>
                                    <strong>Tuổi:</strong> {selectedPet.age || 'Không rõ tuổi'}
                                  </span>
                                  {selectedPet.weight && (
                                    <span className="detail-item">
                                      <i className="bi bi-speedometer me-1"></i>
                                      <strong>Cân nặng:</strong> {selectedPet.weight} kg
                                    </span>
                                  )}
                                  {selectedPet.gender && (
                                    <span className="detail-item">
                                      <i className="bi bi-gender-ambiguous me-1"></i>
                                      <strong>Giới tính:</strong> {selectedPet.gender}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-6">
                        <select
                          className={`form-select ${errors.petSpecies ? "error" : ""}`}
                          value={formData.petSpecies}
                          onChange={(e) => handleInputChange("petSpecies", e.target.value)}
                        >
                          <option value="">Chọn loại thú cưng</option>
                          <option value="Chó">🐕 Chó</option>
                          <option value="Mèo">🐱 Mèo</option>
                        </select>
                        {errors.petSpecies && (
                          <div className="error-message">
                            <i className="bi bi-exclamation-circle"></i>
                            {errors.petSpecies}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            <i className="bi bi-calendar-fill me-2"></i>
                            Ngày khám *
                          </label>
                          <input
                            type="date"
                            className={`form-input ${errors.date ? "error" : ""}`}
                            value={formData.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
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
                  )}
                </div>

                {/* Date selection for existing pets */}
                {!showCreatePetForm && userPets.length > 0 && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="bi bi-calendar-fill me-2"></i>
                          Ngày khám *
                        </label>
                        <input
                          type="date"
                          className={`form-input ${errors.date ? "error" : ""}`}
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
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
                )}

                <div className="services-section">
                  <label className="form-label">
                    <i className="bi bi-list-check me-2"></i>
                    Dịch vụ cần sử dụng *
                  </label>
                  <div className="services-grid">
                    {serviceOptions.map((service, index) => (
                      <div key={index} className="service-option">
                        <input
                          type="checkbox"
                          id={`service-${index}`}
                          className="service-checkbox"
                          checked={formData.services.includes(service.value)}
                          onChange={() => handleServiceChange(service.value)}
                        />
                        <label htmlFor={`service-${index}`} className="service-card">
                          <div className="service-icon" style={{ backgroundColor: service.color }}>
                            <i className={`bi ${service.icon}`}></i>
                          </div>
                          <span className="service-text">{service.value}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.services && (
                    <div className="error-message">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.services}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-person-badge-fill me-2"></i>
                    Chọn bác sĩ *
                  </label>
                  <select
                    className={`form-select ${errors.vetId ? "error" : ""}`}
                    value={formData.vetId}
                    onChange={(e) => handleInputChange("vetId", Number.parseInt(e.target.value))}
                  >
                    <option value="">Chọn bác sĩ khám</option>
                    {vetList.map((vet) => (
                      <option key={vet.id} value={vet.id}>
                        {vet.name} - {vet.clinicAddress}
                      </option>
                    ))}
                  </select>
                  {errors.vetId && (
                    <div className="error-message">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.vetId}
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      Đăng ký ngay
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PetRegistrationForm

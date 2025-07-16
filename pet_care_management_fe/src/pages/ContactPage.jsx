"use client"
import { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import Header from "../components/home/Header"
import Footer from "../components/home/Footer"

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        service: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const services = [
        { value: "general", label: "Khám bệnh tổng quát" },
        { value: "vaccine", label: "Tiêm phòng vaccine" },
        { value: "surgery", label: "Phẫu thuật" },
        { value: "grooming", label: "Spa & Grooming" },
        { value: "emergency", label: "Cấp cứu" },
        { value: "consultation", label: "Tư vấn" },
    ]

    const contactInfo = [
        {
            icon: "bi-telephone",
            title: "Điện thoại",
            content: "0382562504",
            link: "tel:0382562504",
            color: "#e74c3c",
        },
        {
            icon: "bi-envelope",
            title: "Email",
            content: "haisesasakilop8@gmail.com",
            link: "mailto:haisesasakilop8@gmail.com",
            color: "#3498db",
        },
        {
            icon: "bi-geo-alt",
            title: "Địa chỉ",
            content: "Thuận Thành - Bắc Ninh",
            link: "#",
            color: "#2ecc71",
        },
        {
            icon: "bi-clock",
            title: "Giờ làm việc",
            content: "8:00 - 17:00 (Thứ 2 - Thứ 7)",
            link: "#",
            color: "#f39c12",
        },
    ]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Vui lòng nhập họ tên"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại"
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Số điện thoại không hợp lệ"
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Vui lòng nhập tiêu đề"
        }

        if (!formData.message.trim()) {
            newErrors.message = "Vui lòng nhập nội dung tin nhắn"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.")
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
                service: "",
            })
            setIsSubmitting(false)
        }, 2000)
    }

    return (
        <>
            <style jsx>{`
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #9b59b6 100%);
          position: relative;
          overflow-x: hidden;
        }

        .contact-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.05) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(255, 255, 255, 0.05) 50%, transparent 60%);
          background-size: 60px 60px;
          animation: patternMove 20s linear infinite;
        }

        @keyframes patternMove {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 60px 60px, -60px 60px; }
        }

        .geometric-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.03);
          animation: shapeFloat 25s ease-in-out infinite;
        }

        .shape.circle {
          border-radius: 50%;
        }

        .shape.square {
          border-radius: 10px;
          transform: rotate(45deg);
        }

        .shape.triangle {
          width: 0;
          height: 0;
          background: transparent;
          border-left: 30px solid transparent;
          border-right: 30px solid transparent;
          border-bottom: 50px solid rgba(255, 255, 255, 0.03);
        }

        .shape:nth-child(1) {
          width: 120px;
          height: 120px;
          top: 15%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape:nth-child(2) {
          width: 80px;
          height: 80px;
          top: 70%;
          right: 10%;
          animation-delay: 8s;
        }

        .shape:nth-child(3) {
          top: 40%;
          left: 85%;
          animation-delay: 15s;
        }

        .shape:nth-child(4) {
          width: 100px;
          height: 100px;
          bottom: 10%;
          left: 15%;
          animation-delay: 5s;
        }

        @keyframes shapeFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-30px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.4; }
          75% { transform: translateY(-40px) rotate(270deg); opacity: 0.7; }
        }

        .content-wrapper {
          position: relative;
          z-index: 2;
          padding: 40px 0;
        }

        .hero-section {
          text-align: center;
          padding: 80px 0 60px;
          color: white;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          animation: slideInDown 1s ease-out;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 40px;
          opacity: 0.9;
          animation: slideInUp 1s ease-out 0.3s both;
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          margin-bottom: 60px;
        }

        .contact-form-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          animation: fadeInLeft 1s ease-out 0.6s both;
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 30px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
          display: block;
          color: white;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-control {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-control:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
        }

        .form-control.error {
          border-color: #e74c3c;
          box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.2);
        }

        .error-message {
          color: #ff6b6b;
          font-size: 12px;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          padding-right: 40px;
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #3498db, #9b59b6);
          border: none;
          border-radius: 15px;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(52, 152, 219, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .contact-info-section {
          animation: fadeInRight 1s ease-out 0.6s both;
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .info-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 30px;
          text-align: center;
        }

        .contact-info-grid {
          display: grid;
          gap: 25px;
          margin-bottom: 40px;
        }

        .contact-info-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          text-align: center;
        }

        .contact-info-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .contact-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
          color: white;
          transition: all 0.3s ease;
        }

        .contact-info-card:hover .contact-icon {
          transform: scale(1.1);
        }

        .contact-info-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          margin-bottom: 10px;
        }

        .contact-info-content {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-info-content:hover {
          color: white;
        }

        .map-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
          animation: fadeInUp 1s ease-out 0.9s both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .map-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 30px;
        }

        .map-placeholder {
          width: 100%;
          height: 400px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          border: 2px dashed rgba(255, 255, 255, 0.3);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .contact-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .contact-form-section,
          .map-section {
            padding: 25px;
          }

          .form-title,
          .info-title,
          .map-title {
            font-size: 1.5rem;
          }

          .contact-info-card {
            padding: 20px;
          }

          .contact-icon {
            width: 60px;
            height: 60px;
            font-size: 24px;
          }

          .map-placeholder {
            height: 300px;
            font-size: 16px;
          }
        }
      `}</style>

            <div className="contact-page">
                <Header></Header>
                <div className="geometric-shapes">
                    <div className="shape circle"></div>
                    <div className="shape square"></div>
                    <div className="shape triangle"></div>
                    <div className="shape circle"></div>
                </div>

                <div className="content-wrapper">
                    <div className="container">
                        {/* Hero Section */}
                        <div className="hero-section">
                            <h1 className="hero-title">Liên Hệ Với Chúng Tôi</h1>
                            <p className="hero-subtitle">
                                Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn về mọi vấn đề liên quan đến thú cưng
                            </p>
                        </div>

                        {/* Contact Content */}
                        <div className="contact-content">
                            {/* Contact Form */}
                            <div className="contact-form-section">
                                <h2 className="form-title">Gửi Tin Nhắn</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    <i className="bi bi-person"></i> Họ và tên *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className={`form-control ${errors.name ? "error" : ""}`}
                                                    placeholder="Nhập họ và tên của bạn"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
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
                                                    <i className="bi bi-envelope"></i> Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={`form-control ${errors.email ? "error" : ""}`}
                                                    placeholder="Nhập địa chỉ email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
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

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    <i className="bi bi-telephone"></i> Số điện thoại *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className={`form-control ${errors.phone ? "error" : ""}`}
                                                    placeholder="Nhập số điện thoại"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.phone && (
                                                    <div className="error-message">
                                                        <i className="bi bi-exclamation-circle"></i>
                                                        {errors.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    <i className="bi bi-heart-pulse"></i> Dịch vụ quan tâm
                                                </label>
                                                <select
                                                    name="service"
                                                    className="form-control form-select"
                                                    value={formData.service}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Chọn dịch vụ</option>
                                                    {services.map((service) => (
                                                        <option key={service.value} value={service.value}>
                                                            {service.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <i className="bi bi-chat-text"></i> Tiêu đề *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            className={`form-control ${errors.subject ? "error" : ""}`}
                                            placeholder="Nhập tiêu đề tin nhắn"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                        />
                                        {errors.subject && (
                                            <div className="error-message">
                                                <i className="bi bi-exclamation-circle"></i>
                                                {errors.subject}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <i className="bi bi-chat-dots"></i> Nội dung tin nhắn *
                                        </label>
                                        <textarea
                                            name="message"
                                            className={`form-control form-textarea ${errors.message ? "error" : ""}`}
                                            placeholder="Nhập nội dung tin nhắn của bạn..."
                                            value={formData.message}
                                            onChange={handleInputChange}
                                        ></textarea>
                                        {errors.message && (
                                            <div className="error-message">
                                                <i className="bi bi-exclamation-circle"></i>
                                                {errors.message}
                                            </div>
                                        )}
                                    </div>

                                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <div className="loading-spinner"></div>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-send"></i>
                                                Gửi tin nhắn
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Contact Info */}
                            <div className="contact-info-section">
                                <h2 className="info-title">Thông Tin Liên Hệ</h2>
                                <div className="contact-info-grid">
                                    {contactInfo.map((info, index) => (
                                        <div key={index} className="contact-info-card">
                                            <div className="contact-icon" style={{ backgroundColor: info.color }}>
                                                <i className={`bi ${info.icon}`}></i>
                                            </div>
                                            <h3 className="contact-info-title">{info.title}</h3>
                                            <a
                                                href={info.link}
                                                className="contact-info-content"
                                                onClick={info.link === "#" ? (e) => e.preventDefault() : undefined}
                                            >
                                                {info.content}
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Contact */}
                                <div className="contact-info-card">
                                    <div className="contact-icon" style={{ backgroundColor: "#9b59b6" }}>
                                        <i className="bi bi-chat-heart"></i>
                                    </div>
                                    <h3 className="contact-info-title">Liên hệ nhanh</h3>
                                    <p className="contact-info-content">Gọi ngay hotline để được tư vấn miễn phí và đặt lịch hẹn</p>
                                    <div style={{ marginTop: "15px" }}>
                                        <a
                                            href="tel:0382562504"
                                            className="submit-btn"
                                            style={{
                                                display: "inline-flex",
                                                width: "auto",
                                                padding: "12px 24px",
                                                textDecoration: "none",
                                            }}
                                        >
                                            <i className="bi bi-telephone"></i>
                                            Gọi ngay
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="map-section">
                            <h2 className="map-title">Vị Trí Của Chúng Tôi</h2>
                            <div className="map-placeholder">
                                <div style={{ textAlign: "center" }}>
                                    <i className="bi bi-geo-alt" style={{ fontSize: "48px", marginBottom: "15px" }}></i>
                                    <br />
                                    <strong>Thuận Thành - Bắc Ninh</strong>
                                    <br />
                                    <span style={{ opacity: 0.8 }}>Bản đồ sẽ được tích hợp tại đây</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        </>
    )
}

export default ContactPage

"use client"
import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import Header from "../components/home/Header"
import Footer from "../components/home/Footer"

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const stats = [
    { number: "5000+", label: "Thú cưng được chăm sóc", icon: "bi-heart-pulse" },
    { number: "50+", label: "Bác sĩ thú y chuyên nghiệp", icon: "bi-person-badge" },
    { number: "10+", label: "Năm kinh nghiệm", icon: "bi-calendar-check" },
    { number: "24/7", label: "Hỗ trợ khẩn cấp", icon: "bi-telephone" },
  ]

  const services = [
    {
      icon: "bi-heart-pulse",
      title: "Khám bệnh tổng quát",
      description: "Khám sức khỏe định kỳ và chẩn đoán bệnh cho thú cưng",
      color: "#667eea",
    },
    {
      icon: "bi-shield-plus",
      title: "Tiêm phòng",
      description: "Tiêm phòng đầy đủ các loại vaccine cần thiết",
      color: "#764ba2",
    },
    {
      icon: "bi-scissors",
      title: "Phẫu thuật",
      description: "Phẫu thuật chuyên nghiệp với trang thiết bị hiện đại",
      color: "#f093fb",
    },
    {
      icon: "bi-droplet",
      title: "Spa & Grooming",
      description: "Dịch vụ spa và làm đẹp cho thú cưng",
      color: "#f5576c",
    },
    {
      icon: "bi-house-heart",
      title: "Nhận nuôi",
      description: "Hỗ trợ tìm kiếm và nhận nuôi thú cưng",
      color: "#4facfe",
    },
    {
      icon: "bi-chat-heart",
      title: "Tư vấn dinh dưỡng",
      description: "Tư vấn chế độ dinh dưỡng phù hợp",
      color: "#43e97b",
    },
  ]

  const team = [
    {
      name: "Dr. Nguyễn Văn A",
      position: "Giám đốc & Bác sĩ trưởng",
      image: "/placeholder.svg?height=300&width=300",
      experience: "15 năm kinh nghiệm",
    },
    {
      name: "Dr. Trần Thị B",
      position: "Bác sĩ phẫu thuật",
      image: "/placeholder.svg?height=300&width=300",
      experience: "12 năm kinh nghiệm",
    },
    {
      name: "Dr. Lê Văn C",
      position: "Bác sĩ nội khoa",
      image: "/placeholder.svg?height=300&width=300",
      experience: "10 năm kinh nghiệm",
    },
    {
      name: "Dr. Phạm Thị D",
      position: "Bác sĩ da liễu",
      image: "/placeholder.svg?height=300&width=300",
      experience: "8 năm kinh nghiệm",
    },
  ]

  return (
    <>
      <style jsx>{`
        .about-page {
          overflow-x: hidden;
        }

        .hero-section {
          background: linear-gradient(135deg,rgb(232, 37, 21) 0%, #fd6316 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-image {
          position: relative;
          z-index: 2;
        }

        .hero-image img {
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .hero-image img:hover {
          transform: translateY(-10px);
        }

        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          color: rgba(255, 255, 255, 0.2);
          font-size: 2rem;
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon:nth-child(2) {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-icon:nth-child(3) {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .section {
          padding: 100px 0;
          position: relative;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          text-align: center;
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .mission-vision {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .mission-card, .vision-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
        }

        .mission-card:hover, .vision-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .mission-icon, .vision-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
          margin-bottom: 2rem;
        }

        .mission-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .vision-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .stats-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .stats-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E") repeat;
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
          position: relative;
          z-index: 2;
        }

        .stat-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
        }

        .stat-label {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .service-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .service-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: white;
          margin-bottom: 1.5rem;
        }

        .service-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }

        .service-description {
          color: #666;
          line-height: 1.6;
        }

        .team-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .team-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .team-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          overflow: hidden;
          border: 4px solid #f8f9fa;
        }

        .team-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .team-name {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .team-position {
          color: #667eea;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .team-experience {
          color: #666;
          font-size: 0.9rem;
        }

        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          opacity: 0.3;
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .btn-primary-custom {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border: none;
          padding: 15px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          color: white;
        }

        .btn-primary-custom:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(240, 147, 251, 0.4);
          color: white;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease;
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .section {
            padding: 60px 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .team-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }

          .cta-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="about-page">
        <Header></Header>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="floating-elements">
            <i className="bi bi-heart-pulse floating-icon"></i>
            <i className="bi bi-shield-plus floating-icon"></i>
            <i className="bi bi-house-heart floating-icon"></i>
          </div>

          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="hero-content">
                  <h1 className="hero-title">
                    Chăm Sóc Thú Cưng
                    <br />
                    <span style={{ color: "#f093fb" }}>Chuyên Nghiệp</span>
                  </h1>
                  <p className="hero-subtitle">
                    Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho những
                    người bạn bốn chân của bạn.
                  </p>
                  <a href="#services" className="btn-primary-custom">
                    Khám phá dịch vụ
                  </a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-image">
                  <img src="https://img.freepik.com/premium-vector/cute-corgi-tricolor-dog-cartoon-vector-illustration_42750-1072.jpg?w=826" alt="Pet Care" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section mission-vision">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mb-4">
                <div className={`mission-card animate-on-scroll ${isVisible["mission"] ? "visible" : ""}`} id="mission">
                  <div className="mission-icon">
                    <i className="bi bi-bullseye"></i>
                  </div>
                  <h3>Sứ mệnh</h3>
                  <p>
                    Mang đến dịch vụ chăm sóc sức khỏe toàn diện và chuyên nghiệp cho thú cưng, giúp chúng có cuộc sống
                    khỏe mạnh và hạnh phúc bên cạnh gia đình.
                  </p>
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <div className={`vision-card animate-on-scroll ${isVisible["vision"] ? "visible" : ""}`} id="vision">
                  <div className="vision-icon">
                    <i className="bi bi-eye"></i>
                  </div>
                  <h3>Tầm nhìn</h3>
                  <p>
                    Trở thành trung tâm chăm sóc thú cưng hàng đầu Việt Nam, được tin tưởng bởi chất lượng dịch vụ xuất
                    sắc và tình yêu thương dành cho động vật.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Services Section */}
        <section className="section" id="services">
          <div className="container">
            <h2 className="section-title">Dịch vụ của chúng tôi</h2>
            <p className="section-subtitle">Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe cho thú cưng</p>

            <div className="services-grid">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`service-card animate-on-scroll ${isVisible[`service-${index}`] ? "visible" : ""}`}
                  id={`service-${index}`}
                >
                  <div className="service-icon" style={{ background: service.color }}>
                    <i className={`bi ${service.icon}`}></i>
                  </div>
                  <h4 className="service-title">{service.title}</h4>
                  <p className="service-description">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section team-section">
          <div className="container">
            <h2 className="section-title">Đội ngũ chuyên gia</h2>
            <p className="section-subtitle">Đội ngũ bác sĩ thú y giàu kinh nghiệm và tận tâm</p>

            <div className="team-grid">
              {team.map((member, index) => (
                <div
                  key={index}
                  className={`team-card animate-on-scroll ${isVisible[`team-${index}`] ? "visible" : ""}`}
                  id={`team-${index}`}
                >
                  <div className="team-image">
                    <img src={member.image || "/placeholder.svg"} alt={member.name} />
                  </div>
                  <h4 className="team-name">{member.name}</h4>
                  <p className="team-position">{member.position}</p>
                  <p className="team-experience">{member.experience}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Sẵn sàng chăm sóc thú cưng của bạn?</h2>
              <p className="cta-subtitle">Liên hệ với chúng tôi ngay hôm nay để đặt lịch khám</p>
              <a href="/contact" className="btn-primary-custom">
                Đặt lịch ngay
              </a>
            </div>
          </div>
        </section>
        <Footer></Footer>
      </div>
    </>
  )
}

export default AboutPage

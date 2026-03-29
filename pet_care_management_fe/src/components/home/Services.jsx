import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';
import s1 from "../../assets/img/service/service_icon_1.png";
import s2 from "../../assets/img/service/service_icon_2.png";
import s3 from "../../assets/img/service/service_icon_3.png";

const ServiceCard = ({ icon, title, description, color, delay, index }) => {
    const { ref, isVisible } = useScrollReveal({ delay: delay });

    return (
        <div ref={ref} className="col-lg-4 col-md-6 mb-4"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.9)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
            }}
        >
            <div className="svc-card" style={{ '--card-color': color }}>
                <div className="svc-card-glow"></div>
                <div className="svc-icon-wrap">
                    <div className="svc-icon-bg">
                        <img src={icon} alt={title} />
                    </div>
                    <div className="svc-icon-ring"></div>
                </div>
                <h3 className="svc-title">{title}</h3>
                <p className="svc-desc">{description}</p>
                <div className="svc-number">0{index + 1}</div>
            </div>
        </div>
    );
};

const Services = () => {
    const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();

    const services = [
        {
            icon: s1,
            title: 'Chăm sóc thú cưng',
            description: 'Dịch vụ trông giữ thú cưng chất lượng cao với không gian thoải mái và chế độ chăm sóc tận tình, chu đáo.',
            color: '#7c5cfc'
        },
        {
            icon: s2,
            title: 'Thức ăn dinh dưỡng',
            description: 'Thực đơn đa dạng với các bữa ăn đầy đủ dinh dưỡng được thiết kế riêng cho từng loại thú cưng.',
            color: '#ff6ec7'
        },
        {
            icon: s3,
            title: 'Spa & Làm đẹp',
            description: 'Dịch vụ làm đẹp và chăm sóc sức khỏe toàn diện với quy trình chuyên nghiệp, hiện đại.',
            color: '#00c9a7'
        }
    ];

    return (
        <>
            <style>{`
        .services-section {
          padding: 100px 0 80px;
          background: #fafbff;
          position: relative;
          overflow: hidden;
        }
        .services-section::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(124,92,252,0.06) 0%, transparent 70%);
          border-radius: 50%;
        }
        .services-section::after {
          content: '';
          position: absolute;
          bottom: -150px; left: -150px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,110,199,0.05) 0%, transparent 70%);
          border-radius: 50%;
        }
        .svc-section-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 18px;
          background: linear-gradient(135deg, rgba(124,92,252,0.1), rgba(255,110,199,0.1));
          border: 1px solid rgba(124,92,252,0.2);
          border-radius: 50px;
          color: #7c5cfc; font-size: 13px; font-weight: 600;
          letter-spacing: 1.5px; text-transform: uppercase;
          margin-bottom: 16px;
        }
        .svc-section-title {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800; color: #1a1a2e;
          margin-bottom: 16px; letter-spacing: -0.5px;
        }
        .svc-section-subtitle {
          font-size: 18px; color: #666;
          max-width: 560px; margin: 0 auto 60px;
          line-height: 1.7;
        }
        .svc-card {
          position: relative;
          background: white;
          border-radius: 24px;
          padding: 48px 32px 40px;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.06);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          height: 100%;
        }
        .svc-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.1);
          border-color: var(--card-color);
        }
        .svc-card-glow {
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at center, var(--card-color), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .svc-card:hover .svc-card-glow {
          opacity: 0.04;
        }
        .svc-icon-wrap {
          position: relative;
          width: 100px; height: 100px;
          margin: 0 auto 28px;
        }
        .svc-icon-bg {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #f8f6ff, #fff);
          border-radius: 28px;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
          transition: all 0.4s ease;
          box-shadow: 0 8px 24px rgba(124,92,252,0.1);
        }
        .svc-card:hover .svc-icon-bg {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 12px 32px rgba(124,92,252,0.2);
        }
        .svc-icon-bg img {
          width: 50px; height: 50px;
          object-fit: contain;
        }
        .svc-icon-ring {
          position: absolute;
          top: -8px; left: -8px; right: -8px; bottom: -8px;
          border: 2px dashed rgba(124,92,252,0.2);
          border-radius: 32px;
          animation: spinRing 20s linear infinite;
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .svc-title {
          font-size: 22px; font-weight: 700;
          color: #1a1a2e; margin-bottom: 14px;
        }
        .svc-desc {
          font-size: 15px; color: #666;
          line-height: 1.7; margin: 0;
        }
        .svc-number {
          position: absolute;
          top: 20px; right: 24px;
          font-size: 48px; font-weight: 900;
          color: rgba(0,0,0,0.03);
          line-height: 1;
        }
        .svc-card:hover .svc-number {
          color: rgba(124,92,252,0.08);
        }
      `}</style>

            <div className="services-section">
                <div className="container">
                    <div ref={titleRef} className="text-center"
                        style={{
                            opacity: titleVisible ? 1 : 0,
                            transform: titleVisible ? 'translateY(0)' : 'translateY(40px)',
                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        <div className="svc-section-badge">
                            <i className="bi bi-stars"></i>
                            Dịch vụ của chúng tôi
                        </div>
                        <h2 className="svc-section-title">
                            Dịch vụ dành cho <span style={{
                                background: 'linear-gradient(135deg, #7c5cfc, #ff6ec7)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>mọi thú cưng</span>
                        </h2>
                        <p className="svc-section-subtitle">
                            Chúng tôi cung cấp các giải pháp chăm sóc toàn diện để thú cưng của bạn luôn khỏe mạnh và hạnh phúc.
                        </p>
                    </div>

                    <div className="row justify-content-center">
                        {services.map((service, index) => (
                            <ServiceCard key={index} {...service} delay={index * 150} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services;

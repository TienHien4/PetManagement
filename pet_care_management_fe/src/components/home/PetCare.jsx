import React from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';
import petCare from "../../assets/img/about/pet_care.png";

const PetCare = () => {
    const { ref: imgRef, isVisible: imgVisible } = useScrollReveal();
    const { ref: textRef, isVisible: textVisible } = useScrollReveal({ delay: 200 });

    const features = [
        { icon: 'bi-shield-check', title: 'An toàn tuyệt đối', desc: 'Thiết bị y tế hiện đại, vô trùng', color: '#7c5cfc' },
        { icon: 'bi-heart-pulse', title: 'Chăm sóc 24/7', desc: 'Đội ngũ luôn sẵn sàng mọi lúc', color: '#ff6ec7' },
        { icon: 'bi-award', title: 'Kinh nghiệm 10 năm+', desc: 'Hàng nghìn ca điều trị thành công', color: '#00c9a7' },
    ];

    return (
        <>
            <style>{`
        .petcare-section {
          padding: 100px 0;
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        .petcare-section::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(124,92,252,0.03) 0%, transparent 70%);
          border-radius: 50%;
        }
        .petcare-img-wrapper {
          position: relative;
          z-index: 2;
        }
        .petcare-img-frame {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.08);
        }
        .petcare-img-frame img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.6s ease;
        }
        .petcare-img-frame:hover img {
          transform: scale(1.05);
        }
        .petcare-img-decoration {
          position: absolute;
          top: -20px; left: -20px;
          width: 80px; height: 80px;
          border: 3px solid #7c5cfc;
          border-radius: 20px;
          opacity: 0.3;
          animation: floatDeco 5s ease-in-out infinite;
        }
        .petcare-img-decoration-2 {
          position: absolute;
          bottom: -16px; right: -16px;
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #ff6ec7, #7c5cfc);
          border-radius: 16px;
          opacity: 0.15;
          animation: floatDeco 5s ease-in-out infinite 1s;
        }
        @keyframes floatDeco {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(8px, -8px) rotate(5deg); }
        }
        .petcare-content {
          position: relative; z-index: 2;
        }
        .petcare-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 18px;
          background: linear-gradient(135deg, rgba(124,92,252,0.1), rgba(255,110,199,0.1));
          border: 1px solid rgba(124,92,252,0.2);
          border-radius: 50px;
          color: #7c5cfc; font-size: 13px; font-weight: 600;
          letter-spacing: 1.5px; text-transform: uppercase;
          margin-bottom: 16px;
        }
        .petcare-title {
          font-size: clamp(30px, 3.5vw, 42px);
          font-weight: 800; color: #1a1a2e;
          line-height: 1.2; margin-bottom: 20px;
        }
        .petcare-title span {
          background: linear-gradient(135deg, #7c5cfc, #ff6ec7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .petcare-desc {
          font-size: 16px; color: #666;
          line-height: 1.8; margin-bottom: 32px;
        }
        .petcare-features {
          display: flex; flex-direction: column;
          gap: 20px; margin-bottom: 40px;
        }
        .petcare-feature {
          display: flex; align-items: center; gap: 20px;
          padding: 22px 28px;
          background: #fafbff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.04);
          transition: all 0.3s ease;
        }
        .petcare-feature:hover {
          transform: translateX(8px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          border-color: rgba(124,92,252,0.2);
        }
        .petcare-feature-icon {
          width: 76px; height: 76px;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 34px; color: white; flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .petcare-feature-text h4 {
          font-size: 24px; font-weight: 700;
          color: #1a1a2e; margin-bottom: 6px;
        }
        .petcare-feature-text p {
          font-size: 17px; color: #888; margin: 0;
        }
        .petcare-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #7c5cfc, #6c4cf0);
          color: white; border-radius: 14px;
          font-size: 15px; font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(124,92,252,0.3);
        }
        .petcare-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124,92,252,0.45);
          color: white;
        }
        @media (max-width: 992px) {
          .petcare-img-wrapper { margin-bottom: 48px; }
          .petcare-content { text-align: center; }
          .petcare-features { align-items: center; }
          .petcare-feature { max-width: 400px; }
        }
      `}</style>

            <div className="petcare-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-md-6">
                            <div ref={imgRef} className="petcare-img-wrapper"
                                style={{
                                    opacity: imgVisible ? 1 : 0,
                                    transform: imgVisible ? 'translateX(0) scale(1)' : 'translateX(-60px) scale(0.95)',
                                    transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                <div className="petcare-img-decoration"></div>
                                <div className="petcare-img-frame">
                                    <img src={petCare} alt="Chăm sóc thú cưng" />
                                </div>
                                <div className="petcare-img-decoration-2"></div>
                            </div>
                        </div>
                        <div className="col-lg-6 offset-lg-1 col-md-6">
                            <div ref={textRef} className="petcare-content"
                                style={{
                                    opacity: textVisible ? 1 : 0,
                                    transform: textVisible ? 'translateX(0)' : 'translateX(60px)',
                                    transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                <div className="petcare-badge">
                                    <i className="bi bi-heart-fill"></i>
                                    Về chúng tôi
                                </div>
                                <h2 className="petcare-title">
                                    Chúng tôi chăm sóc<br />
                                    <span>như cách bạn yêu thương</span>
                                </h2>
                                <p className="petcare-desc">
                                    Với đội ngũ bác sĩ thú y giàu kinh nghiệm và cơ sở vật chất hiện đại,
                                    chúng tôi cam kết mang đến dịch vụ chăm sóc tốt nhất. Mỗi thú cưng đều
                                    được quan tâm như thành viên gia đình.
                                </p>

                                <div className="petcare-features">
                                    {features.map((f, i) => (
                                        <div key={i} className="petcare-feature" style={{
                                            opacity: textVisible ? 1 : 0,
                                            transform: textVisible ? 'translateX(0)' : 'translateX(40px)',
                                            transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 150}ms`
                                        }}>
                                            <div className="petcare-feature-icon" style={{ background: f.color }}>
                                                <i className={`bi ${f.icon}`}></i>
                                            </div>
                                            <div className="petcare-feature-text">
                                                <h4>{f.title}</h4>
                                                <p>{f.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link to="/about" className="petcare-cta">
                                    <i className="bi bi-arrow-right-circle-fill"></i>
                                    Tìm hiểu thêm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PetCare;

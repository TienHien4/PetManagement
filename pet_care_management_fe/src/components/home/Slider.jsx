import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dog from '../../assets/img/banner/dog.png';

const Slider = () => {
  const [loaded, setLoaded] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) {
      const interval = setInterval(() => {
        setTextIndex(prev => {
          if (prev >= 4) { clearInterval(interval); return 4; }
          return prev + 1;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [loaded]);

  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          min-height: 92vh;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(120, 80, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(255, 120, 200, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(80, 200, 255, 0.1) 0%, transparent 50%);
          z-index: 1;
        }
        .hero-particles {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1; overflow: hidden;
        }
        .hero-particle {
          position: absolute;
          border-radius: 50%;
          animation: floatParticle linear infinite;
        }
        @keyframes floatParticle {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) rotate(720deg); opacity: 0; }
        }
        .hero-content {
          position: relative; z-index: 10;
          padding: 0 5%; width: 100%;
        }
        .hero-brand-wrapper {
          text-align: center;
          margin-bottom: 40px;
          opacity: 0; transform: translateY(40px) scale(0.9);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-brand-wrapper.show { opacity: 1; transform: translateY(0) scale(1); }
        .hero-brand-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 80px; height: 80px;
          background: linear-gradient(135deg, #7c5cfc, #ff6ec7);
          border-radius: 24px;
          margin-bottom: 20px;
          box-shadow: 0 12px 40px rgba(124,92,252,0.4);
          animation: brandIconFloat 3s ease-in-out infinite;
        }
        @keyframes brandIconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .hero-brand-icon i {
          font-size: 36px; color: white;
        }
        .hero-brand-title {
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 900;
          letter-spacing: 6px;
          text-transform: uppercase;
          margin: 0;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 0%, #e0d4ff 40%, #7c5cfc 60%, #ff6ec7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: brandShine 4s linear infinite;
          text-shadow: none;
          filter: drop-shadow(0 0 30px rgba(124,92,252,0.3));
        }
        @keyframes brandShine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .hero-brand-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-top: 12px;
          font-weight: 400;
        }
        .hero-brand-line {
          width: 80px; height: 3px;
          background: linear-gradient(90deg, #7c5cfc, #ff6ec7);
          border-radius: 2px;
          margin: 16px auto 0;
          box-shadow: 0 0 16px rgba(124,92,252,0.5);
        }
        .hero-title {
          font-size: clamp(38px, 5vw, 68px);
          font-weight: 800; color: white;
          line-height: 1.12; margin-bottom: 24px; letter-spacing: -1px;
        }
        .hero-title-line {
          display: block; opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-title-line.show { opacity: 1; transform: translateY(0); }
        .hero-highlight {
          background: linear-gradient(135deg, #7c5cfc, #ff6ec7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-desc {
          font-size: 18px; color: rgba(255,255,255,0.7);
          line-height: 1.7; max-width: 520px; margin-bottom: 40px;
          opacity: 0; transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s;
        }
        .hero-desc.show { opacity: 1; transform: translateY(0); }
        .hero-buttons {
          display: flex; gap: 16px; flex-wrap: wrap;
          opacity: 0; transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s;
        }
        .hero-buttons.show { opacity: 1; transform: translateY(0); }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px;
          background: linear-gradient(135deg, #7c5cfc, #6c4cf0);
          color: white; border: none; border-radius: 16px;
          font-size: 16px; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(124,92,252,0.4);
        }
        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(124,92,252,0.6);
          color: white;
        }
        .hero-btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          color: white; border-radius: 16px;
          font-size: 16px; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-3px); color: white;
        }
        .hero-dog-wrapper {
          position: absolute; right: 2%; bottom: 0;
          z-index: 5; width: 45%; max-width: 650px;
          opacity: 0; transform: translateX(100px) scale(0.9);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
        }
        .hero-dog-wrapper.show { opacity: 1; transform: translateX(0) scale(1); }
        .hero-dog-glow {
          position: absolute; bottom: -20%; left: 50%;
          transform: translateX(-50%);
          width: 120%; height: 50%;
          background: radial-gradient(ellipse, rgba(124,92,252,0.3) 0%, transparent 70%);
          filter: blur(40px);
        }
        .hero-dog-wrapper img {
          width: 100%; height: auto;
          position: relative; z-index: 2;
          filter: drop-shadow(0 20px 60px rgba(0,0,0,0.3));
          animation: dogFloat 4s ease-in-out infinite;
        }
        @keyframes dogFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .hero-scroll-indicator {
          position: absolute; bottom: 30px; left: 50%;
          transform: translateX(-50%); z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5);
          font-size: 12px; letter-spacing: 2px;
          text-transform: uppercase;
          animation: fadeInUp 1s ease 1.5s both;
        }
        .scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; height: 40px; }
          50% { opacity: 1; height: 60px; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (max-width: 992px) {
          .hero-dog-wrapper { display: none; }
          .hero-content { text-align: center; }
          .hero-brand-title { font-size: 32px; letter-spacing: 3px; }
          .hero-desc { margin: 0 auto 40px; }
          .hero-buttons { justify-content: center; }
        }
      `}</style>

      <div className="hero-section">
        <div className="hero-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="hero-particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDuration: `${8 + Math.random() * 12}s`,
                animationDelay: `${Math.random() * 8}s`,
                background: i % 3 === 0 ? 'rgba(124,92,252,0.5)' : i % 3 === 1 ? 'rgba(255,110,199,0.4)' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <div className="container">
            {/* Big centered brand title */}
            <div className={`hero-brand-wrapper ${textIndex >= 0 ? 'show' : ''}`}>
              <div className="hero-brand-icon">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <h2 className="hero-brand-title">Veterinary Clinic</h2>
              <p className="hero-brand-sub">Hệ thống quản lý thú cưng chuyên nghiệp</p>
              <div className="hero-brand-line"></div>
            </div>

            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="hero-title">
                  <span className={`hero-title-line ${textIndex >= 1 ? 'show' : ''}`} style={{ transitionDelay: '0.2s' }}>
                    Chăm sóc thú cưng
                  </span>
                  <span className={`hero-title-line ${textIndex >= 2 ? 'show' : ''}`} style={{ transitionDelay: '0.4s' }}>
                    với <span className="hero-highlight">tình yêu</span> và
                  </span>
                  <span className={`hero-title-line ${textIndex >= 3 ? 'show' : ''}`} style={{ transitionDelay: '0.6s' }}>
                    sự tận tâm <span className="hero-highlight">chuyên nghiệp</span>
                  </span>
                </h1>
                <p className={`hero-desc ${textIndex >= 3 ? 'show' : ''}`}>
                  Đội ngũ bác sĩ thú y hàng đầu, cơ sở vật chất hiện đại,
                  dịch vụ chăm sóc toàn diện — tất cả vì sức khỏe và hạnh phúc
                  của thú cưng bạn yêu.
                </p>
                <div className={`hero-buttons ${textIndex >= 4 ? 'show' : ''}`}>
                  <Link to="/services" className="hero-btn-primary">
                    <i className="bi bi-heart-pulse-fill"></i>
                    Khám Phá Dịch Vụ
                  </Link>
                  <Link to="/contact" className="hero-btn-secondary">
                    <i className="bi bi-telephone-fill"></i>
                    Liên Hệ Ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`hero-dog-wrapper ${loaded ? 'show' : ''}`}>
          <div className="hero-dog-glow"></div>
          <img src={dog} alt="Chú chó đáng yêu" />
        </div>

        <div className="hero-scroll-indicator">
          <span>Cuộn xuống</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </>
  );
};

export default Slider;

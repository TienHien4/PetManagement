import React, { useEffect, useState } from 'react';
import useCountUp from '../../hooks/useCountUp';
import useScrollReveal from '../../hooks/useScrollReveal';

import axios from '../../services/customizeAxios';

const StatCard = ({ iconClass, value, label, suffix, color, gradient, delay }) => {
  const { count, ref: countRef } = useCountUp(value, 2000);
  const { ref: cardRef, isVisible } = useScrollReveal({ delay });

  return (
    <div ref={(el) => { cardRef.current = el; countRef.current = el; }}
      className="col-lg-4 col-md-4 col-6 mb-4"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.92)',
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
      }}
    >
      <div className="stat-glass-card" style={{ '--stat-color': color, '--stat-gradient': gradient }}>
        <div className="stat-bg-pattern"></div>
        <div className="stat-icon-wrapper" style={{ background: gradient }}>
          <i className={`bi ${iconClass}`} style={{ fontSize: 32, color: '#fff' }}></i>
        </div>
        <div className="stat-value-wrapper">
          <span className="stat-value">{count}</span>
          {suffix && <span className="stat-suffix">{suffix}</span>}
        </div>
        <div className="stat-label">{label}</div>
        <div className="stat-shimmer"></div>
      </div>
    </div>
  );
};

const AdoptUs = () => {
  const [dogAmount, setDogAmount] = useState(0);
  const [catAmount, setCatAmount] = useState(0);
  const [vetAmount, setVetAmount] = useState(0);
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: textRef, isVisible: textVisible } = useScrollReveal({ delay: 200 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPets = await axios.get('/api/pet/getAllPet');
        const allPets = Array.isArray(resPets.data) ? resPets.data : (Array.isArray(resPets) ? resPets : []);
        const dogs = allPets.filter(p => p.species && (p.species.toLowerCase().includes('chó') || p.species.toLowerCase().includes('dog')));
        const cats = allPets.filter(p => p.species && (p.species.toLowerCase().includes('mèo') || p.species.toLowerCase().includes('cat') || p.species.toLowerCase().includes('meo')));
        setDogAmount(dogs.length);
        setCatAmount(cats.length);

        const resVets = await axios.get('/api/vet/getAllVet');
        const allVets = Array.isArray(resVets.data) ? resVets.data : (Array.isArray(resVets) ? resVets : []);
        setVetAmount(allVets.length);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { iconClass: 'bi-clipboard2-pulse-fill', value: vetAmount, label: 'Bác sĩ thú y', suffix: '+', color: '#7c5cfc', gradient: 'linear-gradient(135deg, #7c5cfc, #a78bfa)', delay: 0 },
    { iconClass: 'bi-balloon-heart-fill', value: dogAmount, label: 'Chó đáng yêu', suffix: '', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', delay: 150 },
    { iconClass: 'bi-emoji-heart-eyes-fill', value: catAmount, label: 'Mèo dễ thương', suffix: '', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', delay: 300 },
  ];

  return (
    <>
      <style>{`
        .stats-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          position: relative;
          overflow: hidden;
        }
        .stats-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(124,92,252,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(255,110,199,0.1) 0%, transparent 50%);
        }
        .stats-left-content {
          position: relative; z-index: 2;
        }
        .stats-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 18px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50px;
          color: #e0d4ff; font-size: 13px; font-weight: 600;
          letter-spacing: 1.5px; text-transform: uppercase;
          margin-bottom: 20px;
        }
        .stats-title {
          font-size: clamp(32px, 4vw, 46px);
          font-weight: 800; color: white;
          line-height: 1.2; margin-bottom: 20px;
        }
        .stats-title span {
          background: linear-gradient(135deg, #7c5cfc, #ff6ec7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stats-desc {
          font-size: 17px; color: rgba(255,255,255,0.65);
          line-height: 1.8; margin-bottom: 32px;
          max-width: 440px;
        }
        .stats-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #7c5cfc, #6c4cf0);
          color: white; border-radius: 14px;
          font-size: 15px; font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(124,92,252,0.35);
        }
        .stats-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124,92,252,0.5);
          color: white;
        }

        /* Cards */
        .stat-glass-card {
          position: relative;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 36px 24px 32px;
          text-align: center;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-glass-card:hover {
          transform: translateY(-8px);
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .stat-bg-pattern {
          position: absolute;
          top: -50%; right: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at center, var(--stat-color), transparent 70%);
          opacity: 0.04;
        }
        .stat-icon-wrapper {
          width: 80px; height: 80px;
          margin: 0 auto 24px;
          border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .stat-glass-card:hover .stat-icon-wrapper {
          transform: scale(1.1) rotate(-5deg);
        }
        .stat-value-wrapper {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 64px;
          font-weight: 900;
          background: var(--stat-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .stat-suffix {
          font-size: 36px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
        }
        .stat-label {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }
        .stat-shimmer {
          position: absolute;
          top: 0; left: -100%; right: 0; bottom: 0;
          width: 60%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          animation: shimmerSlide 4s ease-in-out infinite;
        }
        @keyframes shimmerSlide {
          0% { left: -100%; }
          50% { left: 150%; }
          100% { left: 150%; }
        }
        @media (max-width: 992px) {
          .stats-left-content { text-align: center; margin-bottom: 48px; }
          .stats-desc { margin: 0 auto 32px; }
        }
      `}</style>

      <div className="stats-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="stats-left-content">
                <div ref={titleRef} style={{
                  opacity: titleVisible ? 1 : 0,
                  transform: titleVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <div className="stats-badge">
                    <i className="bi bi-graph-up-arrow" style={{ color: '#7c5cfc' }}></i>
                    Con số ấn tượng
                  </div>
                  <h2 className="stats-title">
                    Chúng tôi cần<br />
                    <span>sự giúp đỡ</span> của bạn
                  </h2>
                </div>
                <div ref={textRef} style={{
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <p className="stats-desc">
                    Hãy cùng chung tay mang lại mái ấm cho những chú thú cưng bị bỏ rơi.
                    Mỗi sự giúp đỡ của bạn sẽ thay đổi cuộc đời của chúng.
                  </p>
                  <a href="/contact" className="stats-cta">
                    <i className="bi bi-heart-fill"></i>
                    Liên hệ ngay
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="row">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdoptUs;

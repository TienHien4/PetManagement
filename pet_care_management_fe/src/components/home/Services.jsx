// components/Services.js
import React from 'react';
import s1 from "../../assets/img/service/service_icon_1.png";
import s2 from "../../assets/img/service/service_icon_2.png";
import s3 from "../../assets/img/service/service_icon_3.png";
import '../../assets/css/style.css';

const Services = () => {
  const services = [
    {
      icon: s1,
      title: 'Chăm sóc thú cưng',
      description: 'Dịch vụ trông giữ thú cưng chất lượng cao với không gian thoải mái và chế độ chăm sóc tận tình'
    },
    {
      icon: s2,
      title: 'Thức ăn dinh dưỡng',
      description: 'Thực đơn đa dạng với các bữa ăn đầy đủ dinh dưỡng được thiết kế riêng cho từng loại thú cưng',
      active: true
    },
    {
      icon: s3,
      title: 'Spa thú cưng',
      description: 'Dịch vụ làm đẹp và chăm sóc sức khỏe toàn diện với quy trình chuyên nghiệp'
    }
  ];

  return (
    <div className="service_area">
      <div className="container" style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ width: "100%" }} className="row justify-content-center">
          <div className="col-lg-7 col-md-10">
            <div className="section_title text-center mb-95">
              <h3>Dịch vụ dành cho mọi chú chó</h3>
              <p>Chúng tôi cung cấp các giải pháp chăm sóc toàn diện để thú cưng của bạn luôn khỏe mạnh và hạnh phúc.</p>
            </div>
          </div>
        </div>
        <br></br>
        <div className="row justify-content-center">
          {services.map((service, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div className={`single_service ${service.active ? 'active' : ''}`}>
                <div className="service_thumb service_icon_bg_1 d-flex align-items-center justify-content-center">
                  <div className="service_icon">
                    <img src={service.icon} alt={service.title} />
                  </div>
                </div>
                <div className="service_content text-center">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
// components/PetCare.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/style.css';
import petCare from "../../assets/img/about/pet_care.png";

const PetCare = () => {
  return (
    <div className="pet_care_area">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 col-md-6">
            <div className="pet_thumb">
              <img src={petCare} alt="Chăm sóc thú cưng" />
            </div>
          </div>
          <div className="col-lg-6 offset-lg-1 col-md-6">
            <div className="pet_info">
              <div className="section_title">
                <h3>
                  <span>Chúng tôi chăm sóc thú cưng </span><br />
                  Như cách bạn yêu thương
                </h3>
                <p>
                  Với đội ngũ bác sĩ thú y giàu kinh nghiệm và cơ sở vật chất hiện đại,<br />
                  chúng tôi cam kết mang đến dịch vụ chăm sóc tốt nhất cho thú cưng.<br />
                  Mỗi chú chó/mèo đều được quan tâm như thành viên gia đình.
                </p>
                <Link to="/gioi-thieu" className="boxed-btn3">Về chúng tôi</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCare;
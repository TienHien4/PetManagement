// components/Slider.js
import React from 'react';
import { Link } from 'react-router-dom';
import dog from '../../assets/img/banner/dog.png';

const Slider = () => {
  return (
    <div className="slider_area">
      <div className="single_slider slider_bg_1 d-flex align-items-center">
        <div className="container">
          <div className="row" style={{ width: "1320px" }}>
            <div className="col-lg-5 col-md-6">
              <div className="slider_text">

                <h4 style={{ fontSize: "40px", color: "white" }}>Chăm sóc thú cưng với tất cả tình yêu <br /> và sự tận tâm chuyên nghiệp.</h4>
                <br></br>
                <Link to="/lien-he" className="boxed-btn4">Liên Hệ Ngay</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="dog_thumb d-none d-lg-block">
          <img src={dog} alt="Chú chó đáng yêu" />
        </div>
      </div>
    </div>
  );
};

export default Slider;
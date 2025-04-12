import React, { useEffect, useState } from 'react';
import adapt_icon1 from '../../assets/img/adapt_icon/1.png';
import adapt_icon2 from '../../assets/img/adapt_icon/2.png';
import adapt_icon3 from '../../assets/img/adapt_icon/3.png';
import axios from '../../services/customizeAxios'
import '../../assets/css/style.css';

const AdoptUs = () => {
  const [dt, setDt] = useState([])
  const [dogAmount, setDogAmount] = useState(0)
  const [catAmount, setCatAmount] = useState(0)

  useEffect(() => {

    const fetchData = async (accessToken) => {
      accessToken = localStorage.getItem("accessToken")
      const res = await axios.get('/api/pet/getPets/Dog', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setDogAmount(res.data.length)

      const res2 = await axios.get('/api/pet/getPets/Cat', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setCatAmount(res.data.length)
    }
    fetchData()
  }, [])


  return (
    <div className="adapt_area">
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-5">
            <div className="adapt_help">
              <div className="section_title">
                <h3>
                  <span>Chúng tôi cần</span>
                  <br></br>
                  sự giúp đỡ của bạn
                </h3>
                <p>
                  Hãy cùng chung tay mang lại mái ấm cho những chú thú cưng bị bỏ rơi.
                  Mỗi sự giúp đỡ của bạn sẽ thay đổi cuộc đời của chúng.
                </p>
                <a href="lien-he.html" className="boxed-btn3">
                  Liên hệ ngay
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="adapt_about">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-6">
                  <div className="single_adapt text-center">
                    <img style={{ width: "100px", height: "90px" }} src={adapt_icon1} alt="Biểu tượng thú cưng" />
                    <div className="adapt_content">
                      <h3 className="counter">55</h3>
                      <p>Bác sĩ</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="single_adapt text-center">
                    <img v src={adapt_icon2} alt="Biểu tượng gia đình" />
                    <div className="adapt_content">
                      <h3>
                        <span className="counter">{dogAmount}</span>
                      </h3>
                      <p>Chó</p>
                    </div>
                  </div>
                  <div className="single_adapt text-center">
                    <img style={{ width: "90px", height: "80px" }} src={adapt_icon3} alt="Biểu tượng tình nguyện viên" />
                    <div className="adapt_content">
                      <h3>
                        <span className="counter">{catAmount}</span>
                      </h3>
                      <p>Mèo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptUs;
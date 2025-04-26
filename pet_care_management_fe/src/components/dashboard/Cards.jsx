import React, { useEffect, useState } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/css/Cards.css";
import axios from '../../services/customizeAxios'

function Cards() {
  const [userActive, setUserActive] = useState(0)
  const [petAmount, setPetAmount] = useState(0)
  const [vetAmount, setVetAmount] = useState(0)
  const accessToken = localStorage.getItem("accessToken")

  useEffect(() => {
    const fetchData1 = async () => {
      const res1 = await axios.get("/api/pet/getAllPet", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setPetAmount(res1.data.length)

      // const res2 = await axios.get("/api/user/getAll", {
      //   headers: {Authorization: `Bearer ${accessToken}`}
      // })
      // setPetAmount(res1.data.length)
      const res3 = await axios.get("/api/vet/getAllVet", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setVetAmount(res3.data.length)

    }
    fetchData1()
  }, [])

  return (
    <div className="dashboard">
      <div className="card">
        <i className="fas fa-paw icon pink"></i>
        <div className="text">
          <span className="value">{petAmount}</span>
          <span className="label">Thú cưng đã đăng ký</span>
        </div>
      </div>
      <div className="card">
        <i className="fas fa-user icon white"></i>
        <div className="text">
          <span className="value">-</span>
          <span className="label">Khách hàng đang hoạt động</span>
        </div>
      </div>
      <div className="card">
        <i className="fas fa-user-md icon green"></i>
        <div className="text">
          <span className="value">{vetAmount}</span>
          <span className="label">Bác sĩ thú y</span>
        </div>
      </div>
    </div>
  );
}

export default Cards;

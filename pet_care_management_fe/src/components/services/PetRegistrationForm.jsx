import React, { useState } from 'react';
import '../../assets/css/PetRegistrationForm.css';
import axios from '../../services/customizeAxios';

const PetRegistrationForm = () => {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [petSpecies, setPetSpecies] = useState("")
  const [services, setServices] = useState("")
  const [date, setDate] = useState("")
  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {

      const res = await axios.post("/api/appointment/createAppointment",
        {
          name,
          phoneNumber,
          petSpecies,
          services,
          date
        },
        {
          header: { Authorization: `Bearer ${accessToken}` },
        })
      console.log(res.data);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="body">

      <div className="container">
        <div className="form-box">
          <h2>ĐĂNG KÝ KHÁM TƯ VẤN CHĂM SÓC THÚ CƯNG</h2>
          <p>Vui lòng điền thông tin để được hỗ trợ. Chúng tôi sẽ liên hệ lại ngay!</p>
          <form>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên"
              required
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Số điện thoại"
              required
            />
            <select name="pet-type" value={petSpecies} onChange={(e) => setPetSpecies(e.target.value)} required>
              <option value="" disabled selected>Loại thú cưng</option>
              <option value="cho">Chó</option>
              <option value="meo">Mèo</option>
            </select>
            <select name="service" value={services} onChange={(e) => setServices(e.target.value)} required>
              <option value="" disabled selected>Dịch vụ</option>
              <option value="kham">Khám</option>
              <option value="tiem-phong">Tiêm phòng</option>
              <option value="spa">Spa</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Ngày khám (dd/mm/yyyy)"
              required
            />
            <button onClick={handleSubmit}>Đăng ký</button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default PetRegistrationForm;
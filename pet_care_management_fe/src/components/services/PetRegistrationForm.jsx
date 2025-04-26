import React, { useState } from 'react';
import '../../assets/css/PetRegistrationForm.css';
import axios from '../../services/customizeAxios';

const PetRegistrationForm = () => {
  const userID = localStorage.getItem("Id")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [petSpecies, setPetSpecies] = useState("")
  const [services, setServices] = useState([])
  const [date, setDate] = useState("")
  const [vetId, setVetId] = useState(1)
  const [userId, setUserId] = useState(Number(userID))

  const handleSubmit = async (e) => {

    e.preventDefault()

    const accessToken = localStorage.getItem("accessToken")
    try {

      const res = await axios.post("/api/appointment/createAppointment",
        {
          name,
          email,
          petSpecies,
          services,
          date,
          vetId,
          userId
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <select name="pet-type" value={petSpecies} onChange={(e) => setPetSpecies(e.target.value)} required>
              <option value="" disabled selected>Loại thú cưng</option>
              <option value="cho">Chó</option>
              <option value="meo">Mèo</option>
            </select>
            <div className="services-checkbox-group" style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
              <label style={{ fontWeight: "bold", fontSize: "16px", marginRight: "30px", color: "white", minWidth: "80px" }}>
                Dịch vụ:
              </label>
              {['Khám bệnh', 'Tiêm phòng', 'Spa'].map((service, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginRight: "40px" }}>
                  <input
                    type="checkbox"
                    id={`service-${index}`}
                    value={service}
                    checked={services.includes(service)}
                    onChange={() => {
                      if (services.includes(service)) {
                        setServices(services.filter(s => s !== service));
                      } else {
                        setServices([...services, service]);
                      }
                    }}
                    style={{ transform: "scale(1.4)", marginRight: "10px", cursor: "pointer" }}
                  />
                  <label htmlFor={`service-${index}`} style={{ fontWeight: "bold", fontSize: "15px", color: "white", cursor: "pointer" }}>
                    {service}
                  </label>
                </div>
              ))}
            </div>


            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Ngày khám (dd/mm/yyyy)"
              required
            />
            <input
              type="number"
              value={vetId}
              onChange={(e) => setVetId(e.target.value)}
              placeholder="Mã bác sĩ"
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
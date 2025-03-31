import React, { useState } from 'react';
import './CreatePetForm.css';
import axios from '../services/customizeAxios';
import { useNavigate } from 'react-router-dom';

const CreatePetForm = () => {
  const [name, setName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const navigate = useNavigate()
  
  const handleCreate = async () => {
    
    try {
      const res = await axios.post("/api/pet/create", {
        name,
        ownerId,
        species,
        breed,
        dob,
        gender,
        weight,
        age,
      });
      console.log(res.data);
      navigate("/admin/petmanagement")
    } catch (error) {
      console.error("Error creating pet:", error);
      // Xử lý lỗi (hiển thị thông báo lỗi)
    }
  };

  return (
    <div className="pet-form-container">
      <h1 className="form-title">Thêm thú cưng</h1>
      
      <div className="form-section">
        <div className="input-group">
          <div className="input-field">
            <label>Tên thú cưng</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>Chủ sở hữu</label>
            <input 
              type="number" 
              value={ownerId} 
              onChange={(e) => setOwnerId(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="input-group">
          <div className="input-field">
            <label>Loại thú cưng</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              <option value="">Lựa chọn</option>
              <option value="dog">Chó</option>
              <option value="cat">Mèo</option>
            </select>
          </div>
          <div className="input-field">
            <label>Giống</label>
            <input 
              type="text" 
              value={breed} 
              onChange={(e) => setBreed(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <div className="input-group">
          <div className="input-field">
            <label>Ngày sinh</label>
            <input 
              type="date" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>Giới tính</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Lựa chọn</option>
              <option value="male">Đực</option>
              <option value="female">Cái</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <div className="input-group">
          <div className="input-field">
            <label>Cân nặng (kg)</label>
            <input 
              type="number" 
              step="0.1" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>Tuổi</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <button className="submit-button" onClick={handleCreate}>
        Thêm thú cưng
      </button>
    </div>
  );
};

export default CreatePetForm;
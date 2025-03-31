
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterComponent = () => {

const navigate = useNavigate();
  const [name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 


  const handleCreate = async () => {
    const response = await axios.post("http://localhost:8080/create", {
        name,
        password,
    })
    console.log(response)
    if(response && response.data){
        setUserName('')
        setPassword('')
        setErrorMessage("Success")
        navigate('/')

    }else{
        setErrorMessage("Error")
    }

  }


    return (
        <div>
            <form onSubmit={handleCreate}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        <br />
        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setUserName(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          required
        />
        <br />

        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          required
        />
        <br />

     
        {errorMessage && (
          <div
            style={{
              color: "red",
              marginBottom: "15px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </div>
        )}

        <button
          style={{
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>
        </div>
    );
};

export default RegisterComponent;
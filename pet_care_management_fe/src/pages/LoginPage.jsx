import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); 



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !password) {
      setErrorMessage("Username and password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/login", {
        userName,
        password,
      });
      const roles = response.data.roles;
     console.log(response)
     localStorage.setItem("UserName", response.data.userName);

      if (response.data.message !== "Login success!") {
        setErrorMessage(response.data.message || "Login failed!");
        return;
      }
      console.log(response.data.roles)
      if (roles.includes("ADMIN")) {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setErrorMessage("");
        navigate("/admin");

    }
    
      if (roles.includes("USER")) {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setErrorMessage("");
        navigate("/home");
    }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      setErrorMessage(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {


    window.location.href = "http://localhost:8080/oauth2/authorization/google";
    
};
const handleFacebookLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
};




  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://laputafarm.com/wp-content/uploads/2022/12/Samoyed.jpg"
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit}>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i
                            className="fas fa-cubes fa-2x me-3"
                            style={{ color: "#ff6219" }}
                          ></i>
                          <span className="h1 fw-bold mb-0">Logo</span>
                        </div>

                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: "1px" }}
                        >
                          Sign into your account
                        </h5>

                        <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example17">
                           UserName
                           </label>
                          <input
                            type="text"
                            placeholder="Enter your username"
                             value={userName}
                             onChange={(e) => setUserName(e.target.value)}
                            id="form2Example17"
                            className="form-control form-control-lg"
                          />
                         
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example27">
                            Password
                          </label>
                          <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="form2Example27"
                            className="form-control form-control-lg"
                          />
                          
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-dark btn-lg btn-block"
                         
                          >
                            Login
                          </button>
                        </div>

                        <a className="small text-muted" href="#!">
                          Forgot password?
                        </a>
                        <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                          Don't have an account?{" "}
                          <a href="/register" style={{ color: "#393f81" }}>
                            Register here
                          </a>
                        </p>
       
                      </form>
                      <button onClick={handleFacebookLogin} data-mdb-ripple-init class="btn btn-primary btn-lg btn-block" style={{backgroundColor: "#3b5998", width: "280px", marginBottom: "10px"}} href="#!"
            role="button">
            <i class="fab fa-facebook-f me-2"></i>Continue with Facebook
          </button>
          <br></br>
          <button onClick={handleGoogleLogin} data-mdb-ripple-init class="btn btn-primary btn-lg btn-block" style={{backgroundColor: "#55acee", width: "280px"}} href="#!"
            role="button">
            <i class="fab fa-google me-2"></i>Continue with Google</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import axios from "axios";
import '../assets/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate()

    const handleRegister = async () => {
        if (password !== repeatPassword) {
            setError("Passwords do not match!");
            return;
        }
        setError(""); // Xóa lỗi nếu có

        try {
            const res = await axios.post("http://localhost:8080/api/user/create", {
                userName,
                password,
                email
            });
            console.log("User registered:", res.data);
            navigate("/login")
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
    <section class="vh-100" style={{backgroundColor: "#eee"}}>
        <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-lg-12 col-xl-11">
                    <div className="card text-black" style={{ borderRadius: "25px" }}>
                        <div className="card-body p-md-5">
                            <div className="row justify-content-center">
                                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                                        Sign up
                                    </p>

                                    <form className="mx-1 mx-md-4">
                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} />
                                                <label className="form-label">Your Name</label>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                <label className="form-label">Your Email</label>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                <label className="form-label">Password</label>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="password" className="form-control" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                                                <label className="form-label">Repeat your password</label>
                                            </div>
                                        </div>

                                        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

                                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <button type="button" className="btn btn-primary btn-lg" onClick={handleRegister}>
                                                Register
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                    <img src="https://img.freepik.com/premium-vector/cute-corgi-tricolor-dog-cartoon-vector-illustration_42750-1072.jpg?w=826"
                                        className="img-fluid" alt="Sample image"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
    );
};

export default RegisterPage;

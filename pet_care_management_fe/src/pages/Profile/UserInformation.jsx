import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/profile.css";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import axios from '../../services/customizeAxios'

function UserInformation() {
    const idUser = localStorage.getItem("Id")
    const [email, setEmail] = useState("")
    const [userName, setUserName] = useState("")
    const [gender, setGender] = useState("")
    const [dob, setDob] = useState("")
    const [password, setPassword] = useState("")
    const [id, setId] = useState(idUser)
    const accessToken = localStorage.getItem("accessToken")

    useEffect(() => {
        const fetchUserInfor = async (accessToken) => {
            try {
                const res = await axios.get(`api/user/getInfor/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                console.log(res.data)
                setEmail(res.data.email)
                setUserName(res.data.userName)
                const date = new Date(res.data.dob);
                const formattedDob = date.toISOString().split('T')[0];
                setDob(formattedDob);
                setPassword(res.data.password)
                setGender(res.data.gender)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserInfor(accessToken)
    }, [])
    const handleUpdate = async (e) => {
        // e.preventDefault();
        try {
            const res = await axios.post(`/api/user/updateUser/${id}`,
                {
                    email: email,
                    userName: userName,
                    dob: dob,
                    password: password,
                    gender: gender
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            console.log(res.data)
            setEmail(res.data.email)
            const date = new Date(res.data.dob);
            const formattedDob = date.toISOString().split('T')[0];
            setDob(formattedDob);
            setGender(res.data.gender)
            setUserName(res.data.userName)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="profile">
            <Header />
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div className="main-content">
                    <div className="user-information">
                        <h1>Thông tin tài khoản</h1>

                        <form className="user-form">
                            <div className="form-group">
                                <label>Họ tên</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <div className="email-wrapper">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Ngày sinh</label>
                                <div className="date-wrapper">
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div >
                                <label>Giới tính</label>
                                <div>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={gender === "male"}
                                                onChange={(e) => setGender(e.target.value)}
                                            />
                                            Nam
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={gender === "female"}
                                                onChange={(e) => setGender(e.target.value)}
                                            />
                                            Nữ
                                        </label>

                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="update-btn"
                                onClick={handleUpdate}
                            >
                                Cập nhật
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UserInformation;
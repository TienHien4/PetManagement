import React from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/profile.css";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

function PetList() {
    return (
        <div className="profile">
            <Header></Header>
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div className="main-content">
                    <div className="pet-list">
                        <h1>Danh Sách Thú Cưng</h1>
                        <p className="subtitle">Danh sách các thú cưng bạn đang sở hữu</p>

                        <table className="pet-table">
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Loài</th>
                                    <th>Giống</th>
                                    <th>Tuổi</th>
                                    <th>Cân nặng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Dog1</td>
                                    <td>Chó</td>
                                    <td>Poodle</td>
                                    <td>2</td>
                                    <td>5 kg</td>
                                </tr>
                                <tr>
                                    <td>Cat1</td>
                                    <td>Mèo</td>
                                    <td>Ba Tư</td>
                                    <td>1</td>
                                    <td>3 kg</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <Footer></Footer>
        </div>
    );
}

export default PetList;

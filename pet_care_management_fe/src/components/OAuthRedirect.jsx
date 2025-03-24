import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Gọi API lấy token & user
                const response = await axios.get("http://localhost:8080/oauth2/success", {
                    withCredentials: true, 
                });

                console.log("API Response:", response.data); // Debug dữ liệu

                const { token, user } = response.data;

                if (!token || !user) {
                    throw new Error("Dữ liệu không hợp lệ");
                }

                // Lưu vào localStorage
                localStorage.setItem("accessToken", token);
                localStorage.setItem("UserName", user.name);
                localStorage.setItem("user", JSON.stringify(user));

                console.log("User:", user); // Debug dữ liệu user

                // Chuyển hướng tùy theo quyền của user
                if (user.roles && user.roles.includes("ADMIN")) {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            } catch (error) {
                console.error("OAuth2 Login Failed:", error);
                navigate("/login");
            }
        };

    fetchUserData();
  }, [navigate]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default OAuthRedirect;

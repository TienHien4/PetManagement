import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Đặt baseURL của API
  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.request.use(
  (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    console.log("Token expire!");
    console.log(error.response)

    if (error.response && error.response.status === 401) {
      try {
        console.log("call refresh token");
        const result = await axios.post("http://localhost:8080/refreshToken", {
          token: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken")
        });
        console.log(result); 
  
           const newAccessToken = result.data.token;
           localStorage.setItem("accessToken", newAccessToken);
           const newRefreshToken = result.data.token;
           localStorage.setItem("refreshToken", newRefreshToken);
           originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
           return await apiClient(originalConfig);
          } catch(err) {
            if(err.response && err.response.status === 403){
              console.log(err);
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
              window.location.href = "/login";

            }
            
            return await Promise.reject(err);
          }
    } 
    return await Promise.reject(error);
    
  }
);

export default apiClient;

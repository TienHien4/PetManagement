"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../../services/customizeAxios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const EditPetForm = () => {
    const { petId } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [userId, setUserId] = useState("")
    const [species, setSpecies] = useState("")
    const [breed, setBreed] = useState("")
    const [dob, setDob] = useState("")
    const [gender, setGender] = useState("")
    const [weight, setWeight] = useState("")
    const [age, setAge] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [existingImageUrl, setExistingImageUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            window.location.href = "/login"
            return
        }

        fetchPetData(accessToken)
    }, [petId])

    const fetchPetData = async (accessToken) => {
        setIsLoadingData(true)
        try {
            const response = await axios.get(`/api/pet/${petId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            const petData = response.data
            console.log("Pet data:", petData)

            // Fill form with existing data
            setName(petData.name || "")
            setUserId(petData.userId?.toString() || "")
            setSpecies(petData.species || "")
            setBreed(petData.breed || "")
            setDob(petData.dob || "")
            setGender(petData.gender || "")
            setWeight(petData.weight?.toString() || "")
            setAge(petData.age?.toString() || "")
            setExistingImageUrl(petData.image || "")
            setImagePreview(petData.image || null)

        } catch (error) {
            console.error("Error fetching pet data:", error)
            alert("Không thể tải thông tin thú cưng!")
            navigate("/user/pets")
        } finally {
            setIsLoadingData(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert("Kích thước ảnh không được vượt quá 5MB!");
                e.target.value = null;
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF!");
                e.target.value = null;
                return;
            }

            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setImagePreview(existingImageUrl);
        }
    }

    const handleUpdate = async () => {
        // Validation
        if (!name.trim()) {
            alert("Vui lòng nhập tên thú cưng!");
            return;
        }

        if (!species) {
            alert("Vui lòng chọn loại thú cưng!");
            return;
        }

        setIsLoading(true);
        try {
            const accessToken = localStorage.getItem("accessToken");

            const petRequest = {
                name: name.trim(),
                userId: userId ? parseInt(userId) : null,
                species,
                breed: breed.trim() || null,
                dob: dob || null,
                gender: gender || null,
                weight: weight ? parseFloat(weight) : null,
                age: age ? parseInt(age) : 0,
            };

            const formData = new FormData();
            formData.append("petRequest", JSON.stringify(petRequest));

            if (image) {
                formData.append("imageFile", image);
            }

            const res = await axios.post(`/api/pet/update/${petId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`
                },
            });

            console.log("Pet updated successfully:", res.data);
            alert("Cập nhật thú cưng thành công!");
            navigate("/user/pets");
        } catch (error) {
            console.error("Error updating pet:", error);

            let errorMessage = "Cập nhật thú cưng thất bại!";

            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!";
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
            } else if (error.request) {
                errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!";
            } else {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCancel = () => {
        navigate("/user/pets")
    }

    if (isLoadingData) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted fs-5">Đang tải thông tin thú cưng...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <style jsx>{`
        .pet-form-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .form-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
        }

        .form-header {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 2rem;
          text-align: center;
          position: relative;
        }

        .form-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="10" cy="90" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }

        .form-header h1 {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .form-header .subtitle {
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
          font-size: 1.1rem;
          position: relative;
          z-index: 1;
        }

        .form-body {
          padding: 2.5rem;
        }

        .section-title {
          color: #333;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e9ecef;
          display: flex;
          align-items: center;
        }

        .section-title i {
          margin-right: 0.5rem;
          color: #4facfe;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #555;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .form-label i {
          margin-right: 0.5rem;
          color: #6c757d;
        }

        .form-control {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-control:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
          background: white;
        }

        .form-select {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-select:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
          background: white;
        }

        .image-upload-area {
          border: 2px dashed #dee2e6;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          background: #f8f9fa;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .image-upload-area:hover {
          border-color: #4facfe;
          background: #e3f2fd;
        }

        .image-upload-area.has-image {
          border-color: #28a745;
          background: #d4edda;
        }

        .image-preview {
          max-width: 200px;
          max-height: 200px;
          border-radius: 10px;
          margin: 1rem auto;
          display: block;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .upload-icon {
          font-size: 3rem;
          color: #6c757d;
          margin-bottom: 1rem;
        }

        .upload-text {
          color: #6c757d;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .upload-hint {
          color: #adb5bd;
          font-size: 0.9rem;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .btn-primary-custom {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border: none;
          border-radius: 25px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .btn-primary-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
          background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
        }

        .btn-secondary-custom {
          background: #6c757d;
          border: none;
          border-radius: 25px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          transition: all 0.3s ease;
        }

        .btn-secondary-custom:hover {
          background: #5a6268;
          transform: translateY(-2px);
        }

        .loading-spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-body {
            padding: 1.5rem;
          }
          
          .form-header h1 {
            font-size: 2rem;
          }
          
          .button-group {
            flex-direction: column;
          }
        }
      `}</style>

            <div className="pet-form-container">
                <div className="container">
                    <div className="form-card">
                        <div className="form-header">
                            <h1>
                                <i className="bi bi-pencil-square me-3"></i>
                                Chỉnh Sửa Thú Cưng
                            </h1>
                            <p className="subtitle">Cập nhật thông tin thú cưng của bạn</p>
                        </div>

                        <div className="form-body">
                            {/* Thông tin cơ bản */}
                            <div className="mb-4">
                                <h3 className="section-title">
                                    <i className="bi bi-info-circle"></i>
                                    Thông tin cơ bản
                                </h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-tag"></i>
                                                Tên thú cưng
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Nhập tên thú cưng"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-person"></i>
                                                ID Chủ sở hữu
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={userId}
                                                onChange={(e) => setUserId(e.target.value)}
                                                placeholder="Nhập ID chủ sở hữu"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin giống loài */}
                            <div className="mb-4">
                                <h3 className="section-title">
                                    <i className="bi bi-collection"></i>
                                    Thông tin giống loài
                                </h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-list"></i>
                                                Loại thú cưng
                                            </label>
                                            <select className="form-select" value={species} onChange={(e) => setSpecies(e.target.value)}>
                                                <option value="">Chọn loại thú cưng</option>
                                                <option value="Chó">🐕 Chó</option>
                                                <option value="Mèo">🐱 Mèo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-award"></i>
                                                Giống
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={breed}
                                                onChange={(e) => setBreed(e.target.value)}
                                                placeholder="Nhập giống thú cưng"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin sinh học */}
                            <div className="mb-4">
                                <h3 className="section-title">
                                    <i className="bi bi-heart-pulse"></i>
                                    Thông tin sinh học
                                </h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-calendar"></i>
                                                Ngày sinh
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-gender-ambiguous"></i>
                                                Giới tính
                                            </label>
                                            <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                                                <option value="">Chọn giới tính</option>
                                                <option value="Đực">Đực</option>
                                                <option value="Cái">Cái</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-speedometer2"></i>
                                                Cân nặng (kg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="form-control"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                placeholder="0.0"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="bi bi-hourglass-split"></i>
                                                Tuổi
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                placeholder="Nhập tuổi"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upload ảnh */}
                            <div className="mb-4">
                                <h3 className="section-title">
                                    <i className="bi bi-camera"></i>
                                    Hình ảnh thú cưng
                                </h3>
                                <div className={`image-upload-area ${imagePreview ? "has-image" : ""}`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                        id="imageUpload"
                                    />
                                    <label htmlFor="imageUpload" style={{ cursor: "pointer", width: "100%" }}>
                                        {imagePreview ? (
                                            <div>
                                                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="image-preview" />
                                                <p className="upload-text mt-2">
                                                    <i className="bi bi-check-circle text-success me-2"></i>
                                                    {image ? "Ảnh mới đã được chọn" : "Ảnh hiện tại"} - Nhấp để thay đổi
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="upload-icon">
                                                    <i className="bi bi-cloud-upload"></i>
                                                </div>
                                                <p className="upload-text">Nhấp để chọn ảnh thú cưng</p>
                                                <p className="upload-hint">Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="button-group">
                                <button className="btn btn-secondary-custom" onClick={handleCancel} disabled={isLoading}>
                                    <i className="bi bi-x-circle me-2"></i>
                                    Hủy bỏ
                                </button>
                                <button className="btn btn-primary-custom" onClick={handleUpdate} disabled={isLoading}>
                                    {isLoading && <span className="loading-spinner"></span>}
                                    <i className="bi bi-check-circle me-2"></i>
                                    {isLoading ? "Đang cập nhật..." : "Cập nhật thú cưng"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditPetForm

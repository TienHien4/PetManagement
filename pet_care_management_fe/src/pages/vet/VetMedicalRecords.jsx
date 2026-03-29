import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaSyringe, FaClipboardList } from 'react-icons/fa';
import axios from 'axios';
import usePagination from '../../hooks/usePagination';
import VetPagination from '../../components/VetPagination';
import './VetMedicalRecords.css';

const VetMedicalRecords = () => {
    const [pets, setPets] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPet, setSelectedPet] = useState(null);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showVaccinationModal, setShowVaccinationModal] = useState(false);
    const [activeTab, setActiveTab] = useState('pets');

    // Form states
    const [recordForm, setRecordForm] = useState({
        petId: '',
        diagnosis: '',
        treatment: '',
        symptoms: '',
        veterinarian: '',
        clinic: '',
        notes: '',
        visitDate: new Date().toISOString().split('T')[0]
    });

    const [vaccinationForm, setVaccinationForm] = useState({
        petId: '',
        vaccineName: '',
        vaccinationDate: new Date().toISOString().split('T')[0],
        nextDueDate: '',
        veterinarian: '',
        clinic: '',
        batchNumber: '',
        notes: ''
    });

    useEffect(() => {
        fetchAllPets();
    }, []);

    const fetchAllPets = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');

        try {
            const response = await axios.get('http://localhost:8080/api/pet/getAllPet', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPets(response.data);
        } catch (error) {
            console.error('Error fetching pets:', error);
            alert('Không thể tải danh sách thú cưng');
        } finally {
            setLoading(false);
        }
    };

    const fetchPetMedicalRecords = async (petId) => {
        const token = localStorage.getItem('accessToken');

        try {
            const [recordsRes, vaccinationsRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/medical-records/pet/${petId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:8080/api/vaccinations/pet/${petId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setMedicalRecords(recordsRes.data);
            setVaccinations(vaccinationsRes.data);
        } catch (error) {
            console.error('Error fetching medical records:', error);
        }
    };

    const handleViewPetRecords = (pet) => {
        setSelectedPet(pet);
        fetchPetMedicalRecords(pet.id);
        setActiveTab('records');
    };

    const handleAddRecord = (pet) => {
        setSelectedPet(pet);
        setRecordForm({
            ...recordForm,
            petId: pet.id,
            veterinarian: localStorage.getItem('userName') || '',
            clinic: 'Veterinary Clinic'
        });
        setShowRecordModal(true);
    };

    const handleAddVaccination = (pet) => {
        setSelectedPet(pet);
        setVaccinationForm({
            ...vaccinationForm,
            petId: pet.id,
            veterinarian: localStorage.getItem('userName') || '',
            clinic: 'Veterinary Clinic'
        });
        setShowVaccinationModal(true);
    };

    const submitMedicalRecord = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!recordForm.diagnosis || recordForm.diagnosis.trim() === '') {
            alert('Vui lòng nhập chẩn đoán!');
            return;
        }
        if (!recordForm.visitDate) {
            alert('Vui lòng chọn ngày khám!');
            return;
        }

        const token = localStorage.getItem('accessToken');

        try {
            // Clean up data before sending
            const cleanedData = {
                ...recordForm,
                diagnosis: recordForm.diagnosis.trim(),
                treatment: recordForm.treatment ? recordForm.treatment.trim() : '',
                symptoms: recordForm.symptoms ? recordForm.symptoms.trim() : '',
                veterinarian: recordForm.veterinarian ? recordForm.veterinarian.trim() : '',
                clinic: recordForm.clinic ? recordForm.clinic.trim() : '',
                notes: recordForm.notes ? recordForm.notes.trim() : ''
            };

            const response = await axios.post('http://localhost:8080/api/medical-records', cleanedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                alert('Thêm hồ sơ khám bệnh thành công!');
                setShowRecordModal(false);
                fetchPetMedicalRecords(selectedPet.id);
                resetRecordForm();
            }
        } catch (error) {
            console.error('Error adding medical record:', error);
            if (error.response) {
                alert(error.response.data || 'Có lỗi xảy ra khi thêm hồ sơ khám bệnh');
            } else if (error.request) {
                alert('Đã xảy ra lỗi kết nối. Vui lòng thử lại!');
            } else {
                alert('Có lỗi xảy ra khi thêm hồ sơ khám bệnh');
            }
        }
    };

    const submitVaccination = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!vaccinationForm.vaccineName || vaccinationForm.vaccineName.trim() === '') {
            alert('Vui lòng nhập tên vaccine!');
            return;
        }
        if (!vaccinationForm.vaccinationDate) {
            alert('Vui lòng chọn ngày tiêm!');
            return;
        }

        const token = localStorage.getItem('accessToken');

        try {
            // Clean up data before sending
            const cleanedData = {
                ...vaccinationForm,
                vaccineName: vaccinationForm.vaccineName.trim(),
                veterinarian: vaccinationForm.veterinarian ? vaccinationForm.veterinarian.trim() : '',
                clinic: vaccinationForm.clinic ? vaccinationForm.clinic.trim() : '',
                batchNumber: vaccinationForm.batchNumber ? vaccinationForm.batchNumber.trim() : '',
                notes: vaccinationForm.notes ? vaccinationForm.notes.trim() : '',
                nextDueDate: vaccinationForm.nextDueDate || null
            };

            const response = await axios.post('http://localhost:8080/api/vaccinations', cleanedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                alert('Thêm lịch sử tiêm chủng thành công!');
                setShowVaccinationModal(false);
                fetchPetMedicalRecords(selectedPet.id);
                resetVaccinationForm();
            }
        } catch (error) {
            console.error('Error adding vaccination:', error);
            if (error.response) {
                alert(error.response.data || 'Có lỗi xảy ra khi thêm lịch sử tiêm chủng');
            } else if (error.request) {
                alert('Đã xảy ra lỗi kết nối. Vui lòng thử lại!');
            } else {
                alert('Có lỗi xảy ra khi thêm lịch sử tiêm chủng');
            }
        }
    };

    const resetRecordForm = () => {
        setRecordForm({
            petId: '',
            diagnosis: '',
            treatment: '',
            symptoms: '',
            veterinarian: '',
            clinic: '',
            notes: '',
            visitDate: new Date().toISOString().split('T')[0]
        });
    };

    const resetVaccinationForm = () => {
        setVaccinationForm({
            petId: '',
            vaccineName: '',
            vaccinationDate: new Date().toISOString().split('T')[0],
            nextDueDate: '',
            veterinarian: '',
            clinic: '',
            batchNumber: '',
            notes: ''
        });
    };

    // Pagination cho danh sách thú cưng
    const {
        currentItems: currentPets,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        paginate,
        resetToFirstPage
    } = usePagination(pets.filter(pet =>
        pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
    ), 9);

    return (
        <Container fluid className="vet-medical-records">
            <Row className="mb-4">
                <Col>
                    <h2 className="page-title">
                        <FaClipboardList className="me-2" />
                        Quản Lý Hồ Sơ Sức Khỏe
                    </h2>
                </Col>
            </Row>

            {/* Tabs */}
            <Row className="mb-4">
                <Col>
                    <div className="custom-tabs">
                        <button
                            className={`tab-button ${activeTab === 'pets' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pets')}
                        >
                            <FaSearch className="me-2" />
                            Danh Sách Thú Cưng
                        </button>
                        {selectedPet && (
                            <button
                                className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
                                onClick={() => setActiveTab('records')}
                            >
                                <FaClipboardList className="me-2" />
                                Hồ Sơ của {selectedPet.name}
                            </button>
                        )}
                    </div>
                </Col>
            </Row>

            {activeTab === 'pets' ? (
                <>
                    {/* Search Bar */}
                    <Row className="mb-4">
                        <Col md={6}>
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm theo tên thú cưng, loài, hoặc chủ nhân..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage(); }}
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* Pets List */}
                    <Row>
                        {currentPets.map(pet => (
                            <Col md={6} lg={4} key={pet.id} className="mb-4">
                                <Card className="pet-card">
                                    <Card.Body>
                                        <div className="pet-header">
                                            <div>
                                                <h5 className="pet-name">{pet.name}</h5>
                                                <p className="pet-species">
                                                    {pet.species === 'Dog' ? '🐕 Chó' : pet.species === 'Cat' ? '🐱 Mèo' : pet.species}
                                                    {pet.breed && ` - ${pet.breed}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pet-info">
                                            <div className="info-item">
                                                <strong>Chủ nhân:</strong> {pet.ownerName || 'N/A'}
                                            </div>
                                            <div className="info-item">
                                                <strong>Tuổi:</strong> {pet.age || 'N/A'} tuổi
                                            </div>
                                            <div className="info-item">
                                                <strong>Cân nặng:</strong> {pet.weight || 'N/A'} kg
                                            </div>
                                        </div>

                                        <div className="pet-actions">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleViewPetRecords(pet)}
                                            >
                                                <FaEye className="me-1" />
                                                Xem Hồ Sơ
                                            </Button>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleAddRecord(pet)}
                                            >
                                                <FaPlus className="me-1" />
                                                Thêm Khám Bệnh
                                            </Button>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() => handleAddVaccination(pet)}
                                            >
                                                <FaSyringe className="me-1" />
                                                Thêm Tiêm Chủng
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {totalItems === 0 && (
                        <Alert variant="info" className="text-center">
                            Không tìm thấy thú cưng nào
                        </Alert>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <VetPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={paginate}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            itemName="thú cưng"
                        />
                    )}
                </>
            ) : (
                <>
                    {/* Back button */}
                    <div style={{ marginBottom: 20 }}>
                        <Button variant="outline-secondary" onClick={() => setActiveTab('pets')}>
                            ← Quay lại danh sách
                        </Button>
                    </div>

                    {/* Hồ Sơ Khám Bệnh */}
                    <div style={{ border: '1px solid #dee2e6', borderRadius: 8, marginBottom: 24, background: '#fff', width: '100%' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '14px 20px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
                            borderBottom: '1px solid #dee2e6', borderRadius: '8px 8px 0 0'
                        }}>
                            <h5 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Hồ Sơ Khám Bệnh</h5>
                            <Button variant="success" size="sm" onClick={() => handleAddRecord(selectedPet)}>
                                <FaPlus className="me-1" /> Thêm Hồ Sơ Khám
                            </Button>
                        </div>
                        <div style={{ padding: '16px 20px' }}>
                            {medicalRecords.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', width: '15%' }}>Ngày Khám</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', width: '20%' }}>Chẩn Đoán</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', width: '35%' }}>Điều Trị</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', width: '30%' }}>Ghi Chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicalRecords.map((record, i) => (
                                            <tr key={record.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                <td style={{ padding: '12px 16px', textAlign: 'left', color: '#6c757d' }}>{record.visitDate ? new Date(record.visitDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                                <td style={{ padding: '12px 16px', textAlign: 'left' }}>{record.diagnosis}</td>
                                                <td style={{ padding: '12px 16px', textAlign: 'left' }}>{record.treatment}</td>
                                                <td style={{ padding: '12px 16px', textAlign: 'left', color: '#6c757d' }}>{record.notes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <Alert variant="info" className="mb-0">Chưa có hồ sơ khám bệnh</Alert>
                            )}
                        </div>
                    </div>

                    {/* Lịch Sử Tiêm Chủng */}
                    <div style={{ border: '1px solid #dee2e6', borderRadius: 8, marginBottom: 24, background: '#fff', width: '100%' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '14px 20px', background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                            borderBottom: '1px solid #dee2e6', borderRadius: '8px 8px 0 0'
                        }}>
                            <h5 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Lịch Sử Tiêm Chủng</h5>
                            <Button variant="info" size="sm" onClick={() => handleAddVaccination(selectedPet)}>
                                <FaSyringe className="me-1" /> Thêm Tiêm Chủng
                            </Button>
                        </div>
                        <div style={{ padding: '16px 20px' }}>
                            {vaccinations.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', width: '40%' }}>Tên Vaccine</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', width: '30%' }}>Ngày Tiêm</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', width: '30%' }}>Ngày Tiêm Lại</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vaccinations.map((vaccine, i) => (
                                            <tr key={vaccine.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                <td style={{ padding: '12px 16px', textAlign: 'left' }}>{vaccine.vaccineName}</td>
                                                <td style={{ padding: '12px 16px', textAlign: 'left', color: '#6c757d' }}>{vaccine.vaccinationDate ? new Date(vaccine.vaccinationDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                                <td style={{ padding: '12px 16px', textAlign: 'left', color: '#6c757d' }}>{vaccine.nextDueDate ? new Date(vaccine.nextDueDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <Alert variant="info" className="mb-0">Chưa có lịch sử tiêm chủng</Alert>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Add Medical Record Modal */}
            <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Hồ Sơ Khám Bệnh - {selectedPet?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitMedicalRecord}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày Khám *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={recordForm.visitDate}
                                        onChange={(e) => setRecordForm({ ...recordForm, visitDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bác Sĩ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={recordForm.veterinarian}
                                        onChange={(e) => setRecordForm({ ...recordForm, veterinarian: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Triệu Chứng</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={recordForm.symptoms}
                                onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Chẩn Đoán *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={recordForm.diagnosis}
                                onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Điều Trị *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={recordForm.treatment}
                                onChange={(e) => setRecordForm({ ...recordForm, treatment: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phòng Khám</Form.Label>
                            <Form.Control
                                type="text"
                                value={recordForm.clinic}
                                onChange={(e) => setRecordForm({ ...recordForm, clinic: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ghi Chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={recordForm.notes}
                                onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowRecordModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                Lưu Hồ Sơ
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Add Vaccination Modal */}
            <Modal show={showVaccinationModal} onHide={() => setShowVaccinationModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Lịch Sử Tiêm Chủng - {selectedPet?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitVaccination}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên Vaccine *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={vaccinationForm.vaccineName}
                                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, vaccineName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Số Lô</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={vaccinationForm.batchNumber}
                                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, batchNumber: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày Tiêm *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={vaccinationForm.vaccinationDate}
                                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, vaccinationDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày Tiêm Lại</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={vaccinationForm.nextDueDate}
                                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, nextDueDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bác Sĩ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={vaccinationForm.veterinarian}
                                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, veterinarian: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phòng Khám</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={vaccinationForm.clinic}
                                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, clinic: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Ghi Chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={vaccinationForm.notes}
                                onChange={(e) => setVaccinationForm({ ...vaccinationForm, notes: e.target.value })}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowVaccinationModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="info" type="submit">
                                Lưu Tiêm Chủng
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default VetMedicalRecords;

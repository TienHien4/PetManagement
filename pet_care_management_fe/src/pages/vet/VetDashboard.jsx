import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { FaCalendarAlt, FaUsers, FaCheckCircle, FaClock, FaEye, FaEdit, FaPaw, FaEnvelope, FaPhone, FaSearch, FaUser, FaHistory } from 'react-icons/fa';
import VetPagination from '../../components/VetPagination';
import usePagination from '../../hooks/usePagination';
import './VetDashboard.css';

const VetDashboard = () => {
    const [completedAppointments, setCompletedAppointments] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statistics, setStatistics] = useState({
        totalCustomers: 0,
        totalPets: 0,
        completedAppointments: 0,
        totalRevenue: 0
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sử dụng custom hook cho pagination
    const {
        currentItems: currentCustomers,
        totalPages,
        totalItems,
        currentPage,
        itemsPerPage,
        paginate,
        resetToFirstPage
    } = usePagination(filteredCustomers, 10);

    useEffect(() => {
        fetchCompletedAppointments();
    }, []);

    useEffect(() => {
        filterCustomers();
    }, [customerData, searchTerm]);

    const fetchCompletedAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token ? 'Available' : 'Missing');

            // Lấy tất cả appointments
            const response = await fetch('http://localhost:8080/api/vet-dashboard/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response status:', response.status);
            console.log('API Response headers:', response.headers);

            if (response.ok) {
                const data = await response.json();
                console.log('All appointments data:', data);
                console.log('Number of appointments:', data ? data.length : 0);
                setCompletedAppointments(data);

                // Xử lý dữ liệu để tạo danh sách khách hàng và thú cưng
                processCustomerData(data);
                calculateStatistics(data);
            } else {
                console.error('Failed to fetch appointments:', response.status, response.statusText);
                setCompletedAppointments([]);
                setCustomerData([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setCompletedAppointments([]);
            setCustomerData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching all appointments...');

            const response = await fetch('http://localhost:8080/api/vet-dashboard/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('All appointments response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('All appointments data:', data);
                console.log('Total appointments:', data ? data.length : 0);

                // In ra tất cả các status có sẵn
                if (data && data.length > 0) {
                    const statuses = [...new Set(data.map(apt => apt.status))];
                    console.log('Available statuses:', statuses);

                    data.forEach((apt, index) => {
                        console.log(`Appointment ${index + 1}:`, {
                            id: apt.id,
                            status: apt.status,
                            customerName: apt.customerName,
                            petName: apt.petName,
                            date: apt.date || apt.appointmentDate
                        });
                    });
                }

                const completed = data.filter(apt => apt.status === 'COMPLETED');
                console.log('Filtered completed appointments:', completed.length);

                setCompletedAppointments(completed);
                processCustomerData(completed);
                calculateStatistics(completed);
            } else {
                console.error('Failed to fetch all appointments:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching all appointments:', error);
        }
    };

    const processCustomerData = (appointments) => {
        const customerMap = new Map();

        appointments.forEach(appointment => {
            const customerId = appointment.userId || appointment.email;
            const customerEmail = appointment.email;

            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    id: customerId,
                    email: customerEmail,
                    name: appointment.customerName || appointment.userName || appointment.name || customerEmail?.split('@')[0] || 'N/A',
                    phone: appointment.customerPhone || 'N/A',
                    appointments: [],
                    pets: new Set(),
                    totalSpent: 0,
                    lastVisit: null
                });
            }

            const customer = customerMap.get(customerId);
            customer.appointments.push(appointment);

            // Thêm thông tin thú cưng nếu có - cải thiện để lấy thêm thông tin chi tiết
            if (appointment.petName) {
                const petInfo = {
                    id: appointment.petId || null,
                    name: appointment.petName,
                    type: appointment.petType || appointment.petSpecies || 'N/A',
                    breed: appointment.petBreed || 'N/A',
                    age: appointment.petAge || 'N/A',
                    weight: appointment.petWeight || 'N/A',
                    gender: appointment.petGender || 'N/A',
                    imageUrl: appointment.petImageUrl || null
                };

                // Sử dụng pet ID hoặc name làm key để tránh trùng lặp
                const petKey = appointment.petId || appointment.petName;
                customer.pets.add(JSON.stringify({ ...petInfo, key: petKey }));
            }

            // Tính tổng chi phí
            if (appointment.services && appointment.services.length > 0) {
                const appointmentCost = appointment.services.reduce((total, service) => total + (service.price || 0), 0);
                customer.totalSpent += appointmentCost;
            }

            // Cập nhật lần khám gần nhất
            const appointmentDate = new Date(appointment.date || appointment.appointmentDate);
            if (!customer.lastVisit || appointmentDate > new Date(customer.lastVisit)) {
                customer.lastVisit = appointment.date || appointment.appointmentDate;
            }
        });

        // Chuyển đổi Set thành Array cho pets và remove duplicate pets
        const customerArray = Array.from(customerMap.values()).map(customer => {
            const uniquePets = new Map();

            Array.from(customer.pets).forEach(petStr => {
                const pet = JSON.parse(petStr);
                const key = pet.key || pet.name;
                if (!uniquePets.has(key) || (pet.id && !uniquePets.get(key).id)) {
                    // Ưu tiên pet có ID, hoặc thêm pet mới nếu chưa có
                    uniquePets.set(key, pet);
                }
            });

            return {
                ...customer,
                pets: Array.from(uniquePets.values()).map(pet => {
                    const { key, ...petWithoutKey } = pet; // Remove the temporary key
                    return petWithoutKey;
                }),
                appointmentCount: customer.appointments.length
            };
        });

        // Sắp xếp theo lần khám gần nhất
        customerArray.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));

        setCustomerData(customerArray);
    };

    const calculateStatistics = (appointments) => {
        const uniqueCustomers = new Set(appointments.map(apt => apt.userId || apt.email)).size;
        const uniquePets = new Set(appointments.map(apt => apt.petName).filter(Boolean)).size;
        const totalRevenue = appointments.reduce((total, apt) => {
            if (apt.services) {
                return total + apt.services.reduce((sum, service) => sum + (service.price || 0), 0);
            }
            return total;
        }, 0);

        setStatistics({
            totalCustomers: uniqueCustomers,
            totalPets: uniquePets,
            completedAppointments: appointments.length,
            totalRevenue: totalRevenue
        });
    };

    const filterCustomers = () => {
        if (!searchTerm) {
            setFilteredCustomers(customerData);
            return;
        }

        const filtered = customerData.filter(customer =>
            (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.phone && customer.phone.includes(searchTerm)) ||
            customer.pets.some(pet =>
                pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.type.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        setFilteredCustomers(filtered);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const showCustomerDetail = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3">Đang tải dữ liệu khách hàng...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid style={{ width: '100%', maxWidth: 'none', padding: '20px' }}>
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h2 className="dashboard-title mb-1">
                                <FaUsers className="me-2 text-primary" />
                                Thông tin Khách hàng & Thú cưng
                            </h2>
                            <p className="text-muted mb-0">Quản lý khách hàng đã hoàn thành điều trị</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="stat-card stat-customers">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="stat-number">{statistics.totalCustomers}</h3>
                                    <p className="stat-label">Tổng khách hàng</p>
                                </div>
                                <FaUsers className="stat-icon" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stat-card stat-pets">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="stat-number">{statistics.totalPets}</h3>
                                    <p className="stat-label">Tổng thú cưng</p>
                                </div>
                                <FaPaw className="stat-icon" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stat-card stat-completed">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="stat-number">{statistics.completedAppointments}</h3>
                                    <p className="stat-label">Cuộc hẹn hoàn thành</p>
                                </div>
                                <FaCheckCircle className="stat-icon" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stat-card stat-revenue">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="stat-number">{statistics.totalRevenue.toLocaleString()}</h3>
                                    <p className="stat-label">Doanh thu (VNĐ)</p>
                                </div>
                                <FaCalendarAlt className="stat-icon" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <label className="form-label fw-bold">Tìm kiếm khách hàng</label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm theo email, tên, SĐT hoặc tên thú cưng..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        resetToFirstPage();
                                    }}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6} className="d-flex align-items-end justify-content-between">
                            <div>
                                <span className="fw-bold text-primary">
                                    <FaUsers className="me-2" />
                                    Hiển thị {filteredCustomers.length} / {customerData.length} khách hàng
                                </span>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Customer Table */}
            {filteredCustomers.length > 0 ? (
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '250px' }}>Khách hàng</th>
                                    <th style={{ width: '200px' }}>Liên hệ</th>
                                    <th style={{ width: '300px' }}>Thú cưng</th>
                                    <th style={{ width: '120px' }}>Số lần khám</th>
                                    <th style={{ width: '150px' }}>Tổng chi phí</th>
                                    <th style={{ width: '150px' }}>Lần khám cuối</th>
                                    <th style={{ width: '120px' }} className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCustomers.map((customer, index) => (
                                    <tr key={customer.id || index} className="customer-row">
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaUser className="me-2 text-primary" />
                                                <div>
                                                    <div className="fw-bold">{customer.name || customer.userName || customer.email?.split('@')[0] || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="d-flex align-items-center">
                                                    <FaEnvelope className="me-2 text-muted" style={{ fontSize: '12px' }} />
                                                    <span>{customer.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                {customer.pets.length > 0 ? (
                                                    customer.pets.slice(0, 2).map((pet, petIndex) => (
                                                        <div key={petIndex} className="mb-1">
                                                            <span className="fw-bold">{pet.name}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">Không có thông tin</span>
                                                )}
                                                {customer.pets.length > 2 && (
                                                    <small className="text-muted">+{customer.pets.length - 2} thú cưng khác</small>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-center">
                                                <Badge bg="info" className="fs-6">
                                                    {customer.appointmentCount}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-success">
                                                {customer.totalSpent.toLocaleString()} VNĐ
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="fw-bold">{formatDate(customer.lastVisit)}</div>
                                                <small className="text-muted">
                                                    <FaClock className="me-1" />
                                                    {new Date(customer.lastVisit).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </small>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => showCustomerDetail(customer)}
                                                title="Xem chi tiết"
                                            >
                                                <FaEye />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="text-center py-5">
                    <Card.Body>
                        <FaUsers size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">Không có khách hàng nào</h5>
                        <p className="text-muted">Chưa có khách hàng nào hoàn thành điều trị.</p>
                    </Card.Body>
                </Card>
            )}

            {/* Pagination Component */}
            <VetPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={paginate}
                itemName="khách hàng"
            />

            {/* Customer Detail Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCustomer && (
                        <Row>
                            <Col md={6}>
                                <Card className="h-100">
                                    <Card.Header>
                                        <h6 className="mb-0">
                                            <FaUser className="me-2" />
                                            Thông tin khách hàng
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <p><strong>Tên:</strong> {selectedCustomer.name}</p>
                                        <p><strong>Email:</strong> {selectedCustomer.email}</p>
                                        <p><strong>Điện thoại:</strong> {selectedCustomer.phone}</p>
                                        <p><strong>ID:</strong> {selectedCustomer.id}</p>
                                        <p><strong>Số lần khám:</strong> <Badge bg="info">{selectedCustomer.appointmentCount}</Badge></p>
                                        <p><strong>Tổng chi phí:</strong> <span className="fw-bold text-success">{selectedCustomer.totalSpent.toLocaleString()} VNĐ</span></p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="h-100">
                                    <Card.Header>
                                        <h6 className="mb-0">
                                            <FaPaw className="me-2" />
                                            Thú cưng
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        {selectedCustomer.pets.length > 0 ? (
                                            selectedCustomer.pets.map((pet, index) => (
                                                <div key={index} className="border rounded p-3 mb-3 bg-light">
                                                    <div className="d-flex align-items-start">
                                                        <div className="pet-avatar-container me-3">
                                                            {pet.image ? (
                                                                <img
                                                                    src={pet.image}
                                                                    alt={pet.name}
                                                                    className="rounded-circle"
                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', border: '2px solid #007bff' }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '60px',
                                                                        backgroundColor: '#e3f2fd',
                                                                        border: '2px solid #007bff'
                                                                    }}
                                                                >
                                                                    <FaPaw className="text-primary" style={{ fontSize: '24px' }} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <FaPaw className="me-2 text-primary" />
                                                                <h6 className="mb-0 fw-bold">{pet.name}</h6>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <small className="text-muted d-block">
                                                                        <strong>Loài:</strong> {pet.type}
                                                                    </small>
                                                                    <small className="text-muted d-block">
                                                                        <strong>Giống:</strong> {pet.breed}
                                                                    </small>
                                                                    {pet.age !== 'N/A' && (
                                                                        <small className="text-muted d-block">
                                                                            <strong>Tuổi:</strong> {pet.age}
                                                                        </small>
                                                                    )}
                                                                </div>
                                                                <div className="col-md-6">
                                                                    {pet.weight !== 'N/A' && (
                                                                        <small className="text-muted d-block">
                                                                            <strong>Cân nặng:</strong> {pet.weight} kg
                                                                        </small>
                                                                    )}
                                                                    {pet.gender !== 'N/A' && (
                                                                        <small className="text-muted d-block">
                                                                            <strong>Giới tính:</strong> {pet.gender}
                                                                        </small>
                                                                    )}
                                                                    {pet.id && (
                                                                        <small className="text-muted d-block">
                                                                            <strong>ID:</strong> #{pet.id}
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted">Không có thông tin thú cưng</p>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12} className="mt-3">
                                <Card>
                                    <Card.Header>
                                        <h6 className="mb-0">
                                            <FaHistory className="me-2" />
                                            Lịch sử khám ({selectedCustomer.appointmentCount} lần)
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {selectedCustomer.appointments.map((appointment, index) => (
                                                <div key={index} className="border rounded p-2 mb-2 bg-light">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <div className="fw-bold">{appointment.name}</div>
                                                            <small className="text-muted">
                                                                {formatDate(appointment.date || appointment.appointmentDate)}
                                                            </small>
                                                            {appointment.services && (
                                                                <div className="mt-1">
                                                                    {appointment.services.map((service, sIndex) => (
                                                                        <Badge key={sIndex} bg="secondary" className="me-1">
                                                                            {service.name}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-end">
                                                            {appointment.services && (
                                                                <div className="fw-bold text-success">
                                                                    {appointment.services
                                                                        .reduce((total, service) => total + (service.price || 0), 0)
                                                                        .toLocaleString()} VNĐ
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default VetDashboard;

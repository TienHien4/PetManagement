import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaFilter, FaCalendarAlt, FaUser, FaPaw, FaPhone, FaEnvelope, FaNotesMedical, FaEdit, FaEye, FaClock, FaCheckCircle, FaTimesCircle, FaUsers } from 'react-icons/fa';
import localStorageService from '../../services/localStorageService';
import customizeAxios from '../../services/customizeAxios';
import VetPagination from '../../components/VetPagination';
import usePagination from '../../hooks/usePagination';
import './VetAppointments.css';

const VetAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Sử dụng custom hook cho pagination
    const {
        currentItems: currentAppointments,
        totalPages,
        totalItems,
        currentPage,
        itemsPerPage,
        paginate,
        resetToFirstPage
    } = usePagination(filteredAppointments, 10);

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        filterAppointments();
    }, [appointments, filterStatus, searchTerm, selectedDate]);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/vet-dashboard/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Appointments data from API:', data);
                // Debug: Log first appointment structure
                if (data.length > 0) {
                    console.log('First appointment structure:', JSON.stringify(data[0], null, 2));
                    console.log('Available fields:', Object.keys(data[0]));
                }
                setAppointments(data);
            } else {
                console.error('Failed to fetch appointments:', response.status);
                setError('Không thể tải danh sách cuộc hẹn');
                setAppointments([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError('Lỗi kết nối tới server');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const filterAppointments = () => {
        let filtered = appointments;

        // Filter by status
        if (filterStatus !== 'ALL') {
            filtered = filtered.filter(app => app.status === filterStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(app =>
                (app.name && app.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (app.services && app.services.some(service =>
                    service.name.toLowerCase().includes(searchTerm.toLowerCase())
                )) ||
                (app.id && app.id.toString().includes(searchTerm))
            );
        }

        // Filter by date
        if (selectedDate) {
            filtered = filtered.filter(app => {
                const appointmentDate = new Date(app.appointmentDate).toISOString().split('T')[0];
                return appointmentDate === selectedDate;
            });
        }

        setFilteredAppointments(filtered);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { variant: 'warning', text: 'Chờ xử lý', icon: '⏳' },
            'CONFIRMED': { variant: 'info', text: 'Đã xác nhận', icon: '✅' },
            'COMPLETED': { variant: 'success', text: 'Hoàn thành', icon: '🎉' },
            'CANCELLED': { variant: 'danger', text: 'Đã hủy', icon: '❌' }
        };

        const config = statusConfig[status] || { variant: 'secondary', text: status, icon: '❓' };
        return (
            <Badge bg={config.variant} className="status-badge">
                <span className="me-1">{config.icon}</span>
                {config.text}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const showAppointmentDetail = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailModal(true);
    };

    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await customizeAxios.put(
                `/api/vet-dashboard/appointments/${appointmentId}/status?status=${newStatus}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                // Refresh appointments list
                await fetchAppointments();
                setShowDetailModal(false);
            }
        } catch (error) {
            console.error('Error updating appointment status:', error);
            setError('Không thể cập nhật trạng thái cuộc hẹn');
        } finally {
            setUpdating(false);
        }
    };

    const getAppointmentsByDate = () => {
        const groupedAppointments = {};
        filteredAppointments.forEach(appointment => {
            const date = new Date(appointment.appointmentDate).toLocaleDateString('vi-VN');
            if (!groupedAppointments[date]) {
                groupedAppointments[date] = [];
            }
            groupedAppointments[date].push(appointment);
        });
        return groupedAppointments;
    };

    const groupedAppointments = getAppointmentsByDate();

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3">Đang tải danh sách cuộc hẹn...</p>
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
                            <h2 className="page-title mb-1">
                                <FaCalendarAlt className="me-2 text-primary" />
                                Quản lý cuộc hẹn
                            </h2>
                            <p className="text-muted mb-0">Xem và quản lý tất cả cuộc hẹn của bạn</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Error Alert */}
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
                    <Alert.Heading>Lỗi!</Alert.Heading>
                    {error}
                </Alert>
            )}

            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="stat-card stat-total">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="stat-number">{appointments.length}</h3>
                                    <p className="stat-label">Tổng cuộc hẹn</p>
                                </div>
                                <FaCalendarAlt className="stat-icon" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stat-card stat-completed">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="stat-number">
                                        {appointments.filter(apt => apt.status === 'COMPLETED').length}
                                    </h3>
                                    <p className="stat-label">Hoàn thành</p>
                                </div>
                                <FaCheckCircle className="stat-icon" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stat-card stat-pending">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="stat-number">
                                        {appointments.filter(apt => apt.status === 'PENDING' || apt.status === 'CONFIRMED').length}
                                    </h3>
                                    <p className="stat-label">Đang xử lý</p>
                                </div>
                                <FaClock className="stat-icon" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stat-card stat-today">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="stat-number">
                                        {appointments.filter(apt => {
                                            const today = new Date().toDateString();
                                            const appointmentDate = new Date(apt.date || apt.appointmentDate).toDateString();
                                            return appointmentDate === today;
                                        }).length}
                                    </h3>
                                    <p className="stat-label">Hôm nay</p>
                                </div>
                                <FaCalendarAlt className="stat-icon" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <label className="form-label fw-bold">Tìm kiếm</label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm theo tên khách hàng, email hoặc ID..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        resetToFirstPage();
                                    }}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <label className="form-label fw-bold">Trạng thái</label>
                            <Form.Select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    resetToFirstPage();
                                }}
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="CONFIRMED">Đã xác nhận</option>
                                <option value="COMPLETED">Hoàn thành</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <label className="form-label fw-bold">Ngày</label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    resetToFirstPage();
                                }}
                            />
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button
                                variant="outline-secondary"
                                onClick={() => {
                                    setFilterStatus('ALL');
                                    setSearchTerm('');
                                    setSelectedDate('');
                                    resetToFirstPage();
                                }}
                                className="w-100"
                            >
                                <FaFilter className="me-1" />
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Results Summary */}
            <Row className="mb-3">
                <Col>
                    <div className="results-summary p-3 bg-light rounded">
                        <span className="fw-bold text-primary">
                            <FaCalendarAlt className="me-2" />
                            Hiển thị {filteredAppointments.length} / {appointments.length} cuộc hẹn
                        </span>
                        {filterStatus !== 'ALL' && (
                            <Badge bg="info" className="ms-2">
                                Lọc theo: {filterStatus}
                            </Badge>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Appointments Table */}
            {filteredAppointments.length > 0 ? (
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '100px' }}>Mã cuộc hẹn</th>
                                    <th style={{ width: '300px' }}>Tên khách hàng</th>
                                    <th style={{ width: '250px' }}>Email khách hàng</th>
                                    <th style={{ width: '180px' }}>Ngày hẹn</th>
                                    <th style={{ width: '150px' }}>Trạng thái</th>
                                    <th style={{ width: '250px' }}>Chi tiết dịch vụ</th>
                                    <th style={{ width: '120px' }}>Tổng tiền</th>
                                    <th style={{ width: '150px' }} className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAppointments.map((appointment) => (
                                    <tr key={appointment.id} className="appointment-row">
                                        <td>
                                            <span className="fw-bold text-primary">#{appointment.id}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaUser className="me-2 text-primary" />
                                                <div>
                                                    <div className="fw-bold text-dark">
                                                        {appointment.userName || appointment.customerName || appointment.user?.name || appointment.name?.split(' - ')[0] || appointment.name || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaEnvelope className="me-2 text-muted" style={{ fontSize: '14px' }} />
                                                <span>{appointment.email || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="fw-bold">
                                                    {formatDate(appointment.date)}
                                                </div>
                                                <small className="text-muted">
                                                    <FaClock className="me-1" />
                                                    {formatTime(appointment.date)}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            {getStatusBadge(appointment.status || 'PENDING')}
                                        </td>
                                        <td>
                                            <div>
                                                {appointment.services && appointment.services.length > 0 ? (
                                                    appointment.services.map((service, index) => (
                                                        <div key={index} className="mb-1">
                                                            <div className="fw-bold">{service.name}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">Không có chi tiết</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-success">
                                                {appointment.services && appointment.services.length > 0 ? (
                                                    `${appointment.services
                                                        .reduce((total, service) => total + (service.price || 0), 0)
                                                        .toLocaleString()} VNĐ`
                                                ) : (
                                                    'N/A'
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex gap-1 justify-content-center">
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    onClick={() => showAppointmentDetail(appointment)}
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye />
                                                </Button>
                                                {appointment.status === 'PENDING' && (
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                                                        title="Xác nhận"
                                                        disabled={updating}
                                                    >
                                                        <FaCheckCircle />
                                                    </Button>
                                                )}
                                                {(appointment.status === 'CONFIRMED' || appointment.status === 'PENDING') && (
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                                                        title="Hoàn thành"
                                                        disabled={updating}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                )}
                                            </div>
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
                        <FaCalendarAlt size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">Không có cuộc hẹn nào</h5>
                        <p className="text-muted">Hiện tại không có cuộc hẹn nào phù hợp với bộ lọc của bạn.</p>
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
                itemName="cuộc hẹn"
            />            {/* Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết cuộc hẹn #{selectedAppointment?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment && (
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
                                        <p><strong>Email:</strong> {selectedAppointment.email || 'N/A'}</p>
                                        <p><strong>User ID:</strong> {selectedAppointment.userId || 'N/A'}</p>
                                        <p><strong>VET được chỉ định:</strong> ID #{selectedAppointment.vetId || 'N/A'}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="h-100">
                                    <Card.Header>
                                        <h6 className="mb-0">
                                            <FaCalendarAlt className="me-2" />
                                            Thông tin cuộc hẹn
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <p><strong>ID cuộc hẹn:</strong> #{selectedAppointment.id}</p>
                                        <p><strong>Mô tả:</strong> {selectedAppointment.name}</p>
                                        <p><strong>Ngày & Giờ:</strong> {formatDateTime(selectedAppointment.date)}</p>
                                        <p><strong>Trạng thái:</strong> {getStatusBadge(selectedAppointment.status || 'PENDING')}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12} className="mt-3">
                                <Card>
                                    <Card.Header>
                                        <h6 className="mb-0">
                                            <FaPaw className="me-2" />
                                            Dịch vụ đã đặt
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        {selectedAppointment.services && selectedAppointment.services.length > 0 ? (
                                            <div>
                                                {selectedAppointment.services.map((service, index) => (
                                                    <div key={index} className="border rounded p-2 mb-2 bg-light">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>{service.name}</strong>
                                                                {service.description && (
                                                                    <div className="text-muted small">{service.description}</div>
                                                                )}
                                                            </div>
                                                            <div className="text-end">
                                                                {service.price && (
                                                                    <div className="fw-bold text-primary">
                                                                        {service.price.toLocaleString()} VNĐ
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="mt-3 text-end">
                                                    <strong>Tổng cộng: </strong>
                                                    <span className="fw-bold text-success">
                                                        {selectedAppointment.services
                                                            .reduce((total, service) => total + (service.price || 0), 0)
                                                            .toLocaleString()} VNĐ
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-muted">Không có thông tin dịch vụ chi tiết</div>
                                        )}

                                        {selectedAppointment.notes && (
                                            <div className="mt-3">
                                                <strong>Ghi chú:</strong>
                                                <div className="border rounded p-2 mt-1 bg-light">
                                                    {selectedAppointment.notes}
                                                </div>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex gap-2">
                        {selectedAppointment?.status === 'PENDING' && (
                            <Button
                                variant="success"
                                onClick={() => updateAppointmentStatus(selectedAppointment.id, 'CONFIRMED')}
                                disabled={updating}
                            >
                                {updating ? <Spinner size="sm" /> : <FaCheckCircle />} Xác nhận
                            </Button>
                        )}
                        {(selectedAppointment?.status === 'CONFIRMED' || selectedAppointment?.status === 'PENDING') && (
                            <Button
                                variant="primary"
                                onClick={() => updateAppointmentStatus(selectedAppointment.id, 'COMPLETED')}
                                disabled={updating}
                            >
                                {updating ? <Spinner size="sm" /> : <FaEdit />} Hoàn thành
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                            Đóng
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default VetAppointments;

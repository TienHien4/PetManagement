import React from 'react';
import { Card, Button } from 'react-bootstrap';

const VetPagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    itemName = "mục"
}) => {
    // Tính toán chỉ số hiển thị
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedItemsCount = Math.min(indexOfLastItem, totalItems);

    // Chỉ ẩn pagination nếu không có dữ liệu hoặc chỉ có 1 trang
    if (totalItems === 0 || totalPages <= 1) {
        return null;
    }

    return (
        <Card className="mt-3 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                    <small className="text-muted">
                        Trang {currentPage} / {totalPages}
                        ({totalItems} {itemName})
                    </small>
                </div>
                <div className="d-flex gap-1">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        « Trước
                    </Button>

                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map(number => (
                        <Button
                            key={number + 1}
                            variant={currentPage === number + 1 ? "primary" : "outline-primary"}
                            size="sm"
                            onClick={() => onPageChange(number + 1)}
                        >
                            {number + 1}
                        </Button>
                    ))}

                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Tiếp »
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default VetPagination;

import { useState, useMemo } from 'react';

const usePagination = (data, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Tính toán pagination
    const paginationData = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(data.length / itemsPerPage);

        return {
            currentItems,
            totalPages,
            totalItems: data.length,
            indexOfFirstItem,
            indexOfLastItem,
            currentPage,
            itemsPerPage
        };
    }, [data, currentPage, itemsPerPage]);

    // Function để chuyển trang
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= paginationData.totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Function để reset về trang 1 (dùng khi filter/search)
    const resetToFirstPage = () => {
        setCurrentPage(1);
    };

    return {
        ...paginationData,
        paginate,
        resetToFirstPage
    };
};

export default usePagination;

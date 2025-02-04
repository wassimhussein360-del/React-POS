import { Button, IconButton } from "@material-tailwind/react";
import React from "react";

interface PaginatorProps {
  itemsPerPage: number;
  dataSize: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  itemsPerPage,
  dataSize,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(dataSize / itemsPerPage);

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Determine the range of pages to show (5 pages max)
  const getPageRange = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    // Adjust range if near boundaries
    if (currentPage <= 3) {
      endPage = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-between w-full flex-col sm:flex-row gap-2">
      {/* Previous Button */}
      <Button
        variant="outlined"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center justify-center gap-2 w-full ">
        {currentPage > 3 && (
          <IconButton variant="text" size="sm" onClick={() => handlePageChange(1)}>
            1
          </IconButton>
        )}
        {currentPage > 4 && <span className="font-normal">...</span>}

        {getPageRange().map((page) => (
          <IconButton
            key={page}
            variant={page === currentPage ? "outlined" : "text"}
            size="sm"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </IconButton>
        ))}

        {currentPage < totalPages - 2 && <span className="font-normal">...</span>}
        {currentPage < totalPages - 3 && (
          <IconButton variant="text" size="sm" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </IconButton>
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="outlined"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Paginator;

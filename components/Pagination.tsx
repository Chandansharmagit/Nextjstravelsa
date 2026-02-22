"use client";

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-20">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-6 py-3 rounded-[30px] border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-600 hover:text-blue-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3 font-black uppercase tracking-widest text-[10px] h-font"
            >
                <FaChevronLeft className="text-[8px]" /> Previous
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 backdrop-blur-md rounded-[30px] border border-slate-200/50 shadow-inner">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400 font-bold">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`w-10 h-10 rounded-[15px] transition-all duration-300 font-black text-[10px] tracking-widest h-font flex items-center justify-center ${currentPage === page
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'text-slate-500 hover:bg-white hover:text-blue-600'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-6 py-3 rounded-[30px] border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-600 hover:text-blue-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3 font-black uppercase tracking-widest text-[10px] h-font"
            >
                Next <FaChevronRight className="text-[8px]" />
            </button>
        </div>
    );
};

export default Pagination;

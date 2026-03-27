"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from './Pagination';

interface TourPaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function TourPagination({ currentPage, totalPages }: TourPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`, { scroll: true });
    };

    return (
        <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
        />
    );
}

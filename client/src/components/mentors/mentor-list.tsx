import { Mentor } from "@shared/schema";
import MentorCard from "./mentor-card";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";

interface MentorListProps {
  mentors: Mentor[];
}

export default function MentorList({ mentors }: MentorListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of mentors per page
  
  // Calculate total pages
  const totalPages = Math.ceil(mentors.length / itemsPerPage);
  
  // Get current mentors
  const indexOfLastMentor = currentPage * itemsPerPage;
  const indexOfFirstMentor = indexOfLastMentor - itemsPerPage;
  const currentMentors = mentors.slice(indexOfFirstMentor, indexOfLastMentor);
  
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of mentor list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentMentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-pale"}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {/* Generate page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === page
                        ? "bg-green-medium text-white"
                        : "bg-white text-neutral-charcoal hover:bg-green-pale"
                    } border border-neutral-silver`}
                  >
                    {page}
                  </button>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-pale"}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

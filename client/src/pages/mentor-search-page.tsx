import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mentor } from "@shared/schema";
import MentorSearch from "@/components/mentors/mentor-search";
import MentorSearchResults from "@/components/mentors/mentor-search-results";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function MentorSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch mentors based on search term
  const { data: mentors, isLoading: searchLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors/search", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) {
        // Get all mentors if no search term
        const res = await fetch('/api/mentors');
        if (!res.ok) throw new Error("Failed to fetch mentors");
        return res.json();
      }
      
      // Use the API search endpoint for keyword searching
      const res = await fetch(`/api/mentors/search?keyword=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error("Failed to search mentors");
      return res.json();
    },
    staleTime: 60 * 1000, // 1 minute
  });

  // Fallback to loading all mentors when no search term is provided
  const { data: allMentors, isLoading: allMentorsLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
    enabled: !searchTerm.trim(),
    staleTime: 60 * 1000, // 1 minute
  });

  // Determine which mentors to display
  const displayMentors = searchTerm.trim() ? mentors || [] : allMentors || [];
  const isLoading = searchTerm.trim() ? searchLoading : allMentorsLoading;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-neutral-charcoal mb-2">Find Your Career Mentor</h1>
            <p className="text-neutral-slate">
              Connect with professionals from various career fields who can guide you on your journey
            </p>
          </div>

          <MentorSearch onSearch={handleSearch} />

          <div className="my-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-medium" />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-neutral-slate">
                    {displayMentors.length} {displayMentors.length === 1 ? 'mentor' : 'mentors'} found
                    {searchTerm && ` for "${searchTerm}"`}
                  </p>
                </div>

                {displayMentors.length === 0 ? (
                  <div className="py-12 text-center bg-white rounded-xl shadow-sm border border-neutral-silver">
                    <h3 className="text-xl font-medium text-neutral-charcoal mb-2">No mentors found</h3>
                    <p className="text-neutral-slate mb-4">
                      Try adjusting your search terms or browse all available mentors.
                    </p>
                  </div>
                ) : (
                  <MentorSearchResults 
                    mentors={displayMentors} 
                    searchTerm={searchTerm}
                    isLoading={false} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
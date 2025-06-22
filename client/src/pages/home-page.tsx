import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import CareerSearch from "@/components/home/career-search";
import CareerCategories from "@/components/home/career-categories";
import { useQuery } from "@tanstack/react-query";
import { Mentor, CareerCluster } from "@shared/schema";
import MentorList from "@/components/mentors/mentor-list";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [careerFilterId, setCareerFilterId] = useState<number | null>(null);
  const [showBackToAllResults, setShowBackToAllResults] = useState(false);

  // Fetch regular mentors for featured display
  const { data: mentors, isLoading: mentorsLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
  });

  // Fetch career clusters for related suggestions
  const { data: careerClusters } = useQuery<CareerCluster[]>({
    queryKey: ["/api/career-clusters"],
  });

  // Handle search queries when a keyword is entered
  const { data: searchResults, isLoading: searchLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors/search", searchKeyword],
    queryFn: async () => {
      if (!searchKeyword.trim()) return [];
      const res = await fetch(`/api/mentors/search?keyword=${encodeURIComponent(searchKeyword)}`);
      if (!res.ok) throw new Error("Failed to search mentors");
      return res.json();
    },
    enabled: searchKeyword.trim().length > 0,
  });
  
  // Handle filtered results by career cluster
  const filteredMentors = careerFilterId && searchResults 
    ? searchResults.filter(mentor => mentor.clusterId === careerFilterId)
    : searchResults;
  
  // Determine which mentors to display based on search state
  const displayMentors = searchKeyword.trim() 
    ? (careerFilterId ? filteredMentors : searchResults) || [] 
    : mentors || [];
  
  // Get related career clusters based on search results
  const relatedClusters = searchKeyword.trim() && searchResults && careerClusters
    ? Array.from(new Set(searchResults.map(mentor => mentor.clusterId)))
        .map(id => careerClusters.find(cluster => cluster.id === id))
        .filter(cluster => cluster !== undefined) as CareerCluster[]
    : [];
  
  // Update back button state
  useEffect(() => {
    setShowBackToAllResults(!!careerFilterId && searchKeyword.trim().length > 0);
  }, [careerFilterId, searchKeyword]);
  
  const isLoading = mentorsLoading || searchLoading;
  
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCareerFilterId(null); // Reset filter when new search is performed
  };
  
  const handleFilterByCareer = (clusterId: number) => {
    setCareerFilterId(clusterId);
  };
  
  const handleResetFilter = () => {
    setCareerFilterId(null);
  };
  
  // Get the name of the active career filter
  const activeFilterName = careerFilterId && careerClusters 
    ? careerClusters.find(c => c.id === careerFilterId)?.name 
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeroSection />
          <CareerSearch onSearch={handleSearch} />
          
          {/* Featured Mentors Section */}
          <section className="mb-12">
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-neutral-charcoal">
                  {searchKeyword.trim() 
                    ? `Search Results for "${searchKeyword}" (${displayMentors.length})`
                    : "Featured Mentors"}
                </h2>
                
                {showBackToAllResults && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-medium hover:text-green-dark"
                    onClick={handleResetFilter}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to all results
                  </Button>
                )}
              </div>
              
              {activeFilterName && (
                <div className="text-sm text-neutral-slate">
                  Filtered by career path: <span className="font-medium text-green-medium">{activeFilterName}</span>
                </div>
              )}
              
              {/* Career path filters */}
              {searchKeyword.trim() && relatedClusters.length > 1 && !careerFilterId && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm font-medium text-neutral-charcoal pt-2">Filter by career path:</span>
                  {relatedClusters.map(cluster => (
                    <Button
                      key={cluster.id}
                      variant="outline"
                      size="sm"
                      className="bg-green-pale border-green-medium text-neutral-charcoal hover:bg-green-medium hover:text-white"
                      onClick={() => handleFilterByCareer(cluster.id)}
                    >
                      <i className={`${cluster.iconName} mr-1`}></i>
                      {cluster.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-medium" />
              </div>
            ) : displayMentors.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl shadow-sm border border-neutral-silver">
                <h3 className="text-xl font-medium text-neutral-charcoal mb-2">No mentors found</h3>
                <p className="text-neutral-slate mb-4">
                  Try adjusting your search terms or explore our career categories below.
                </p>
                {careerFilterId && (
                  <Button
                    variant="outline"
                    className="border-green-medium text-green-medium hover:bg-green-pale hover:text-green-dark"
                    onClick={handleResetFilter}
                  >
                    Remove filter
                  </Button>
                )}
              </div>
            ) : (
              <MentorList mentors={displayMentors} />
            )}
          </section>
          
          <CareerCategories />
        </div>
      </main>
      <Footer />
    </div>
  );
}

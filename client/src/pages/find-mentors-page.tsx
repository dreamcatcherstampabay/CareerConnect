import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Mentor, CareerCluster } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MentorList from "@/components/mentors/mentor-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, UserX } from "lucide-react";

export default function FindMentorsPage() {
  const params = useParams<{ clusterId?: string }>();
  const clusterId = params.clusterId ? parseInt(params.clusterId) : undefined;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  
  // Get career cluster details if clusterId is provided
  const { data: cluster, isLoading: clusterLoading } = useQuery<CareerCluster>({
    queryKey: [`/api/career-clusters/${clusterId}`],
    enabled: !!clusterId,
  });
  
  // Get mentors filtered by cluster if provided
  const { data: mentors, isLoading: mentorsLoading } = useQuery<Mentor[]>({
    queryKey: clusterId ? [`/api/mentors/cluster/${clusterId}`] : ["/api/mentors"],
  });
  
  // Handle search queries
  const { data: searchResults, isLoading: searchLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await fetch(`/api/mentors/search?keyword=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Failed to search mentors");
      return res.json();
    },
    enabled: searchQuery.trim().length > 0,
  });
  
  const displayMentors = searchQuery.trim() 
    ? searchResults || [] 
    : mentors || [];
  
  // Sorting logic
  const sortedMentors = [...displayMentors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.yearsExperience - a.yearsExperience;
      default: // recommended
        return b.rating - a.rating; // Default to rating for now
    }
  });
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is handled by the query above
  };
  
  const isLoading = clusterLoading || mentorsLoading || searchLoading;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-neutral-charcoal mb-2">
              {cluster ? `${cluster.name} Mentors` : "Find Mentors"}
            </h1>
            <p className="text-lg text-neutral-slate">
              {cluster ? cluster.description : "Connect with experienced professionals in your field of interest."}
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-silver p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-grow">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-slate" />
                  <Input
                    type="text"
                    placeholder="Search by name, expertise or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" className="bg-green-medium hover:bg-green-dark">
                  Search
                </Button>
              </form>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-slate whitespace-nowrap">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Recommended" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Mentor Results */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-medium" />
            </div>
          ) : sortedMentors.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-xl shadow-sm border border-neutral-silver">
              <UserX className="mx-auto h-12 w-12 text-neutral-silver mb-4" />
              <h3 className="text-xl font-medium text-neutral-charcoal mb-2">No mentors found</h3>
              <p className="text-neutral-slate">
                {searchQuery 
                  ? `No results found for "${searchQuery}". Try a different search term.` 
                  : "No mentors available for this career path yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-neutral-charcoal">
                  {searchQuery 
                    ? `Search results for "${searchQuery}" (${sortedMentors.length})` 
                    : `Available Mentors (${sortedMentors.length})`}
                </h2>
              </div>
              
              <MentorList mentors={sortedMentors} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { CareerCluster } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

type CareerSearchProps = {
  onSearch: (keyword: string) => void;
};

export default function CareerSearch({ onSearch }: CareerSearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const [, navigate] = useLocation();
  
  // For suggested searches
  const [suggestedClusters, setSuggestedClusters] = useState<CareerCluster[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { data: careerClusters } = useQuery<CareerCluster[]>({
    queryKey: ["/api/career-clusters"],
  });
  
  // Advanced search with enhanced keyword matching
  const { data: searchResults } = useQuery<CareerCluster[]>({
    queryKey: ["/api/career-clusters/search", searchInput],
    queryFn: async () => {
      if (!searchInput.trim()) return [];
      const res = await fetch(`/api/career-clusters/search?keyword=${encodeURIComponent(searchInput)}`);
      if (!res.ok) throw new Error("Failed to search");
      return res.json();
    },
    enabled: searchInput.trim().length > 1,
  });
  
  // Update suggestions when search results change
  useEffect(() => {
    if (searchResults && searchResults.length > 0 && searchInput.trim().length > 1) {
      setSuggestedClusters(searchResults.slice(0, 3)); // Limit to top 3 results
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchResults, searchInput]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
    setShowSuggestions(false);
    
    if (searchInput.trim()) {
      navigate(`/explore-careers?search=${encodeURIComponent(searchInput)}`);
    }
  };
  
  // Select a suggested career cluster
  const handleSelectSuggestion = (cluster: CareerCluster) => {
    setSearchInput(cluster.name);
    onSearch(cluster.name);
    setShowSuggestions(false);
    navigate(`/find-mentors/${cluster.id}`);
  };
  
  // Get a sampling of clusters to display
  const popularClusters = careerClusters 
    ? [...careerClusters].sort(() => 0.5 - Math.random()).slice(0, 6)
    : [];
  
  // Generate icon component based on icon name string
  const renderIcon = (iconName: string) => {
    return <i className={`${iconName} text-2xl text-green-dark mb-2`}></i>;
  };
  
  return (
    <section className="mb-12">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-serif font-bold text-neutral-charcoal mb-6">Find Your Career Path</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-slate" />
              <Input 
                type="text" 
                placeholder="Search career keywords (e.g. coding, healthcare, design...)" 
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (e.target.value.trim().length > 1) {
                    setShowSuggestions(true);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                className="pl-10 py-6"
              />
              
              {/* Real-time search suggestions */}
              {showSuggestions && suggestedClusters.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-neutral-lighter rounded-md shadow-md max-h-60 overflow-auto">
                  {suggestedClusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      className="px-4 py-2 hover:bg-green-pale cursor-pointer flex items-center gap-3"
                      onClick={() => handleSelectSuggestion(cluster)}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-green-pale flex items-center justify-center">
                        <i className={`${cluster.iconName} text-lg text-green-medium`}></i>
                      </div>
                      <div>
                        <div className="font-medium">{cluster.name}</div>
                        <div className="text-xs text-neutral-slate truncate">
                          {cluster.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="bg-green-medium hover:bg-green-dark">
              Search
            </Button>
          </form>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutral-charcoal mb-4">Popular Career Clusters</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularClusters.map(cluster => (
                <Link key={cluster.id} href={`/find-mentors/${cluster.id}`}>
                  <div className="career-card bg-green-pale hover:bg-green-medium hover:text-white p-3 rounded-lg cursor-pointer transition duration-200 text-center flex flex-col items-center justify-center h-full min-h-[100px] overflow-hidden">
                    {renderIcon(cluster.iconName)}
                    <div className="text-xs sm:text-sm font-medium line-clamp-2 w-full">{cluster.name}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button variant="link" className="text-green-medium hover:text-green-dark" asChild>
                <Link href="/explore-careers">
                  <div className="flex items-center justify-center">
                    View All Career Clusters
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

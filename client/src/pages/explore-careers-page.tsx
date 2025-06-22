import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CareerCluster } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Briefcase } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function ExploreCareerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [, navigate] = useLocation();
  
  const { data: allClusters, isLoading } = useQuery<CareerCluster[]>({
    queryKey: ["/api/career-clusters"],
  });
  
  const { data: searchResults, isLoading: searchLoading } = useQuery<CareerCluster[]>({
    queryKey: ["/api/career-clusters/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await fetch(`/api/career-clusters/search?keyword=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Failed to search");
      return res.json();
    },
    enabled: searchQuery.trim().length > 0,
  });
  
  const displayClusters = searchQuery.trim() 
    ? searchResults || [] 
    : category === "all" 
      ? allClusters || [] 
      : (allClusters || []).filter(cluster => cluster.category === category);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is handled by the query above
  };
  
  const navigateToMentors = (clusterId: number) => {
    navigate(`/find-mentors/${clusterId}`);
  };
  
  // Generate icon component based on icon name string
  const renderIcon = (iconName: string) => {
    return <i className={`${iconName} text-2xl text-green-medium`}></i>;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-neutral-charcoal mb-4">Explore Career Paths</h1>
            <p className="text-lg text-neutral-slate">
              Discover career opportunities across various industries and connect with mentors to guide your journey.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-slate" />
                <Input
                  type="text"
                  placeholder="Search career keywords (e.g. coding, healthcare, design...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-base"
                />
              </div>
              <Button type="submit" className="bg-green-medium hover:bg-green-dark">
                Search
              </Button>
            </form>
          </div>
          
          {/* Category Filter */}
          <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="mb-8">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="all" className="px-6">All</TabsTrigger>
              <TabsTrigger value="florida" className="px-6">Florida Career Clusters</TabsTrigger>
              <TabsTrigger value="military" className="px-6">Military Careers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-neutral-charcoal">All Career Paths</h2>
                {searchQuery && searchResults && (
                  <span className="text-sm text-neutral-slate">
                    Found {searchResults.length} results for "{searchQuery}"
                  </span>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="florida" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-neutral-charcoal">Florida Career Clusters</h2>
                {searchQuery && searchResults && (
                  <span className="text-sm text-neutral-slate">
                    Found {searchResults.filter(c => c.category === 'florida').length} results for "{searchQuery}"
                  </span>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="military" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-neutral-charcoal">Military Career Paths</h2>
                {searchQuery && searchResults && (
                  <span className="text-sm text-neutral-slate">
                    Found {searchResults.filter(c => c.category === 'military').length} results for "{searchQuery}"
                  </span>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Career Clusters Grid */}
          {isLoading || searchLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-medium" />
            </div>
          ) : displayClusters.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-neutral-silver mb-4" />
              <h3 className="text-xl font-medium text-neutral-charcoal mb-2">No career paths found</h3>
              <p className="text-neutral-slate">
                {searchQuery 
                  ? `No results found for "${searchQuery}". Try a different search term.` 
                  : "No career paths available for this category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayClusters.map((cluster) => (
                <Card 
                  key={cluster.id}
                  className="hover:shadow-md transition-shadow cursor-pointer hover:border-green-medium h-full"
                  onClick={() => navigateToMentors(cluster.id)}
                >
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-start mb-3 mt-2">
                      <div className="h-10 w-10 rounded-md bg-green-pale flex items-center justify-center mr-3 flex-shrink-0">
                        {renderIcon(cluster.iconName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-neutral-charcoal line-clamp-2">{cluster.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gold-pale text-gold-dark rounded-full inline-block mt-1">
                          {cluster.category === 'florida' ? 'Florida' : 'Military'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-slate line-clamp-2 flex-grow">{cluster.description}</p>
                    <Button 
                      variant="link" 
                      className="text-green-medium hover:text-green-dark p-0 mt-2 h-auto w-fit"
                    >
                      Find mentors <i className="ri-arrow-right-line ml-1"></i>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

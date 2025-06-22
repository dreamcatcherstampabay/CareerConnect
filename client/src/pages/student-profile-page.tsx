import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { CareerKeyword, Mentor } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { clusterKeywords } from "@/data/clusterKeywords";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, X, Star, ExternalLink, Home } from "lucide-react";

// KeywordDropdown component for selecting from predefined keywords
const KeywordDropdown = ({ selectedKeywords, onSelectKeyword }: { selectedKeywords: string[], onSelectKeyword: (keyword: string) => void }) => {
  // Flatten the keywords from each cluster for dropdown options
  const keywordOptions = clusterKeywords.flatMap((cluster: { cluster: string; keywords: string[] }) => cluster.keywords);

  return (
    <div className="mt-4">
      <Label>Select Career Interest Keywords</Label>
      <select
        onChange={(e) => onSelectKeyword(e.target.value)}
        className="border rounded p-2 mt-1 w-full"
      >
        <option value="">-- Select a Keyword --</option>
        {keywordOptions.map((keyword: string, index: number) => (
          <option key={`keyword-${index}-${keyword}`} value={keyword}>
            {keyword}
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedKeywords.map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {keyword}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onSelectKeyword(keyword)} // Remove keyword on click
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Main StudentProfilePage component
export default function StudentProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // State management
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<CareerKeyword[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recommendedMentors, setRecommendedMentors] = useState<Mentor[]>([]);

  // -------------
  // QUERIES
  // -------------

  // Fetch all career keywords
  const {
    data: careerKeywords,
    isLoading: isLoadingKeywords,
  } = useQuery<CareerKeyword[]>({
    queryKey: ["/api/career-keywords"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Fetch mentors that match the current keywords
  const {
    data: mentors,
    isLoading: isLoadingMentors,
  } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Initialize selected keywords from user data when component loads
  useEffect(() => {
    if (user && user.careerKeywords) {
      setSelectedKeywords(user.careerKeywords);
    }
  }, [user]);
  
  // Update recommended mentors when keywords or mentors change
  useEffect(() => {
    if (!mentors || selectedKeywords.length === 0) {
      setRecommendedMentors([]);
      return;
    }
    
    // Find mentors that match at least one of the selected keywords
    const filtered = mentors.filter(mentor => {
      if (!mentor.keywords) return false;
      return mentor.keywords.some(keyword => 
        selectedKeywords.includes(keyword)
      );
    });
    
    // Sort by number of matching keywords (most matches first)
    const sorted = [...filtered].sort((a, b) => {
      const aMatches = a.keywords ? a.keywords.filter(k => selectedKeywords.includes(k)).length : 0;
      const bMatches = b.keywords ? b.keywords.filter(k => selectedKeywords.includes(k)).length : 0;
      return bMatches - aMatches;
    });
    
    // Take the top 3 recommended mentors
    setRecommendedMentors(sorted.slice(0, 3));
  }, [selectedKeywords, mentors]);

  // Search for keywords when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const fetchKeywords = async () => {
      setIsSearching(true);
      try {
        const res = await apiRequest(
          "GET",
          `/api/career-keywords/search?search=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await res.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching keywords:", error);
        toast({
          title: "Search Error",
          description: "Failed to search keywords",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchKeywords();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, toast]);

  // -------------
  // MUTATIONS
  // -------------

  // Update the student's keywords
  const updateKeywordsMutation = useMutation({
    mutationFn: async (keywords: string[]) => {
      const res = await apiRequest("PATCH", "/api/user/career-keywords", {
        keywords,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile Updated",
        description: "Your career keywords have been updated successfully.",
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create a new keyword
  const createKeywordMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const res = await apiRequest("POST", "/api/career-keywords", {
        keyword,
        clusterId: 1, // Default to first cluster, can be updated to be more dynamic
      });
      return res.json();
    },
    onSuccess: (newKeyword: CareerKeyword) => {
      queryClient.invalidateQueries({ queryKey: ["/api/career-keywords"] });
      handleAddKeyword(newKeyword.keyword);
      setNewKeyword("");
      toast({
        title: "Keyword Created",
        description: `"${newKeyword.keyword}" has been added.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create Keyword",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // -------------
  // EVENT HANDLERS
  // -------------

  // Add a keyword to selected keywords
  const handleAddKeyword = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  // Remove a keyword from selected keywords
  const handleRemoveKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
  };

  // Toggle behavior for keyword selection
  const handleSelectKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      handleRemoveKeyword(keyword);
    } else {
      handleAddKeyword(keyword);
    }
  };

  // Create a new keyword
  const handleCreateKeyword = () => {
    if (newKeyword.trim()) {
      createKeywordMutation.mutate(newKeyword.trim());
    }
  };

  // Save the selected keywords
  const handleSaveKeywords = () => {
    updateKeywordsMutation.mutate(selectedKeywords);
  };

  // Filter for displayed keywords in the dialog
  const displayedKeywords = searchQuery
    ? searchResults || []
    : careerKeywords || [];

  // -------------
  // RENDER
  // -------------

  return (
    <div className="container py-8">
      <div className="container py-8 bg-[#e5efe6]">
        <Link href="/">
          <Button 
            variant="outline" 
            className="mb-6 border-green-medium text-green-dark hover:bg-green-pale hover:border-green-dark"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8 text-[#1d4220]">
          Student Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <Card className="border border-[#71a875] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#3d8c42]">Personal Information</CardTitle>
              <CardDescription className="text-[#5f6a72]">
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-[#333333]">Name</Label>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#333333]">Username</Label>
                  <p className="text-lg">{user?.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#333333]">Email</Label>
                  <p className="text-lg">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Interests Card */}
          <Card className="border border-[#71a875] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#3d8c42]">Career Interests</CardTitle>
              <CardDescription className="text-[#5f6a72]">
                Track your career interests to get personalized mentor recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#333333]">Career Keywords</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedKeywords.length === 0 ? (
                      <p className="text-muted-foreground">No career keywords selected</p>
                    ) : (
                      selectedKeywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary">
                          {keyword}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* KeywordDropdown for quick selection (outside the dialog) */}
                <KeywordDropdown
                  selectedKeywords={selectedKeywords}
                  onSelectKeyword={handleSelectKeyword}
                />
              </div>
            </CardContent>
            <CardFooter>
              {/* Button to open the dialog for advanced searching/adding */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#3d8c42] text-white hover:bg-[#1d4220] transition-colors"
                  >
                    Edit Career Keywords
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-[#3d8c42]">
                      Career Keywords
                    </DialogTitle>
                    <DialogDescription className="text-[#5f6a72]">
                      Select keywords that describe your career interests.
                    </DialogDescription>
                  </DialogHeader>

                  {/* DIALOG CONTENT */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="search" className="text-[#333333]">
                        Search Keywords
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="search"
                          placeholder="Search for keywords..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Add new custom keyword */}
                    <div>
                      <Label htmlFor="new-keyword" className="text-[#333333]">
                        Add New Keyword
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="new-keyword"
                          placeholder="Enter a new keyword..."
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                        />
                        <Button
                          size="sm"
                          onClick={handleCreateKeyword}
                          disabled={
                            !newKeyword.trim() ||
                            createKeywordMutation.isPending
                          }
                          className="bg-[#d7b85e] text-white hover:bg-[#a88a2a]"
                        >
                          {createKeywordMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Currently selected keywords */}
                    <div>
                      <Label className="text-[#333333]">Selected Keywords</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedKeywords.length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            No keywords selected
                          </p>
                        ) : (
                          selectedKeywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {keyword}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleRemoveKeyword(keyword)}
                              />
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Search results or all available keywords */}
                    <div>
                      <Label className="text-[#333333]">Available Keywords</Label>
                      {isLoadingKeywords || isSearching ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      ) : displayedKeywords.length === 0 && searchQuery ? (
                        <p className="text-muted-foreground text-sm">
                          No keywords found for "{searchQuery}"
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {displayedKeywords.map((kw: CareerKeyword) => (
                            <Badge
                              key={kw.id}
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary"
                              onClick={() => handleAddKeyword(kw.keyword)}
                            >
                              {kw.keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="text-[#3d8c42] border-[#3d8c42] hover:bg-[#e5efe6]"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveKeywords}
                      disabled={updateKeywordsMutation.isPending}
                      className="bg-[#3d8c42] text-white hover:bg-[#1d4220]"
                    >
                      {updateKeywordsMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          {/* Recommended Careers Card */}
          <Card className="border border-[#71a875] shadow-md col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#3d8c42]">Recommended Careers</CardTitle>
              <CardDescription className="text-[#5f6a72]">
                Based on your selected career keywords, we recommend exploring these career paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingMentors ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : selectedKeywords.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Select career keywords to see recommended career paths</p>
                  </div>
                ) : recommendedMentors.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No career recommendations found for your selected keywords</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedMentors.map((mentor) => (
                      <Card key={mentor.id} className="overflow-hidden border border-[#d7b85e]">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-[#3d8c42] flex items-center gap-2">
                            {mentor.clusterName || "Career Path"}
                            <Star className="h-4 w-4 text-[#d7b85e] fill-[#d7b85e]" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600">Recommended Mentor:</p>
                              <p className="font-medium">{mentor.name}</p>
                              <p className="text-sm">{mentor.title} at {mentor.company}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Matching Keywords:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {mentor.keywords?.filter(k => selectedKeywords.includes(k))
                                  .map(keyword => (
                                    <Badge key={keyword} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))
                                }
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50">
                          <Button 
                            variant="ghost" 
                            className="text-[#3d8c42] p-0 hover:text-[#1d4220] flex items-center gap-1"
                            onClick={() => window.location.href = `/mentor-search?search=${encodeURIComponent(mentor.clusterName || "")}`}
                          >
                            Explore This Career Path
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mentor } from "@shared/schema";
import MentorCard from "@/components/mentors/mentor-card";
import { useFavorites } from "@/context/favorites-context";
import { Heart, AlertCircle, Home } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [favoritedMentors, setFavoritedMentors] = useState<Mentor[]>([]);

  // Fetch all mentors
  const { data: mentors, isLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Filter mentors to show only favorited ones
  useEffect(() => {
    if (mentors) {
      const filtered = mentors.filter(mentor => favorites.includes(mentor.id));
      setFavoritedMentors(filtered);
    }
  }, [mentors, favorites]);

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/">
          <Button
            variant="outline"
            className="mb-6 border-green-medium text-green-dark hover:bg-green-pale hover:border-green-dark"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Favorite Mentors</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Mentors you've marked as favorites will appear here
            </p>
          </div>
          
          {favorites.length > 0 && (
            <Button 
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={clearFavorites}
            >
              Clear All Favorites
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No favorites yet</AlertTitle>
            <AlertDescription>
              You haven't added any mentors to your favorites. Browse mentors and click the star icon to add them to your favorites.
            </AlertDescription>
            <div className="mt-4">
              <Button asChild className="bg-green-medium hover:bg-green-dark">
                <Link href="/find-mentors">Browse Mentors</Link>
              </Button>
            </div>
          </Alert>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {favoritedMentors.length} {favoritedMentors.length === 1 ? 'mentor' : 'mentors'} in your favorites
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritedMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link } from "wouter";
import { Mentor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, ShoppingCart, Check } from "lucide-react";
import { useCartContext } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const { addToCart, removeFromCart, isInCart } = useCartContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);
  
  const inCart = isInCart(mentor.id);
  const mentorIsFavorite = isFavorite(mentor.id);
  
  const handleCartAction = () => {
    if (inCart) {
      removeFromCart(mentor.id);
    } else {
      addToCart(mentor.id);
    }
  };
  
  const handleToggleFavorite = () => {
    toggleFavorite(mentor.id);
    
    toast({
      title: mentorIsFavorite ? "Removed from favorites" : "Added to favorites",
      description: mentorIsFavorite 
        ? `${mentor.name} has been removed from your favorites` 
        : `${mentor.name} has been added to your favorites`,
      variant: "default",
      duration: 2000,
    });
  };
  
  // Fallback image for mentors without avatar
  const avatarUrl = mentor.avatarUrl === null || mentor.avatarUrl === undefined 
    ? "https://via.placeholder.com/300x200?text=No+Image" 
    : mentor.avatarUrl;
  
  return (
    <Card 
      className="mentor-card overflow-hidden shadow-md border border-neutral-silver h-full flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative h-48 bg-green-pale">
        <img 
          src={avatarUrl}
          alt={mentor.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-charcoal">{mentor.name}</h3>
            <p className="text-neutral-slate text-sm">{mentor.title} @ {mentor.company}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleToggleFavorite}
                  className="p-1 rounded-full hover:bg-gold-pale transition-colors"
                >
                  <Star 
                    className={`h-5 w-5 ${mentorIsFavorite ? 'fill-gold-dark stroke-gold-dark' : 'text-gold-dark'}`} 
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{mentorIsFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-neutral-slate">
          <Clock className="h-4 w-4 mr-1" />
          <span>{mentor.yearsExperience}+ years experience</span>
        </div>
        
        <div className="mt-1 flex items-center text-sm text-neutral-slate">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{mentor.location}</span>
        </div>
        
        <div className="mt-4 flex-grow">
          <div className="text-sm text-neutral-charcoal mb-2">Expertise:</div>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-green-pale text-green-dark text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.expertise.length - 4} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-5 flex justify-between items-center">
          <Button 
            className="flex-1 mr-2 bg-green-medium hover:bg-green-dark"
            asChild
          >
            <Link href={`/schedule/${mentor.id}`}>
              View Profile
            </Link>
          </Button>
          
          <Button 
            variant={inCart ? "secondary" : "default"}
            className={inCart 
              ? "bg-gold-light hover:bg-gold-dark text-neutral-charcoal" 
              : "bg-gold-medium hover:bg-gold-dark text-neutral-charcoal"
            }
            onClick={handleCartAction}
            size="icon"
          >
            {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

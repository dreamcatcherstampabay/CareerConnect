import { Mentor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useCartContext } from "@/context/cart-context";
import { Link } from "wouter";

interface MentorCartItemProps {
  mentor: Mentor;
}

export default function MentorCartItem({ mentor }: MentorCartItemProps) {
  const { removeFromCart } = useCartContext();
  
  const handleRemove = () => {
    removeFromCart(mentor.id);
  };
  
  return (
    <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
      <div className="flex-shrink-0 mr-4 mb-3 sm:mb-0">
        <img 
          src={mentor.avatarUrl || "/mentor-avatars/default-avatar.jpg"}
          alt={mentor.name}
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-neutral-charcoal">{mentor.name}</h3>
            <p className="text-neutral-slate text-sm">
              {mentor.title.split(' ')[0]} • {mentor.title} @ {mentor.company}
            </p>
          </div>
          <button 
            onClick={handleRemove}
            className="text-neutral-slate hover:text-status-red transition-colors"
            aria-label="Remove from cart"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {mentor.expertise.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-green-pale text-green-dark text-xs">
              {skill}
            </Badge>
          ))}
          {mentor.expertise.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{mentor.expertise.length - 3} more
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
        <Button 
          className="bg-green-medium hover:bg-green-dark text-white font-medium py-2 px-4 rounded-md text-sm transition"
          asChild
        >
          <Link href={`/schedule/${mentor.id}`}>
            <a>Schedule Session</a>
          </Link>
        </Button>
      </div>
    </div>
  );
}

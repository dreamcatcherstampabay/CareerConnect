import { useQuery } from "@tanstack/react-query";
import { useCartContext } from "@/context/cart-context";
import { Mentor } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MentorCartItem from "@/components/mentors/mentor-cart-item";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import { ShoppingCart, ArrowLeft, AlertTriangle, Home } from "lucide-react";

export default function MentorCartPage() {
  const { cart, clearCart } = useCartContext();
  const [, navigate] = useLocation();
  
  // Fetch details for all mentors in the cart
  const { data: mentorsData, isLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
  });
  
  const cartMentors = mentorsData?.filter(mentor => cart.includes(mentor.id)) || [];
  
  const handleContinueBrowsing = () => {
    navigate("/explore-careers");
  };
  
  if (!isLoading && cartMentors.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button
              variant="outline"
              className="mb-6 border-green-medium text-green-dark hover:bg-green-pale hover:border-green-dark"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="bg-white rounded-xl shadow-md border border-neutral-silver p-8 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-neutral-silver mb-4" />
              <h2 className="text-2xl font-serif font-bold text-neutral-charcoal mb-4">Your Mentor Cart is Empty</h2>
              <p className="text-neutral-slate mb-6">
                You haven't added any mentors to your cart yet. Start exploring career paths to find mentors.
              </p>
              <Button 
                onClick={handleContinueBrowsing}
                className="bg-green-medium hover:bg-green-dark"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Explore Career Paths
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="outline"
            className="mb-6 border-green-medium text-green-dark hover:bg-green-pale hover:border-green-dark"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-serif font-bold text-neutral-charcoal mb-6">
            Your Selected Mentors ({cartMentors.length})
          </h1>
          
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-md border border-neutral-silver p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-medium"></div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-md border border-neutral-silver mb-6 overflow-hidden">
                <div className="divide-y divide-neutral-silver">
                  {cartMentors.map(mentor => (
                    <MentorCartItem key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={handleContinueBrowsing}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Browsing
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    variant="destructive" 
                    onClick={clearCart}
                    className="w-full sm:w-auto"
                  >
                    Clear All
                  </Button>
                  <Button
                    className="bg-gold-medium hover:bg-gold-dark text-neutral-charcoal w-full sm:w-auto"
                  >
                    Schedule Group Session
                    <AlertTriangle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gold-pale text-gold-dark rounded-md border border-gold-medium">
                <div className="flex">
                  <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>Note:</strong> Group sessions are not available in this version. Please schedule individual sessions with each mentor.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

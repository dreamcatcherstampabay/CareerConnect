import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/newsletter/subscribe", { email });
      return await res.json();
    },
    onSuccess: () => {
      setEmail("");
      toast({
        title: "Newsletter Subscription",
        description: "Successfully subscribed to our newsletter!",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Subscription Failed",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      subscriptionMutation.mutate(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input 
          type="email" 
          placeholder="Your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 rounded-l-md w-full focus:outline-none text-neutral-charcoal"
        />
        <button 
          type="submit"
          disabled={subscriptionMutation.isPending}
          className="bg-gold-medium hover:bg-gold-dark text-neutral-charcoal px-4 py-2 rounded-r-md disabled:opacity-50"
        >
          {subscriptionMutation.isPending ? (
            <div className="animate-spin h-5 w-5 border-2 border-neutral-charcoal border-t-transparent rounded-full"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
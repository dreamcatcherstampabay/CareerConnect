import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { CareerEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Calendar, MapPin, ExternalLink, ArrowLeft, Home } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

type EventCardProps = {
  event: CareerEvent;
  isPast?: boolean;
};

function EventCard({ event, isPast = false }: EventCardProps) {
  const eventDate = new Date(event.eventDate);
  const formattedDate = format(eventDate, "MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        {event.clusterId && (
          <Badge variant="secondary" className="w-fit mb-2">
            Career Cluster {event.clusterId}
          </Badge>
        )}
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 mt-1">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>{formattedDate} at {formattedTime}</span>
        </CardDescription>
        <CardDescription className="flex items-center gap-1 mt-1">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>{event.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {event.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 pt-2">
        {event.registrationUrl && !isPast && (
          <Button className="w-full gap-2" asChild>
            <a 
              href={event.registrationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Register Now
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        {isPast && (
          <Badge variant="outline" className="bg-muted">
            Event completed
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}

export default function CareerEventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("upcoming");
  
  // Get all career events
  const { data: events, isLoading, error } = useQuery<CareerEvent[]>({
    queryKey: ["/api/career-events"],
    enabled: !!user
  });
  
  // Filter events based on the selected tab
  const filteredEvents = events ? events.filter(event => {
    const eventDate = new Date(event.eventDate);
    const now = new Date();
    
    if (currentTab === "upcoming") {
      return eventDate > now;
    } else if (currentTab === "past") {
      return eventDate <= now;
    }
    return true;
  }) : [];
  
  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.eventDate).getTime();
    const dateB = new Date(b.eventDate).getTime();
    
    if (currentTab === "upcoming") {
      return dateA - dateB; // Chronological order for upcoming
    } else {
      return dateB - dateA; // Reverse chronological order for past
    }
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading events",
        description: "There was a problem loading the career events.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <Link href="/">
            <Button 
              variant="outline" 
              className="mb-6 border-green-medium text-green-dark hover:bg-green-pale hover:border-green-dark"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Career Events</h1>
            <p className="text-muted-foreground mt-2">
              Discover upcoming career fairs, workshops, and networking opportunities.
            </p>
          </div>
          
          <Tabs defaultValue="upcoming" onValueChange={setCurrentTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sortedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No upcoming events</h3>
                  <p className="text-muted-foreground mt-2">
                    Check back later for new career events and opportunities.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sortedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedEvents.map(event => (
                    <EventCard key={event.id} event={event} isPast />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No past events</h3>
                  <p className="text-muted-foreground mt-2">
                    Past career events will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
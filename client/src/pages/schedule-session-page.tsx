import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Mentor, MentorAvailability } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CalendarPicker from "@/components/scheduler/calendar-picker";
import TimeSlotPicker from "@/components/scheduler/time-slot-picker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calendar, Clock, Video, AlertCircle, ArrowLeft, Check } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function ScheduleSessionPage() {
  const params = useParams<{ mentorId: string }>();
  const mentorId = parseInt(params.mentorId);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Fetch mentor details
  const { data: mentor, isLoading: mentorLoading } = useQuery<Mentor>({
    queryKey: [`/api/mentors/${mentorId}`],
    enabled: !isNaN(mentorId),
  });
  
  // Fetch mentor availability
  const { data: availabilityData, isLoading: availabilityLoading } = useQuery<MentorAvailability[]>({
    queryKey: [`/api/mentor-availability/${mentorId}`],
    enabled: !isNaN(mentorId),
  });
  
  const availableDates = availabilityData
    ?.filter(a => a.isAvailable)
    .map(a => new Date(a.date)) || [];
  
  // Generate time slots for the selected date
  const timeSlots = selectedDate 
    ? availabilityData
        ?.filter(a => 
          a.isAvailable && 
          new Date(a.date).toDateString() === selectedDate.toDateString()
        )
        .map(a => {
          const date = new Date(a.date);
          return format(date, "h:mm a");
        }) || []
    : [];
  
  // Schedule session mutation
  const scheduleMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !selectedTime || !mentor) {
        throw new Error("Please select a date and time");
      }
      
      // Combine date and time
      const [hours, minutes] = selectedTime.match(/(\d+):(\d+)/)?.slice(1).map(Number) || [0, 0];
      const isPM = selectedTime.toLowerCase().includes('pm');
      
      const sessionDate = new Date(selectedDate);
      sessionDate.setHours(
        isPM && hours < 12 ? hours + 12 : hours,
        minutes
      );
      
      const response = await apiRequest("POST", "/api/mentor-sessions", {
        mentorId: mentor.id,
        date: sessionDate.toISOString(),
        status: "scheduled",
        notes: notes.trim() || undefined,
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentor-sessions"] });
      setBookingComplete(true);
      toast({
        title: "Session Scheduled",
        description: `Your session with ${mentor?.name} has been successfully booked.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleScheduleSession = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Incomplete Selection",
        description: "Please select both a date and time for your session.",
        variant: "destructive",
      });
      return;
    }
    
    scheduleMutation.mutate();
  };
  
  const handleBackToMentors = () => {
    navigate("/find-mentors");
  };
  
  const handleScheduleAnother = () => {
    navigate("/mentor-cart");
  };
  
  const isLoading = mentorLoading || availabilityLoading;
  
  if (bookingComplete) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md border border-neutral-silver p-8 text-center">
              <div className="w-16 h-16 bg-green-medium rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-neutral-charcoal mb-4">Session Successfully Scheduled!</h2>
              <p className="text-neutral-slate mb-6">
                Your mentorship session with {mentor?.name} has been booked. Check your email for confirmation details.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={handleScheduleAnother}
                  className="bg-green-medium hover:bg-green-dark"
                >
                  Schedule Another Session
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Return to Home
                </Button>
              </div>
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
            variant="ghost"
            onClick={handleBackToMentors}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mentors
          </Button>
          
          <div className="bg-white rounded-xl shadow-lg border border-neutral-silver overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-serif font-bold text-neutral-charcoal mb-6">
                Schedule a Session with {isLoading ? "..." : mentor?.name}
              </h1>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-medium" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column - Mentor Info & Session Details */}
                  <div className="md:col-span-5 lg:col-span-4">
                    <div className="flex items-center mb-6">
                      <img 
                        src={mentor?.avatarUrl}
                        alt={mentor?.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-neutral-charcoal">{mentor?.name}</h3>
                        <p className="text-neutral-slate text-sm">{mentor?.title}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-neutral-charcoal mb-2">Session Details</h4>
                      <div className="bg-neutral-light p-4 rounded-md">
                        <div className="flex items-center mb-3">
                          <Clock className="text-green-medium mr-2 h-5 w-5" />
                          <div>
                            <div className="font-medium">Duration</div>
                            <div className="text-sm text-neutral-slate">30 minutes</div>
                          </div>
                        </div>
                        <div className="flex items-center mb-3">
                          <Video className="text-green-medium mr-2 h-5 w-5" />
                          <div>
                            <div className="font-medium">Meeting Type</div>
                            <div className="text-sm text-neutral-slate">Video call (Zoom)</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <AlertCircle className="text-green-medium mr-2 h-5 w-5" />
                          <div>
                            <div className="font-medium">Topics</div>
                            <div className="text-sm text-neutral-slate">Career guidance, Industry insights, Skills development</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-neutral-charcoal mb-2">Session Notes (Optional)</h4>
                      <Textarea 
                        placeholder="Share what you'd like to discuss in your session..."
                        className="resize-none h-32"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Right Column - Calendar & Time Selection */}
                  <div className="md:col-span-7 lg:col-span-8">
                    <div className="mb-6">
                      <h4 className="font-semibold text-neutral-charcoal mb-4">Select Date & Time</h4>
                      
                      <CalendarPicker 
                        availableDates={availableDates}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                      />
                      
                      {selectedDate && (
                        <>
                          <h4 className="font-semibold text-neutral-charcoal mt-6 mb-2">
                            Available Time Slots on {format(selectedDate, "MMMM d, yyyy")}
                          </h4>
                          
                          {timeSlots.length === 0 ? (
                            <div className="bg-neutral-light p-4 rounded-md text-center">
                              <p className="text-neutral-slate">No available time slots for this date.</p>
                            </div>
                          ) : (
                            <TimeSlotPicker 
                              timeSlots={timeSlots}
                              selectedTime={selectedTime}
                              onTimeSelect={setSelectedTime}
                            />
                          )}
                        </>
                      )}
                    </div>
                    
                    {selectedDate && selectedTime && (
                      <div className="bg-green-pale p-4 rounded-md mb-6">
                        <div className="flex items-start">
                          <Calendar className="text-green-dark mt-1 mr-3 h-5 w-5" />
                          <div>
                            <h4 className="font-semibold text-green-dark">Selected Session</h4>
                            <p className="text-sm text-neutral-charcoal">
                              {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime} (30 minutes)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        onClick={handleBackToMentors}
                        className="mr-3"
                        disabled={scheduleMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="bg-green-medium hover:bg-green-dark"
                        onClick={handleScheduleSession}
                        disabled={!selectedDate || !selectedTime || scheduleMutation.isPending}
                      >
                        {scheduleMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scheduling...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

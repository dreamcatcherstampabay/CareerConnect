import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, MapPin, Mail, Phone, User, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Counselor, insertCounselorSessionSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const sessionFormSchema = insertCounselorSessionSchema.extend({
  sessionDate: z.string().min(1, "Session date is required"),
  sessionType: z.string().min(1, "Session type is required"),
  notes: z.string().optional(),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

export default function ScheduleCounselorPage() {
  const { counselorId } = useParams<{ counselorId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: counselor, isLoading } = useQuery<Counselor>({
    queryKey: [`/api/counselors/${counselorId}`],
    enabled: !!counselorId,
  });

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      counselorId: parseInt(counselorId || "0"),
      duration: 30,
      sessionType: "",
      sessionDate: "",
      notes: "",
    },
  });

  const sessionMutation = useMutation({
    mutationFn: async (data: SessionFormData) => {
      const res = await apiRequest("POST", "/api/counselor-sessions", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/counselor-sessions"] });
      toast({
        title: "Session Scheduled",
        description: "Your counseling session has been successfully scheduled.",
      });
      setLocation("/counselors");
    },
    onError: (error: Error) => {
      toast({
        title: "Scheduling Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SessionFormData) => {
    sessionMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-medium" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!counselor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Counselor Not Found</h1>
              <Link href="/counselors">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Counselors
                </Button>
              </Link>
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/counselors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Counselors
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-green-800">Schedule Counseling Session</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Counselor Information */}
          <Card className="bg-white shadow-lg border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  {counselor.avatarUrl ? (
                    <img 
                      src={counselor.avatarUrl} 
                      alt={counselor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl text-green-800">{counselor.name}</CardTitle>
                  <CardDescription className="text-green-600 font-medium">
                    {counselor.title}
                  </CardDescription>
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                    {counselor.department}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{counselor.email}</span>
                </div>
                {counselor.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{counselor.phone}</span>
                  </div>
                )}
                {counselor.officeLocation && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{counselor.officeLocation}</span>
                  </div>
                )}
                {counselor.officeHours && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{counselor.officeHours}</span>
                  </div>
                )}
              </div>

              {/* Specialties */}
              {counselor.specialties && counselor.specialties.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {counselor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {counselor.bio && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">About</h4>
                  <p className="text-sm text-gray-600">{counselor.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scheduling Form */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-green-800">Schedule Your Session</CardTitle>
              <CardDescription>
                Choose your preferred date, time, and session type for your counseling appointment.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Session Type */}
                  <FormField
                    control={form.control}
                    name="sessionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select session type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="College Applications">College Applications</SelectItem>
                            <SelectItem value="Course Planning">Course Planning</SelectItem>
                            <SelectItem value="Academic Support">Academic Support</SelectItem>
                            <SelectItem value="Career Guidance">Career Guidance</SelectItem>
                            <SelectItem value="Transfer Planning">Transfer Planning</SelectItem>
                            <SelectItem value="Graduation Requirements">Graduation Requirements</SelectItem>
                            <SelectItem value="Study Skills">Study Skills</SelectItem>
                            <SelectItem value="General Consultation">General Consultation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Session Date */}
                  <FormField
                    control={form.control}
                    name="sessionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date & Time</FormLabel>
                        <FormControl>
                          <input
                            type="datetime-local"
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Duration */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Duration</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your specific needs or questions for this session..."
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={sessionMutation.isPending}
                  >
                    {sessionMutation.isPending ? (
                      "Scheduling..."
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Schedule Session
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
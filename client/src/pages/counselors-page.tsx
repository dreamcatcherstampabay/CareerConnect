import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Mail, Phone, User, GraduationCap, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Counselor } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function CounselorsPage() {
  const { data: counselors, isLoading } = useQuery<Counselor[]>({
    queryKey: ["/api/counselors"],
  });

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-neutral-charcoal mb-2">Academic Counselors</h1>
            <p className="text-lg text-neutral-slate">
              Connect with Chamberlain's in-house academic counselors for personalized guidance on college applications, 
              course planning, and academic success strategies.
            </p>
          </div>

          {/* Counselors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors?.map((counselor) => (
              <Card key={counselor.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
                <CardHeader className="pb-4">
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

                  <Separator />

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
                      <p className="text-sm text-gray-600 line-clamp-3">{counselor.bio}</p>
                    </div>
                  )}

                  <Separator />

                  {/* Action Button */}
                  <Link href={`/schedule-counselor/${counselor.id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {!counselors || counselors.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Counselors Available</h3>
              <p className="text-gray-500">Check back later for available academic counselors.</p>
            </div>
          ) : null}

          {/* Help Section */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">How Academic Counseling Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Choose Your Counselor</h3>
                <p className="text-sm text-gray-600">
                  Browse our academic counselors and select one that matches your needs
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Schedule Your Session</h3>
                <p className="text-sm text-gray-600">
                  Book an appointment that fits your schedule for academic guidance
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Get Personalized Help</h3>
                <p className="text-sm text-gray-600">
                  Receive expert guidance on college applications and academic planning
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
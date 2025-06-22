import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import stormLogo from "@assets/Chamberlain2.png";

export default function HeroSection() {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-green-dark to-green-medium rounded-2xl overflow-hidden shadow-lg">
        <div className="md:flex">
          <div className="px-8 py-12 md:w-1/2">
            <div className="flex items-center mb-4">
              <img 
                src={stormLogo} 
                alt="Chamberlain Storm" 
                className="h-16 w-auto mr-3"
              />
              <h1 className="text-white text-3xl md:text-4xl font-serif font-bold">
                Storm Career Connect
              </h1>
            </div>
            <p className="text-green-pale text-lg mb-6">
              Connect with experienced mentors who can guide you on your career journey. 
              Explore options, book sessions, and take the next step toward your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-gold-medium hover:bg-gold-dark text-neutral-charcoal font-medium"
                asChild
              >
                <Link href="/find-mentors">
                  Find a Mentor
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-green-pale text-green-dark border-white hover:border-green-pale"
                asChild
              >
                <Link href="/explore-careers">
                  Explore Careers
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Students collaborating"
              className="object-cover h-full w-full"
            />
            <div className="absolute inset-0 bg-green-dark bg-opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

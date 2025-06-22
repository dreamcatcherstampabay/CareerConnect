import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CareerCluster } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CareerCategories() {
  const { data: clusters } = useQuery<CareerCluster[]>({
    queryKey: ["/api/career-clusters"],
  });
  
  // Filter clusters by category
  const floridaClusters = clusters?.filter(c => c.category === 'florida') || [];
  const militaryClusters = clusters?.filter(c => c.category === 'military') || [];
  
  // For tech career focus, manually create a subset of "Information Technology" related clusters
  const techCareers = [
    { id: 1, name: "Software Development", icon: "ri-code-s-slash-line" },
    { id: 2, name: "Data Science & Analytics", icon: "ri-database-2-line" },
    { id: 3, name: "Cybersecurity", icon: "ri-lock-password-line" },
    { id: 4, name: "Cloud Computing", icon: "ri-cloud-line" },
    { id: 5, name: "Artificial Intelligence", icon: "ri-ai-generate" },
  ];
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-serif font-bold text-neutral-charcoal mb-6">Explore Career Categories</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Florida Career Clusters */}
        <Card>
          <div className="bg-gradient-to-r from-green-dark to-green-medium p-4">
            <h3 className="text-xl font-bold text-white">Florida Career Clusters</h3>
            <p className="text-green-pale text-sm">Explore state-recognized career pathways</p>
          </div>
          <CardContent className="p-4">
            <ul className="space-y-3">
              {floridaClusters.slice(0, 5).map(cluster => (
                <li key={cluster.id} className="flex items-center">
                  <i className={`${cluster.iconName} text-green-medium mr-3`}></i>
                  <Link href={`/find-mentors/${cluster.id}`}>
                    <a className="text-neutral-charcoal hover:text-green-medium">{cluster.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <Button variant="link" className="text-green-medium hover:text-green-dark" asChild>
                <Link href="/explore-careers">
                  <a className="flex items-center justify-center">
                    View All Career Clusters
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Military Careers */}
        <Card>
          <div className="bg-gradient-to-r from-gold-dark to-gold-medium p-4">
            <h3 className="text-xl font-bold text-neutral-charcoal">Military Careers</h3>
            <p className="text-neutral-charcoal text-sm opacity-80">Discover pathways in armed forces</p>
          </div>
          <CardContent className="p-4">
            <ul className="space-y-3">
              {militaryClusters.map(cluster => (
                <li key={cluster.id} className="flex items-center">
                  <i className={`${cluster.iconName} text-gold-dark mr-3`}></i>
                  <Link href={`/find-mentors/${cluster.id}`}>
                    <a className="text-neutral-charcoal hover:text-gold-dark">{cluster.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <Button variant="link" className="text-gold-dark hover:text-gold-medium" asChild>
                <Link href="/explore-careers?category=military">
                  <a className="flex items-center justify-center">
                    Explore Military Careers
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Tech Career Focus */}
        <Card>
          <div className="bg-gradient-to-r from-neutral-charcoal to-neutral-slate p-4">
            <h3 className="text-xl font-bold text-white">Tech Career Focus</h3>
            <p className="text-neutral-silver text-sm">In-demand technology specializations</p>
          </div>
          <CardContent className="p-4">
            <ul className="space-y-3">
              {techCareers.map(career => (
                <li key={career.id} className="flex items-center">
                  <i className={`${career.icon} text-neutral-slate mr-3`}></i>
                  <Link href="/find-mentors/13">
                    <a className="text-neutral-charcoal hover:text-neutral-slate">{career.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <Button variant="link" className="text-neutral-slate hover:text-neutral-charcoal" asChild>
                <Link href="/find-mentors/13">
                  <a className="flex items-center justify-center">
                    View All Tech Careers
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

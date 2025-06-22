import { Mentor } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseBusiness, Landmark, Building2 } from "lucide-react";
import { Link } from "wouter";

interface MentorSearchCardProps {
  mentor: Mentor;
  searchTerm?: string;
}

export default function MentorSearchCard({ mentor, searchTerm = "" }: MentorSearchCardProps) {
  // Highlight matching keywords if search term is provided
  const renderKeyword = (keyword: string) => {
    if (!searchTerm) return keyword;
    
    const lowercaseKeyword = keyword.toLowerCase();
    const lowercaseSearch = searchTerm.toLowerCase();
    
    if (lowercaseKeyword.includes(lowercaseSearch)) {
      return (
        <span className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">
          {keyword}
        </span>
      );
    }
    
    return keyword;
  };

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <Link href={`/schedule/${mentor.id}`}>
        <a className="block h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold text-primary">
                  {mentor.name}
                </CardTitle>
                <div className="text-sm font-medium text-muted-foreground flex items-center mt-1">
                  <BriefcaseBusiness className="w-4 h-4 mr-1" /> {mentor.title}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-sm flex items-center">
              <Building2 className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{mentor.company}</span>
            </div>
            <div className="mb-3 text-sm flex items-center">
              <Landmark className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{mentor.clusterName || "General Career"}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {mentor.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {mentor.keywords && mentor.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {renderKeyword(keyword)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </a>
      </Link>
    </Card>
  );
}
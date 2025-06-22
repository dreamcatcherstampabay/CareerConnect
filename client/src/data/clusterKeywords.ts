// Define the type for the cluster keywords
interface ClusterKeyword {
  cluster: string;
  keywords: string[];
}

// Career cluster keywords for dropdown selection
export const clusterKeywords: ClusterKeyword[] = [
  {
    cluster: "Agriculture, Food, & Natural Resources",
    keywords: ["farming", "animals", "plants", "environment", "food"]
  },
  {
    cluster: "Architecture & Construction",
    keywords: ["building", "tools", "design", "homes", "construction"]
  },
  {
    cluster: "Arts, A/V Technology & Communications",
    keywords: ["drawing", "music", "video", "writing", "speaking"]
  },
  {
    cluster: "Business Management & Administration",
    keywords: ["money", "planning", "office", "manager", "teamwork"]
  },
  {
    cluster: "Education & Training",
    keywords: ["teaching", "classroom", "learning", "kids", "school"]
  },
  {
    cluster: "Energy",
    keywords: ["electricity", "power", "solar", "wind", "energy"]
  },
  {
    cluster: "Engineering & Technology Education",
    keywords: ["machines", "coding", "design", "invent", "robotics"]
  },
  {
    cluster: "Finance",
    keywords: ["banking", "money", "budget", "saving", "investing"]
  },
  {
    cluster: "Government & Public Administration",
    keywords: ["law", "voting", "rules", "community", "leadership"]
  },
  {
    cluster: "Health Science",
    keywords: ["doctor", "nurse", "medicine", "hospital", "health"]
  },
  {
    cluster: "Hospitality & Tourism",
    keywords: ["travel", "hotels", "food", "guests", "service"]
  },
  {
    cluster: "Human Services",
    keywords: ["helping", "family", "support", "social work", "care"]
  },
  {
    cluster: "Information Technology",
    keywords: ["computers", "apps", "code", "tech", "internet"]
  },
  {
    cluster: "Law, Public Safety & Security",
    keywords: ["police", "safety", "law", "fire", "protect"]
  },
  {
    cluster: "Manufacturing",
    keywords: ["factory", "machines", "tools", "parts", "make"]
  },
  {
    cluster: "Marketing, Sales, & Service",
    keywords: ["selling", "ads", "store", "customer", "products"]
  },
  {
    cluster: "Transportation, Distribution, & Logistics",
    keywords: ["trucks", "travel", "planes", "packages", "delivery"]
  },
  {
    cluster: "Military - Army",
    keywords: ["soldier", "army", "discipline", "mission", "service"]
  },
  {
    cluster: "Military - Navy",
    keywords: ["navy", "ship", "sailor", "ocean", "service"]
  },
  {
    cluster: "Military - Air Force",
    keywords: ["air force", "pilot", "aviation", "planes", "service"]
  },
  {
    cluster: "Military - Marine Corps",
    keywords: ["marines", "corps", "discipline", "mission", "service"]
  },
  {
    cluster: "Military - Coast Guard",
    keywords: ["coast guard", "rescue", "maritime", "patrol", "service"]
  },
  {
    cluster: "Military - Space Force",
    keywords: ["space force", "space", "satellite", "aerospace", "service"]
  }
];
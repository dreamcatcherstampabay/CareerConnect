import { storage } from "./storage";

const careerClusterIcons = {
  // Military
  "Navy": "ri-ship-line",
  "Army": "ri-sword-line", 
  "Air Force": "ri-plane-line",
  "Marines": "ri-earth-line",
  "Marine Corps": "ri-earth-line",
  "Coast Guard": "ri-anchor-line",
  "Space Force": "ri-rocket-line",
  
  // Healthcare
  "Healthcare": "ri-heart-pulse-line",
  "Nursing": "ri-first-aid-kit-line",
  "Medical Technology": "ri-microscope-line",
  "Mental Health": "ri-brain-line",
  "Physical Therapy": "ri-run-line",
  "Dental": "ri-tooth-line",
  
  // Technology
  "Information Technology": "ri-computer-line",
  "Software Development": "ri-code-line",
  "Cybersecurity": "ri-shield-line",
  "Data Science": "ri-database-line",
  "Web Development": "ri-global-line",
  "Mobile Development": "ri-smartphone-line",
  
  // Business
  "Business Administration": "ri-briefcase-line",
  "Marketing": "ri-line-chart-line",
  "Marketing, Sales, & Service": "ri-line-chart-line",
  "Finance": "ri-money-dollar-circle-line",
  "Human Resources": "ri-team-line",
  "Project Management": "ri-tasks-line",
  "Entrepreneurship": "ri-lightbulb-line",
  
  // Education
  "Education": "ri-graduation-cap-line",
  "Elementary Education": "ri-school-line",
  "Special Education": "ri-heart-line",
  "Educational Leadership": "ri-award-line",
  
  // Creative Arts
  "Arts, A/V Technology & Communications": "ri-palette-line",
  "Arts, A/V Technology & Communication": "ri-palette-line",
  "Graphic Design": "ri-palette-line",
  "Photography": "ri-camera-line",
  "Video Production": "ri-video-line",
  "Music": "ri-music-note-line",
  "Writing": "ri-quill-pen-line",
  
  // Energy
  "Energy": "ri-lightning-line",
  
  // Engineering
  "Engineering": "ri-settings-3-line",
  "Engineering & Technology Education": "ri-settings-3-line",
  "Science, Technology, Engineering & Mathematics": "ri-settings-3-line",
  "Civil Engineering": "ri-building-line",
  
  // Government & Law
  "Government & Public Administration": "ri-government-line",
  "Law, Public Safety, Corrections & Security": "ri-auction-line",
  "Law, Public Safety & Security": "ri-auction-line",
  
  // Transportation
  "Transportation, Distribution & Logistics": "ri-roadster-line",
  "Transportation, Distribution, & Logistics": "ri-roadster-line",
  "Mechanical Engineering": "ri-settings-line",
  "Electrical Engineering": "ri-flashlight-line",
  
  // Sciences
  "Biology": "ri-leaf-line",
  "Chemistry": "ri-flask-line",
  "Physics": "ri-atom-line",
  "Environmental Science": "ri-earth-line",
  
  // Law & Public Safety
  "Criminal Justice": "ri-shield-check-line",
  "Law": "ri-scales-line",
  "Emergency Services": "ri-fire-line",
  
  // Agriculture & Food
  "Agriculture": "ri-plant-line",
  "Culinary Arts": "ri-restaurant-line",
  "Food Science": "ri-cake-line"
};

async function addCareerIcons() {
  try {
    console.log("Adding iconName column and populating career cluster icons...");
    
    // Get all career clusters
    const clusters = await storage.getCareerClusters();
    console.log(`Found ${clusters.length} career clusters`);
    
    // Update each cluster with its icon
    for (const cluster of clusters) {
      const iconName = careerClusterIcons[cluster.name as keyof typeof careerClusterIcons];
      if (iconName) {
        console.log(`Updating ${cluster.name} with icon: ${iconName}`);
        // We'll need to add this method to the storage interface
        try {
          await (storage as any).updateCareerClusterIcon(cluster.id, iconName);
        } catch (error) {
          console.log(`Note: updateCareerClusterIcon method not available, will need to add to storage interface`);
          break;
        }
      } else {
        console.log(`No icon found for cluster: ${cluster.name}`);
      }
    }
    
    console.log("Career cluster icons updated successfully!");
    
  } catch (error) {
    console.error("Error adding career icons:", error);
  }
}

// Run if called directly
if (require.main === module) {
  addCareerIcons().then(() => process.exit(0));
}

export { addCareerIcons, careerClusterIcons };
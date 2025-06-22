import { useState } from "react";
import { Download, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ResumeBuilderPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setCompletedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const resumeSections = [
    {
      id: "header",
      title: "Header & Contact Information",
      content: [
        "Full name (larger, bold font)",
        "Professional email address",
        "Phone number",
        "City, State (no need for full address)",
        "LinkedIn profile URL",
        "Professional website or portfolio (if applicable)"
      ]
    },
    {
      id: "summary",
      title: "Professional Summary or Objective",
      content: [
        "2-3 sentences highlighting your key strengths",
        "Mention your career goals or target position",
        "Include relevant skills or experience",
        "Tailor this section to each job application"
      ]
    },
    {
      id: "education",
      title: "Education",
      content: [
        "School name and location",
        "Degree type and major",
        "Graduation date (month/year)",
        "GPA (if 3.5 or higher)",
        "Relevant coursework, honors, or awards",
        "Study abroad or exchange programs"
      ]
    },
    {
      id: "experience",
      title: "Work Experience",
      content: [
        "Job title, company name, location",
        "Employment dates (month/year format)",
        "3-5 bullet points describing responsibilities",
        "Start each bullet with an action verb",
        "Include quantifiable achievements when possible",
        "List experiences in reverse chronological order"
      ]
    },
    {
      id: "skills",
      title: "Skills & Competencies",
      content: [
        "Technical skills (software, programming languages)",
        "Language proficiencies",
        "Industry-specific certifications",
        "Soft skills relevant to the position",
        "Group similar skills together",
        "Be honest about your skill level"
      ]
    },
    {
      id: "activities",
      title: "Activities & Leadership",
      content: [
        "Volunteer work and community service",
        "Leadership positions in organizations",
        "Relevant clubs and professional associations",
        "Sports teams or athletic achievements",
        "Academic competitions or awards",
        "Include dates and brief descriptions"
      ]
    }
  ];

  const formatTips = [
    "Use a clean, professional font (Arial, Calibri, or Times New Roman)",
    "Keep font size between 10-12 points",
    "Maintain consistent formatting throughout",
    "Use bullet points for easy scanning",
    "Keep resume to 1-2 pages maximum",
    "Save as PDF to preserve formatting",
    "Use white space effectively - avoid cramming",
    "Proofread multiple times for errors"
  ];

  return (
    <div className="min-h-screen bg-neutral-ice">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-green-dark" />
            <h1 className="text-3xl font-bold text-neutral-charcoal">Resume Builder</h1>
          </div>
          <p className="text-lg text-neutral-medium mb-6">
            Create a professional resume with our step-by-step guide. Follow each section to build a compelling resume that showcases your strengths.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              onClick={() => window.open('https://www.fldoe.org/core/fileparse.php/5428/urlt/CC-Step5-Part3.docx', '_blank')}
              className="bg-green-dark hover:bg-green-medium text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template (.docx)
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-dark border-green-dark">
                Progress: {completedSections.length}/{resumeSections.length} sections
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          {resumeSections.map((section, index) => (
            <Card key={section.id} className="border-green-pale">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <span className="bg-green-dark text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {section.title}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSection(section.id)}
                    className={completedSections.includes(section.id) ? "bg-green-pale border-green-dark" : ""}
                  >
                    <CheckCircle className={`h-4 w-4 ${completedSections.includes(section.id) ? "text-green-dark" : "text-neutral-medium"}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-dark mt-1">•</span>
                      <span className="text-neutral-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-gold-medium bg-gold-light/10">
          <CardHeader>
            <CardTitle className="text-gold-dark">Formatting Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-2">
              {formatTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gold-medium mt-1">✓</span>
                  <span className="text-neutral-medium text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-neutral-medium mb-4">
            Need additional help? Download the complete template or reach out to a career counselor.
          </p>
          <Button 
            onClick={() => window.open('https://www.fldoe.org/core/fileparse.php/5428/urlt/CC-Step5-Part3.docx', '_blank')}
            variant="outline"
            className="border-green-dark text-green-dark hover:bg-green-pale"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Full Template
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
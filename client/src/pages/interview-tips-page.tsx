import { useState } from "react";
import { Download, MessageCircle, CheckCircle, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function InterviewTipsPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setCompletedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const beforeInterview = [
    {
      title: "Research the Company",
      tips: [
        "Visit the company website and read their mission statement",
        "Research recent news, projects, or achievements",
        "Understand their products, services, and target market",
        "Look up the company on LinkedIn and social media",
        "Know the company culture and values"
      ]
    },
    {
      title: "Prepare Your Documents",
      tips: [
        "Bring multiple copies of your resume",
        "Prepare a list of references with contact information",
        "Gather any portfolio items or work samples",
        "Bring a notepad and pen for taking notes",
        "Have your questions for the interviewer written down"
      ]
    },
    {
      title: "Plan Your Appearance",
      tips: [
        "Choose professional, conservative attire",
        "Ensure clothes are clean, pressed, and fit well",
        "Keep accessories and jewelry minimal",
        "Plan your grooming and personal hygiene",
        "Test your outfit beforehand to ensure comfort"
      ]
    }
  ];

  const duringInterview = [
    {
      title: "First Impressions",
      tips: [
        "Arrive 10-15 minutes early",
        "Greet everyone you meet professionally",
        "Offer a firm handshake and maintain eye contact",
        "Smile genuinely and show enthusiasm",
        "Turn off your phone and put it away"
      ]
    },
    {
      title: "Body Language & Communication",
      tips: [
        "Sit up straight and maintain good posture",
        "Make appropriate eye contact throughout",
        "Use hand gestures naturally but not excessively",
        "Listen actively and avoid interrupting",
        "Speak clearly and at an appropriate volume"
      ]
    },
    {
      title: "Answering Questions",
      tips: [
        "Take a moment to think before answering",
        "Use the STAR method (Situation, Task, Action, Result)",
        "Provide specific examples from your experience",
        "Be honest about your strengths and weaknesses",
        "Ask for clarification if you don't understand a question"
      ]
    }
  ];

  const commonQuestions = [
    {
      question: "Tell me about yourself",
      guidance: "Focus on professional background, relevant skills, and career goals. Keep it concise (2-3 minutes)."
    },
    {
      question: "Why do you want to work here?",
      guidance: "Demonstrate knowledge of the company and explain how your goals align with their mission."
    },
    {
      question: "What are your greatest strengths?",
      guidance: "Choose 2-3 relevant strengths and provide specific examples of how you've used them."
    },
    {
      question: "What is your biggest weakness?",
      guidance: "Choose a real weakness and explain the steps you're taking to improve it."
    },
    {
      question: "Where do you see yourself in 5 years?",
      guidance: "Show ambition while demonstrating commitment to growing with the company."
    },
    {
      question: "Why should we hire you?",
      guidance: "Summarize your qualifications and explain the unique value you would bring."
    }
  ];

  const afterInterview = [
    "Send a thank-you email within 24 hours",
    "Mention specific topics discussed during the interview",
    "Reiterate your interest in the position",
    "Include any additional information requested",
    "Follow up appropriately if you don't hear back within the stated timeframe",
    "Reflect on the interview experience and note areas for improvement"
  ];

  return (
    <div className="min-h-screen bg-neutral-ice">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-8 w-8 text-green-dark" />
            <h1 className="text-3xl font-bold text-neutral-charcoal">Interview Tips & Preparation</h1>
          </div>
          <p className="text-lg text-neutral-medium mb-6">
            Master the interview process with comprehensive preparation strategies, common questions, and professional tips to help you succeed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              onClick={() => window.open('https://www.fldoe.org/core/fileparse.php/5428/urlt/CC-Step5-Part6.docx', '_blank')}
              className="bg-green-dark hover:bg-green-medium text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Guide (.docx)
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-dark border-green-dark">
                Complete preparation checklist
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="before" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="before" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Before
            </TabsTrigger>
            <TabsTrigger value="during" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              During
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="after" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              After
            </TabsTrigger>
          </TabsList>

          <TabsContent value="before" className="mt-6">
            <div className="grid gap-6">
              {beforeInterview.map((section, index) => (
                <Card key={section.title} className="border-green-pale">
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
                        onClick={() => toggleSection(section.title)}
                        className={completedSections.includes(section.title) ? "bg-green-pale border-green-dark" : ""}
                      >
                        <CheckCircle className={`h-4 w-4 ${completedSections.includes(section.title) ? "text-green-dark" : "text-neutral-medium"}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-dark mt-1">•</span>
                          <span className="text-neutral-medium">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="during" className="mt-6">
            <div className="grid gap-6">
              {duringInterview.map((section, index) => (
                <Card key={section.title} className="border-green-pale">
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
                        onClick={() => toggleSection(section.title)}
                        className={completedSections.includes(section.title) ? "bg-green-pale border-green-dark" : ""}
                      >
                        <CheckCircle className={`h-4 w-4 ${completedSections.includes(section.title) ? "text-green-dark" : "text-neutral-medium"}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-dark mt-1">•</span>
                          <span className="text-neutral-medium">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <div className="grid gap-4">
              {commonQuestions.map((item, index) => (
                <Card key={index} className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-800">
                      Q: {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-medium">
                      <strong>How to answer:</strong> {item.guidance}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="after" className="mt-6">
            <Card className="border-gold-medium bg-gold-light/10">
              <CardHeader>
                <CardTitle className="text-gold-dark">Post-Interview Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {afterInterview.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gold-medium mt-1">✓</span>
                      <span className="text-neutral-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-neutral-medium mb-4">
            Want the complete interview preparation guide? Download the comprehensive document.
          </p>
          <Button 
            onClick={() => window.open('https://www.fldoe.org/core/fileparse.php/5428/urlt/CC-Step5-Part6.docx', '_blank')}
            variant="outline"
            className="border-green-dark text-green-dark hover:bg-green-pale"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Full Guide
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
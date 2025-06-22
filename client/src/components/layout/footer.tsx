import { Link } from "wouter";
import stormLogo from "@assets/Chamberlain2.png";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { NewsletterForm } from "../newsletter-form";

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src={stormLogo} 
                alt="Chamberlain Storm" 
                className="h-10 w-auto mr-2"
              />
              <span className="font-serif font-bold text-xl">Storm Career Connect</span>
            </div>
            <p className="text-green-pale mb-4">
              Connecting students with experienced mentors to explore career pathways and build professional networks.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/CHSLegacy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://x.com/CHS_Legacy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/chamberlainlegacy/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/chslegacy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://www.youtube.com/@chamberlainlegacy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5,3 19,12 5,21"></polygon>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-green-pale hover:text-white">Home</a>
              </li>
              <li>
                <a href="/explore-careers" className="text-green-pale hover:text-white">Explore Careers</a>
              </li>
              <li>
                <a href="/find-mentors" className="text-green-pale hover:text-white">Find Mentors</a>
              </li>
              <li>
                <a href="https://www.chamberlainlegacy.com/" target="_blank" rel="noopener noreferrer" className="text-green-pale hover:text-white">About Us</a>
              </li>
              <li>
                <a href="mailto:ChamberlainLegacy@gmail.com" className="text-green-pale hover:text-white">Contact</a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="https://career.ja.org/explore-careers" target="_blank" rel="noopener noreferrer" className="text-green-pale hover:text-white">Career Guide</a></li>
              <li><a href="/resume-builder" className="text-green-pale hover:text-white">Resume Builder</a></li>
              <li><a href="/interview-tips" className="text-green-pale hover:text-white">Interview Tips</a></li>
              <li><a href="/career-events" className="text-green-pale hover:text-white">Career Events</a></li>
              <li><a href="#" className="text-green-pale hover:text-white">FAQ</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-green-pale mb-4">Stay updated with career opportunities and mentorship events.</p>
            <NewsletterForm />
            <p className="text-xs text-green-pale">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
        
        <div className="border-t border-green-medium pt-8 mt-8 text-center text-green-pale text-sm">
          <p>&copy; {new Date().getFullYear()} Chamberlain Storm Career Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

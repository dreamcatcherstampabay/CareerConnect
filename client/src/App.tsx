import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import ExploreCareerPage from "@/pages/explore-careers-page";
import FindMentorsPage from "@/pages/find-mentors-page";
import MentorCartPage from "@/pages/mentor-cart-page";
import ScheduleSessionPage from "@/pages/schedule-session-page";
import StudentProfilePage from "@/pages/student-profile-page";
import NotificationsPage from "@/pages/notifications-page";
import MentorSearchPage from "@/pages/mentor-search-page";
import FavoritesPage from "@/pages/favorites-page";
import CareerEventsPage from "@/pages/career-events-page";
import CounselorsPage from "@/pages/counselors-page";
import ScheduleCounselorPage from "@/pages/schedule-counselor-page";
import ResumeBuilderPage from "@/pages/resume-builder-page";
import InterviewTipsPage from "@/pages/interview-tips-page";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/context/cart-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { NotificationProvider } from "@/context/notification-context";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/explore-careers" component={ExploreCareerPage} />
      <ProtectedRoute path="/find-mentors/:clusterId?" component={FindMentorsPage} />
      <ProtectedRoute path="/mentor-search" component={MentorSearchPage} />
      <ProtectedRoute path="/mentor-cart" component={MentorCartPage} />
      <ProtectedRoute path="/favorites" component={FavoritesPage} />
      <ProtectedRoute path="/schedule/:mentorId" component={ScheduleSessionPage} />
      <ProtectedRoute path="/profile" component={StudentProfilePage} />
      <ProtectedRoute path="/notifications" component={NotificationsPage} />
      <ProtectedRoute path="/career-events" component={CareerEventsPage} />
      <ProtectedRoute path="/counselors" component={CounselorsPage} />
      <ProtectedRoute path="/schedule-counselor/:counselorId" component={ScheduleCounselorPage} />
      <ProtectedRoute path="/resume-builder" component={ResumeBuilderPage} />
      <ProtectedRoute path="/interview-tips" component={InterviewTipsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <NotificationProvider>
              <Router />
              <Toaster />
            </NotificationProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

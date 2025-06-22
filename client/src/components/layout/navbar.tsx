import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCartContext } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import NotificationDropdown from "@/components/notifications/notification-dropdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, LogOut, User, Bell, Heart, Calendar, Home, Search, GraduationCap } from "lucide-react";
import stormLogo from "@assets/Chamberlain2.png";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { cart } = useCartContext();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location === path;
  
  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/explore-careers", label: "Explore Careers", icon: Search },
    { path: "/find-mentors", label: "Find Mentors", icon: User },
    { path: "/counselors", label: "Counselors", icon: GraduationCap },
  ];
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';
  
  return (
    <nav className="bg-green-dark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src={stormLogo} 
                alt="Chamberlain Storm" 
                className="h-10 w-auto mr-2"
              />
              <span className="font-serif font-bold text-xl">Storm Career Connect</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    isActive(link.path)
                      ? "border-gold-medium text-white"
                      : "border-transparent text-green-pale hover:border-gold-light hover:text-white"
                  } text-sm font-medium`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block hover:text-gold-medium relative cursor-pointer">
              <NotificationDropdown />
            </div>
            
            <button
              onClick={() => window.location.href = "/career-events"}
              className="hover:text-gold-medium p-2 relative cursor-pointer flex items-center justify-center"
            >
              <Calendar className="h-5 w-5" />
            </button>

            <button
              onClick={() => window.location.href = "/favorites"}
              className="hover:text-gold-medium p-2 relative cursor-pointer flex items-center justify-center"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-medium text-neutral-charcoal text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {favorites.length}
                </span>
              )}
            </button>
          
            <button
              onClick={() => window.location.href = "/mentor-cart"}
              className="hover:text-gold-medium p-2 relative cursor-pointer flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-status-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-green-medium flex text-sm rounded-full focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-green-light flex items-center justify-center">
                      <span className="text-white font-semibold">{userInitials}</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="p-2 text-white hover:bg-green-medium">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-green-dark text-white border-green-medium">
                  <SheetHeader>
                    <SheetTitle className="text-white font-serif flex items-center">
                      <img 
                        src={stormLogo} 
                        alt="Chamberlain Storm" 
                        className="h-8 w-auto mr-2"
                      />
                      Storm Career Connect
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-6 flex flex-col">
                    {navLinks.map((link) => (
                      <Link key={link.path} href={link.path}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                          isActive(link.path)
                            ? "bg-green-medium text-white"
                            : "text-green-pale hover:bg-green-medium hover:text-white"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                        {link.label}
                      </Link>
                    ))}
                    <div className="mt-auto pt-4 border-t border-green-medium">
                      <div className="px-3 py-2 text-sm font-medium text-green-pale">
                        Signed in as <span className="font-bold text-white">{user?.name}</span>
                      </div>
                      <Link href="/profile"
                        className="mt-1 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-green-pale hover:bg-green-medium hover:text-white flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <Link href="/notifications"
                        className="mt-1 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-green-pale hover:bg-green-medium hover:text-white flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </Link>
                      <Link href="/career-events"
                        className="mt-1 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-green-pale hover:bg-green-medium hover:text-white flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Events
                      </Link>
                      <Link href="/favorites"
                        className="mt-1 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-green-pale hover:bg-green-medium hover:text-white flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites {favorites.length > 0 && `(${favorites.length})`}
                      </Link>
                      <Link href="/mentor-cart"
                        className="mt-1 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-green-pale hover:bg-green-medium hover:text-white flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Cart {cart.length > 0 && `(${cart.length})`}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="mt-1 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-green-pale hover:bg-green-medium hover:text-white flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

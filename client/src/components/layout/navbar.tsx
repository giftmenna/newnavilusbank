import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  // Add logging for debugging
  console.log('Navbar render:', { user, location, mobileMenuOpen });

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "??";
    
    const nameMatch = user.username.match(/\b(\w)/g);
    if (nameMatch && nameMatch.length > 0) {
      return nameMatch.slice(0, 2).join('').toUpperCase();
    }
    
    return user.username.substring(0, 2).toUpperCase();
  };

  // Check if a link is active
  const isActive = (path: string) => {
    return location === path || location.startsWith(`${path}/`);
  };

  // Custom link component to avoid nesting <a> inside <Link>
  const NavLink = ({ href, children, className }: { href: string, children: React.ReactNode, className: string }) => (
    <Link href={href}>
      <span className={`${className} cursor-pointer`}>{children}</span>
    </Link>
  );

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="150"
                  height="50"
                  viewBox="0 0 150 50"
                  className="h-12 w-36"
                >
                  <g fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,10 L30,40 M30,10 L20,40 M40,10 L40,40 M50,10 L50,40 M60,10 L70,25 L60,40 M80,10 L75,25 L80,40 M90,10 L90,40 M90,25 L100,25 M110,10 L110,40 L120,40 M130,10 L130,40" />
                  </g>
                  <text x="20" y="45" fill="#FFD700" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="bold">
                    NIVALUS BANK
                  </text>
                </svg>
              </Link>
            </div>
            
            {/* Public Pages Navigation - only shown when not authenticated or on homepage */}
            {(!user || location === "/") && (
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                <NavLink 
                  href="/aboutus"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive("/aboutus") 
                      ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                  }`}
                >
                  About
                </NavLink>
                <NavLink 
                  href="/careers"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive("/careers") 
                      ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                  }`}
                >
                  Careers
                </NavLink>
                <NavLink 
                  href="/contact"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive("/contact") 
                      ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                  }`}
                >
                  Contact
                </NavLink>
              </nav>
            )}
            
            {/* Authenticated User Navigation */}
            {user && (
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                {user.role === "user" && (
                  <>
                    <NavLink 
                      href="/dashboard"
                      className={`px-3 py-2 text-sm font-medium ${
                        isActive("/dashboard") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink 
                      href="/transfer"
                      className={`px-3 py-2 text-sm font-medium ${
                        isActive("/transfer") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}
                    >
                      Transfer
                    </NavLink>
                    <NavLink 
                      href="/history"
                      className={`px-3 py-2 text-sm font-medium ${
                        isActive("/history") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}
                    >
                      History
                    </NavLink>
                  </>
                )}
                
                {user.role === "admin" && (
                  <>
                    <NavLink 
                      href="/admin"
                      className={`px-3 py-2 text-sm font-medium ${
                        isActive("/admin") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink 
                      href="/admin/users"
                      className={`px-3 py-2 text-sm font-medium ${
                        isActive("/admin/users") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}
                    >
                      Users
                    </NavLink>
                    <NavLink 
                      href="/admin/transactions"
                      className={`px-3 py-2 text-sm font-medium ${
                        isActive("/admin/transactions") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}
                    >
                      Transactions
                    </NavLink>
                  </>
                )}
              </nav>
            )}
          </div>
          
          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Theme Toggle */}
            <div className="mr-2">
              <ThemeToggle />
            </div>
            
            {/* Sign in button for guests */}
            {!user && (
              <div className="hidden sm:block ml-2">
                <Link href="/auth">
                  <Button variant="default" size="sm">Sign in</Button>
                </Link>
              </div>
            )}
            
            {/* User profile dropdown for authenticated users */}
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage src={user.avatar || ""} alt={user.username} />
                        <AvatarFallback className="bg-primary-200 text-primary-700">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user.username}
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {/* Public pages - only shown when not authenticated or on homepage */}
            {(!user || location === "/") && (
              <>
                <NavLink 
                  href="/aboutus"
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/aboutus") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  About
                </NavLink>
                <NavLink 
                  href="/careers"
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/careers") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Careers
                </NavLink>
                <NavLink 
                  href="/contact"
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/contact") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Contact
                </NavLink>
              </>
            )}
            
            {/* User specific pages */}
            {user && (
              <>
                {user.role === "user" && (
                  <>
                    <NavLink 
                      href="/dashboard"
                      className={`block px-3 py-2 text-base font-medium ${
                        isActive("/dashboard") 
                          ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink 
                      href="/transfer"
                      className={`block px-3 py-2 text-base font-medium ${
                        isActive("/transfer") 
                          ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      Transfer
                    </NavLink>
                    <NavLink 
                      href="/history"
                      className={`block px-3 py-2 text-base font-medium ${
                        isActive("/history") 
                          ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      History
                    </NavLink>
                  </>
                )}
                
                {user.role === "admin" && (
                  <>
                    <NavLink 
                      href="/admin"
                      className={`block px-3 py-2 text-base font-medium ${
                        isActive("/admin") 
                          ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink 
                      href="/admin/users"
                      className={`block px-3 py-2 text-base font-medium ${
                        isActive("/admin/users") 
                          ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      Users
                    </NavLink>
                    <NavLink 
                      href="/admin/transactions"
                      className={`block px-3 py-2 text-base font-medium ${
                        isActive("/admin/transactions") 
                          ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      Transactions
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* User profile section for authenticated users */}
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={user.avatar || ""} alt={user.username} />
                    <AvatarFallback className="bg-primary-200 text-primary-700">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user.username}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <NavLink 
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Profile
                </NavLink>
                <div className="flex items-center px-4 py-2">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300 mr-2">Theme:</span>
                  <ThemeToggle />
                </div>
                <button 
                  onClick={() => logoutMutation.mutate()} 
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
          
          {/* Guest options */}
          {!user && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                <NavLink 
                  href="/auth"
                  className="block px-4 py-2 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Sign in / Register
                </NavLink>
                <div className="flex items-center px-4 py-2">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300 mr-2">Theme:</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
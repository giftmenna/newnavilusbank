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

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

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

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold cursor-pointer">
                  NB
                </div>
              </Link>
              <Link href="/">
                <span className="ml-2 text-xl font-semibold text-primary-500 cursor-pointer">Nivalus Bank</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            {user && (
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                {user.role === "user" && (
                  <>
                    <Link href="/dashboard">
                      <a className={`px-3 py-2 text-sm font-medium ${
                        isActive("/dashboard") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}>
                        Dashboard
                      </a>
                    </Link>
                    <Link href="/transfer">
                      <a className={`px-3 py-2 text-sm font-medium ${
                        isActive("/transfer") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}>
                        Transfer
                      </a>
                    </Link>
                    <Link href="/history">
                      <a className={`px-3 py-2 text-sm font-medium ${
                        isActive("/history") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}>
                        History
                      </a>
                    </Link>
                  </>
                )}
                
                {user.role === "admin" && (
                  <>
                    <Link href="/admin">
                      <a className={`px-3 py-2 text-sm font-medium ${
                        isActive("/admin") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}>
                        Dashboard
                      </a>
                    </Link>
                    <Link href="/admin/users">
                      <a className={`px-3 py-2 text-sm font-medium ${
                        isActive("/admin/users") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}>
                        Users
                      </a>
                    </Link>
                    <Link href="/admin/transactions">
                      <a className={`px-3 py-2 text-sm font-medium ${
                        isActive("/admin/transactions") 
                          ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                      }`}>
                        Transactions
                      </a>
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>
          
          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center">
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
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
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
      {mobileMenuOpen && user && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user.role === "user" && (
              <>
                <Link href="/dashboard">
                  <a className={`block px-3 py-2 text-base font-medium ${
                    isActive("/dashboard") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}>
                    Dashboard
                  </a>
                </Link>
                <Link href="/transfer">
                  <a className={`block px-3 py-2 text-base font-medium ${
                    isActive("/transfer") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}>
                    Transfer
                  </a>
                </Link>
                <Link href="/history">
                  <a className={`block px-3 py-2 text-base font-medium ${
                    isActive("/history") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}>
                    History
                  </a>
                </Link>
              </>
            )}
            
            {user.role === "admin" && (
              <>
                <Link href="/admin">
                  <a className={`block px-3 py-2 text-base font-medium ${
                    isActive("/admin") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}>
                    Dashboard
                  </a>
                </Link>
                <Link href="/admin/users">
                  <a className={`block px-3 py-2 text-base font-medium ${
                    isActive("/admin/users") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}>
                    Users
                  </a>
                </Link>
                <Link href="/admin/transactions">
                  <a className={`block px-3 py-2 text-base font-medium ${
                    isActive("/admin/transactions") 
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 dark:border-primary-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}>
                    Transactions
                  </a>
                </Link>
              </>
            )}
          </div>
          
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
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Settings
              </a>
              <button 
                onClick={() => logoutMutation.mutate()} 
                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

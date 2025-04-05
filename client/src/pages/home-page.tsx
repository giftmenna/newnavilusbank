import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">NB</span>
                <span className="ml-2 text-xl font-semibold text-primary-500">Nivalus Bank</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button
                  onClick={() => setLocation(user.role === "admin" ? "/admin" : "/dashboard")}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/auth?tab=signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                Banking Made <span className="text-primary-500">Simple</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 dark:text-gray-300">
                Secure, reliable banking solutions for all your financial needs.
              </p>
              {!user && (
                <div className="mt-10">
                  <Link href="/auth?tab=signup">
                    <Button size="lg" className="rounded-md shadow px-8 py-6 text-lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Our Services
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
                Experience the best of digital banking with Nivalus Bank.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Easy Transfers</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Transfer money to anyone, anywhere, anytime with our simple and secure platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Transaction History</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Keep track of all your transactions with detailed history and receipts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Secure Banking</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Advanced security features including PIN verification for all transactions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

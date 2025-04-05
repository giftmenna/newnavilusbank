import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold cursor-pointer">
                NB
              </div>
            </Link>
            <Link href="/">
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white cursor-pointer">Nivalus Bank</span>
            </Link>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Terms of Service
            </a>
            <a href="mailto:support@nivalusbank.com" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Nivalus Bank. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

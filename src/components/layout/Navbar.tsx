'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiMic, FiFileText, FiBook, FiBarChart2 } from 'react-icons/fi';
import { ThemeToggle } from '../ui/ThemeToggle';

const navItems = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Mock Interview', href: '/interview-selection', icon: FiMic },
  { name: 'CV Comparison', href: '/cv-comparison', icon: FiFileText },
  { name: 'Study Guides', href: '/study-guides', icon: FiBook },
  { name: 'Results', href: '/results', icon: FiBarChart2 },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                HireWise AI
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

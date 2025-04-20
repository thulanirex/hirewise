'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUser, FiFileText, FiBook, FiBarChart2, FiClock } from 'react-icons/fi';

const navItems = [
  { name: 'Interview', href: '/', icon: FiHome },
  { name: 'Questions', href: '/study-guides', icon: FiBook },
  { name: 'Study Guides', href: '/study-guides', icon: FiClock },
];

const recentItems = [
  { name: 'Last Week', href: '/recent/last-week' },
  { name: 'Manage product crisis', href: '/recent/product-crisis' },
  { name: 'Manage unknown situations', href: '/recent/unknown-situations' },
  { name: 'LinkedIn global user count', href: '/recent/linkedin-users' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mocked</h1>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8">
          <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            RECENT
          </h2>
          <div className="mt-2 space-y-1">
            {recentItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

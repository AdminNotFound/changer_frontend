'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, X } from 'lucide-react';
import { APP_NAV_ITEMS } from './nav-items';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils/cn';

export function AppSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-gray-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 text-white shadow-md shadow-purple-200">
          <Briefcase className="h-5 w-5" />
        </div>
        <span className="text-base font-bold text-gray-900 tracking-tight">
          AI Job Maker
        </span>
        <button
          type="button"
          className="ml-auto lg:hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {APP_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-purple-100/90 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-purple-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-gray-100 bg-white z-30">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}

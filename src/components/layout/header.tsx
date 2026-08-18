'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Menu, X, User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useLogoutMutation } from '@/features/auth/hooks/use-auth-mutations';

export function Header() {
  const pathname = usePathname();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const logoutMutation = useLogoutMutation();
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();

  const navLinks = [
    { href: '/', label: 'My Resumes' },
    { href: '/edit', label: 'Edit Resume' },
    { href: '/check-score', label: 'Check Score' },
    { href: '/tailor', label: 'Tailor for Job' },
    { href: '/settings', label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100/80 bg-white/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 text-white shadow-md shadow-purple-200">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            AI Job Maker
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? 'bg-purple-100/80 text-purple-700 font-semibold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isUserLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 max-w-[200px] truncate">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="text-gray-500 hover:text-red-600 h-8 px-2"
                title="Log Out"
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-purple-100 text-purple-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
                  <UserIcon className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={logoutMutation.isPending}
                  className="text-red-600 text-xs shrink-0"
                >
                  Log Out
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}

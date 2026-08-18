'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, Menu, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useLogoutMutation } from '@/features/auth/hooks/use-auth-mutations';
import { useUIStore } from '@/stores/ui-store';

type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogoutMutation();
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title ? (
          <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
            {title}
          </h1>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="max-w-[220px] gap-2 rounded-full"
            >
              <UserIcon className="h-4 w-4 text-purple-600 shrink-0" />
              <span className="truncate text-xs">
                {user?.email ?? 'Account'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user?.name ?? 'Signed in'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/resumes">My Resumes</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700"
              disabled={logoutMutation.isPending}
              onSelect={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

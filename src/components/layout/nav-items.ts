import {
  FileText,
  Gauge,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type AppNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resumes', label: 'My Resumes', icon: FileText },
  { href: '/check-score', label: 'ATS Score', icon: Gauge },
  { href: '/tailor', label: 'Tailor Resume', icon: Sparkles },
  { href: '/cover-letters', label: 'Cover Letters', icon: Mail },
  { href: '/settings', label: 'Settings', icon: Settings },
];

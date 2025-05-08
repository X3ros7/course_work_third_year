'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Disc3,
  HelpCircle,
  ChevronUp,
  User2,
  LogOut,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/authService';
import useUser from '@/hooks/useUser';
import Image from 'next/image';
const routes = [
  {
    label: 'Products',
    href: '/products',
    icon: Disc3,
  },
  {
    label: 'Auction',
    href: '/auction',
    icon: DollarSign,
  },
  {
    label: 'About',
    href: '/about',
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { userName, avatar, isLoading } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Display username or loading indicator
  const displayName = isLoading ? 'Loading...' : userName || 'User';

  return (
    <Sidebar className="bg-white border-none shadow-none">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          {routes.map((route) => (
            <SidebarMenuItem key={route.label}>
              <SidebarMenuButton asChild>
                <Link href={route.href}>
                  <route.icon className="mr-2 h-6 w-6 text-blue-500" />
                  {route.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="
                    flex items-center gap-2 w-full px-3 py-2 rounded-md
                    transition-colors duration-150
                    hover:bg-blue-50
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-200
                  "
                >
                  {avatar && (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium text-sm truncate">
                    {displayName}
                  </span>
                  <ChevronUp className="ml-auto text-gray-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Link href="/user/me" className="w-full">
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  <div className="flex items-center w-full text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

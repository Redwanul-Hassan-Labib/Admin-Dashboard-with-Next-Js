'use client';

import { SignedIn, UserButton } from '@clerk/nextjs';
import { LayoutDashboard, MoreVerticalIcon, Newspaper, Package, ShoppingCart, Tags, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

// import AdditionalInfoForm from "./instructor/AdditionalInfoForm";
// import BecomeInstructorForm from "./student/BecomeInstructorForm";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '../global/logo';

// Map of icon names to their corresponding components
const iconMap = {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  Newspaper,
} as const;

export type IconMapKey = keyof typeof iconMap;

export interface DashboardSidebarProps {
  title: string;
  url: string;
  icon: IconMapKey;
}

export function DashboardSidebar({ menu = [] }: { menu: DashboardSidebarProps[] }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  // Function to determine if a menu item is active
  const isActive = (url: string) => {
    if (!url) return false;
    // Exact match for dashboard routes
    if (['/customer', '/admin'].includes(url)) {
      return pathname === url;
    }
    // Partial match for other routes
    return pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                const IconComponent = iconMap[item?.icon];

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton className={`dark:hover:bg-dark-lite hover:bg-gray-100 ${isActive(item?.url) ? 'dark:bg-dark-lite bg-gray-100' : ''}`} asChild>
                      <Link
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            toggleSidebar();
                          }
                        }}
                        href={item?.url || '#'}
                        className="">
                        {IconComponent ? <IconComponent /> : null}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <SignedIn>
            <Suspense fallback={<div className="h-10 w-10 rounded-full">loading</div>}>
              <UserButton
                showName={true}
                appearance={{
                  elements: {
                    userButtonBox: 'flex !flex-row-reverse items-center gap-2',
                  },
                }}>
                {/* Only show Additional Info section for instructors */}
                {/* {role === "instructor" && (
                <UserButton.UserProfilePage
                  url="/user-additional-info"
                  label="Additional info"
                  labelIcon={<IconInfoCircleFilled size={16} />}
                  alongside={true}
                >
                  <AdditionalInfoForm />
                </UserButton.UserProfilePage>
              )} */}

                {/* Only show Become Instructor section for students */}
                {/* {role === "student" && (
                <UserButton.UserProfilePage
                  url="/request-instructor-role"
                  label="Become Instructor"
                  labelIcon={<UserPlus size={16} />}
                  alongside={true}
                >
                  <BecomeInstructorForm />
                </UserButton.UserProfilePage>
              )} */}
              </UserButton>
            </Suspense>
          </SignedIn>
          <MoreVerticalIcon className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

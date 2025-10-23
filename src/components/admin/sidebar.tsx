'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ParkingSquare, 
  LayoutDashboard, 
  BrainCircuit, 
  Users, 
  MapPin, 
  BookMarked, 
  BarChart3, 
  LogOut 
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <Link href="/admin/dashboard" className="flex items-center gap-1.5">
          <ParkingSquare className="w-5 h-5 text-primary" />
          <span className="font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden text-xs">SmartParkr</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-1.5 flex-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'} tooltip="Dashboard" size="sm">
              <Link href="/admin/dashboard">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span className="text-xs">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/predict')} tooltip="Demand Prediction" size="sm">
               <Link href="/admin/predict">
                <BrainCircuit className="h-3.5 w-3.5" />
                <span className="text-xs">Prediction</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup className="mt-3">
          <SidebarGroupLabel className="text-[10px]">Management</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/lots')} tooltip="Parking Lots" size="sm">
                <Link href="/admin/lots">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-xs">Parking Lots</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/bookings')} tooltip="Bookings" size="sm">
                <Link href="/admin/bookings">
                  <BookMarked className="h-3.5 w-3.5" />
                  <span className="text-xs">Bookings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/users')} tooltip="Users" size="sm">
                <Link href="/admin/users">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-xs">Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-1.5">
         <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout" size="sm">
                <Link href="/">
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="text-xs">Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
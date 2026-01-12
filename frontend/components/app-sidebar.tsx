"use client"

import { Calendar, CalendarClock, CheckCircle, CalendarCheck, Plus, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { removeAuthToken } from "@/lib/auth"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Profile } from "@/components/ui/profile"

import Link from "next/link"
// Menu items.
const items = [
  {
    title: "Add task",
    url: "/add_Task",
    icon: Plus,
  },
  {
    title: "Upcoming",
    url: "/dashboard",
    icon: CalendarClock,
  },
  {
    title: "Today",
    url: "/today",
    icon: CalendarCheck,
  },
  {
    title: "Completed",
    url: "/completed",
    icon: CheckCircle,
  },
  {
    title: "Settings",
    url: "/profile",
    icon: Settings,
  },
]

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  return (
    <Sidebar className="border-[#ffffff] rounded-r-1xl" style={{ backgroundColor: '#14B8A6' }}>
      <SidebarContent style={{ backgroundColor: '#14B8A6' }} className="rounded-r-3xl border-0">
        <SidebarGroup className="mt-6">  {/* Changed from mt-8 to mt-4 */}
          <SidebarGroupLabel className="text-white/90 text-base font-semibold">
            <Profile />
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">  {/* Added spacing between profile and menu */}
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="text-black hover:bg-[#9CD9D3] data-[active=true]:bg-[#0d9488] data-[active=true]:text-white"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter style={{ backgroundColor: '#14B8A6' }} className="border-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
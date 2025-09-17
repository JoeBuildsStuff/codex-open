"use client"

import {
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Moon,
  Settings,
  Sun,
} from "lucide-react"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { CurrentUserAvatar } from "@/components/current-user-avatar"
import { useTheme } from "next-themes"

interface AuthButtonProps {
  size?: "default" | "icon"
}

export function AuthButton({ size = "default" }: AuthButtonProps) {
  const { isMobile } = useSidebar()
  const { user, isLoading, signOut } = useAuth()
  const { setTheme, resolvedTheme } = useTheme();

  if (isLoading) {
    if (size === "icon") {
      return (
        <Button variant="ghost" size="icon" disabled>
          <Avatar className="h-6 w-6 rounded-lg grayscale">
            <AvatarFallback className="rounded-lg">...</AvatarFallback>
          </Avatar>
        </Button>
      )
    }
    
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            disabled
          >
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarFallback className="rounded-lg">...</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading...</span>
              <span className="text-muted-foreground truncate text-xs">
                Please wait
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!user) {
    if (size === "icon") {
      return (
        <Button asChild variant="ghost">
          <Link href="/signin">
            Log In or Sign Up
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      )
    }
    
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Button asChild variant="outline" className="w-full justify-center">
            <Link href="/signin">
              Sign In
            </Link>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || "User";

  if (size === "icon") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <CurrentUserAvatar />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <CurrentUserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="font-light">
            <Settings className="size-4" strokeWidth={1.5}/>
            <span className="font-light">Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            {resolvedTheme === "dark" ? (
              <>
                <Sun className="size-4" strokeWidth={1.5}/>
                <span className="font-light">Toggle Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="size-4" strokeWidth={1.5}/>
                <span className="font-light">Toggle Dark Mode</span>
              </>
            )}
            <span className="sr-only">Toggle Theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={async () => await signOut()}>
            <LogOut className="size-4" strokeWidth={1.5}/>
            <span className="font-light">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
            <CurrentUserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <CurrentUserAvatar />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-light">
              <Settings className="size-4" strokeWidth={1.5}/>
              <span className="font-light">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {resolvedTheme === "dark" ? (
                <>
                  <Sun className="size-4" strokeWidth={1.5}/>
                  <span className="font-light">Toggle Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="size-4" strokeWidth={1.5}/>
                  <span className="font-light">Toggle Dark Mode</span>
                </>
              )}
              <span className="sr-only">Toggle Theme</span>
          
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => await signOut()}>
              <LogOut className="size-4" strokeWidth={1.5}/>
              <span className="font-light">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

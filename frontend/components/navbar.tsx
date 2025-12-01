"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageCircle, Home, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navLinks = [
    { href: "/feed", label: "Home", icon: Home },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-xl font-bold sm:inline-block">Social</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("gap-2", isActive && "bg-secondary text-secondary-foreground")}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{link.label}</span>
                </Button>
              </Link>
            )
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative ml-2 h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">@{user?.username}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}

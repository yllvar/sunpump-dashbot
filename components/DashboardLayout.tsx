import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Wallet, Repeat, Info, LayoutDashboard, Plus, BookOpen } from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/transfer', label: 'Transfer', icon: Repeat },
    { href: '/swap', label: 'Swap', icon: Repeat },
    { href: '/info', label: 'Token Info', icon: Info },
    { href: '/create-token', label: 'Create Token', icon: Plus },
    { href: '/documentation', label: 'Documentation', icon: BookOpen },
  ]

  return (
    <div className="flex h-screen bg-[#F6B17A]">
      <aside className="w-64 bg-[#FF9D3D] shadow-md">
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start mb-1 text-primary",
                  pathname === item.href ? "bg-gray-100" : ""
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 bg-[#FF9D3D]">
        {children}
      </main>
    </div>
  )
}


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  Users,
  FileEdit,
  Archive,
  BarChart3,
  Settings,
  Building2,
  Inbox,
  Send,
  FileX,
} from "lucide-react"

const menuItems = [
  {
    title: "Документы",
    items: [
      { icon: Inbox, label: "Входящие", href: "/documents/inbox" },
      { icon: Send, label: "Исходящие", href: "/documents/sent" },
      { icon: FileX, label: "Черновики", href: "/documents/draft" },
      { icon: FileText, label: "Все документы", href: "/documents" },
    ],
  },
  {
    title: "Контрагенты",
    icon: Users,
    href: "/partners",
  },
  {
    title: "Шаблоны",
    icon: FileEdit,
    href: "/templates",
  },
  {
    title: "Архив",
    icon: Archive,
    href: "/archive",
  },
  {
    title: "Отчёты",
    icon: BarChart3,
    href: "/reports",
  },
  {
    title: "Профиль компании",
    icon: Building2,
    href: "/company",
  },
  {
    title: "Настройки",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r bg-background lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item, index) => {
          if (item.items) {
            return (
              <div key={index} className="mb-2">
                <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </p>
                {item.items.map((subItem) => {
                  const Icon = subItem.icon
                  const isActive = pathname === subItem.href
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {subItem.label}
                    </Link>
                  )
                })}
              </div>
            )
          }

          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}




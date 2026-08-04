"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, User, Briefcase, Mail, GraduationCap, Music, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/about", label: "About", icon: User },
  { href: "/contact", label: "Contact", icon: Mail },
]

const easterEggs = [
  { href: "/education", label: "Education", icon: GraduationCap },
  { href: "/music", label: "Music", icon: Music },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
      <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={cn(
              "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
              scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50" : "bg-transparent",
          )}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Artemiy Pankratov
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                            pathname === item.href ? "text-primary" : "text-muted-foreground",
                        )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                )
              })}

              {/* Easter Egg Icons */}
              <div className="flex items-center space-x-2 ml-4">
                {easterEggs.map((item) => {
                  const Icon = item.icon
                  return (
                      <Link
                          key={item.href}
                          href={item.href}
                          className="p-2 rounded-full hover:bg-accent transition-colors opacity-50 hover:opacity-100"
                          title={item.label}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                  )
                })}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button and Theme Toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden mt-4 pb-4 border-t border-border/50 bg-background/95 backdrop-blur-md rounded-b-lg overflow-hidden"
                >
                  <div className="flex flex-col space-y-4 pt-4">
                    {[...navItems, ...easterEggs].map((item, index) => {
                      const Icon = item.icon
                      return (
                          <motion.div
                              key={item.href}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                          >
                            <Link
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                                )}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
  )
}

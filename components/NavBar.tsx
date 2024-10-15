'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu} from 'lucide-react'

interface NavBarProps {
  activeSection: string;
  scrollToSection?: (sectionId: 'home' | 'about' | 'faculty' | 'events') => void;
}

export default function NavBar({ activeSection, scrollToSection }: NavBarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (sectionId: string) => {
    if (pathname === '/') {
      if (scrollToSection) {
        scrollToSection(sectionId as 'home' | 'about' | 'faculty' | 'events');
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
    setIsOpen(false);
  };
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className="fixed w-full transition-all duration-300 z-50 bg-gray-900 bg-opacity-90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/csi_logo.png" alt="CSI Logo" width={40} height={40} className="rounded-full bg-white" />
            <span className="text-xl font-bold text-blue-300">CSI SRMIST</span>
          </Link>
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink href="/" isActive={pathname === '/' && activeSection === 'home'} onClick={() => handleNavigation('home')}>Home</NavLink>
            <NavLink href="/#about" isActive={pathname === '/' && activeSection === 'about'} onClick={() => handleNavigation('about')}>About</NavLink>
            <NavLink href="/#faculty" isActive={pathname === '/' && activeSection === 'faculty'} onClick={() => handleNavigation('faculty')}>Faculty</NavLink>
            <NavLink href="/#events" isActive={pathname === '/' && activeSection === 'events'} onClick={() => handleNavigation('events')}>Events</NavLink>
            <NavLink href="/team" isActive={pathname === '/team'}>Team</NavLink>
            <Link href="/join-us">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Join Us
            </Button>
            </Link>
          </nav>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-blue-300" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900">
              <nav className="flex flex-col space-y-4 mt-8">
                <MobileNavLink href="/" isActive={pathname === '/' && activeSection === 'home'} onClick={() => handleNavigation('home')}>Home</MobileNavLink>
                <MobileNavLink href="/#about" isActive={pathname === '/' && activeSection === 'about'} onClick={() => handleNavigation('about')}>About</MobileNavLink>
                <MobileNavLink href="/#faculty" isActive={pathname === '/' && activeSection === 'faculty'} onClick={() => handleNavigation('faculty')}>Faculty</MobileNavLink>
                <MobileNavLink href="/#events" isActive={pathname === '/' && activeSection === 'events'} onClick={() => handleNavigation('events')}>Events</MobileNavLink>
                <MobileNavLink href="/team" isActive={pathname === '/team'}>Team</MobileNavLink>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  Join Us
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, children, isActive, onClick }: NavLinkProps) => (
  <Link 
    href={href} 
    className={`text-lg font-medium transition-colors ${
      isActive ? 'text-white' : 'text-blue-300 hover:text-white'
    }`}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault()
        onClick()
      }
    }}
  >
    {children}
  </Link>
)

const MobileNavLink = ({ href, children, isActive, onClick }: NavLinkProps) => (
  <Link 
    href={href} 
    className={`text-xl font-medium transition-colors ${
      isActive ? 'text-white' : 'text-blue-300 hover:text-white'
    }`}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault()
        onClick()
      }
    }}
  >
    {children}
  </Link>
)
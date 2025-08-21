'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

interface NavBarProps {
  activeSection: string;
  scrollToSection?: (sectionId: 'home' | 'about' | 'faculty' | 'events') => void;
}

export default function NavBar({ activeSection, scrollToSection }: NavBarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (sectionId: string) => {
    // Special case for events - always go to events page
    if (sectionId === 'events') {
      window.location.href = '/events';
      setIsOpen(false);
      return;
    }

    // Handle other navigation cases
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
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <header className="fixed w-full bg-white shadow-lg py-2 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative overflow-hidden rounded-full bg-white/90 p-1 transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/csi_logo.png" 
                alt="CSI Logo" 
                width={45} 
                height={45} 
                className="rounded-full transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <span className="text-xl font-bold text-sky-500 transition-colors duration-300 group-hover:text-sky-600">
              CSI SRMIST
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/" isActive={pathname === '/' && activeSection === 'home'} onClick={() => handleNavigation('home')}>Home</NavLink>
            <NavLink href="/#about" isActive={pathname === '/' && activeSection === 'about'} onClick={() => handleNavigation('about')}>About</NavLink>
            <NavLink href="/#faculty" isActive={pathname === '/' && activeSection === 'faculty'} onClick={() => handleNavigation('faculty')}>Faculty</NavLink>
            <NavLink 
              href="/#events" 
              isActive={pathname === '/' && activeSection === 'events'} 
              onClick={() => handleNavigation('events')}
            >
              Events
            </NavLink>
            <NavLink href="/team" isActive={pathname === '/team'}>Team</NavLink>
            <Link href="/join-us">
              <button className="ml-4 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                Register
              </button>
            </Link>
          </nav>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} onClick={() => setIsOpen(false)} />
        <div className={`fixed inset-y-0 right-0 w-[300px] bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <nav className="flex flex-col space-y-2 mt-16">
            <MobileNavLink href="/" isActive={pathname === '/' && activeSection === 'home'} onClick={() => handleNavigation('home')}>Home</MobileNavLink>
            <MobileNavLink href="/#about" isActive={pathname === '/' && activeSection === 'about'} onClick={() => handleNavigation('about')}>About</MobileNavLink>
            <MobileNavLink href="/#faculty" isActive={pathname === '/' && activeSection === 'faculty'} onClick={() => handleNavigation('faculty')}>Faculty</MobileNavLink>
            <MobileNavLink 
              href="/#events" 
              isActive={pathname === '/' && activeSection === 'events'} 
              onClick={() => handleNavigation('events')}
            >
              Events
            </MobileNavLink>
            <MobileNavLink href="/team" isActive={pathname === '/team'}>Team</MobileNavLink>
            <div className="pt-4">
              <Link href="/join-us" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg active:scale-95">
                  Join Us
                </button>
              </Link>
            </div>
          </nav>
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
  className?: string;
}

const NavLink = ({ href, children, isActive, onClick, className }: NavLinkProps) => (
  <Link 
    href={href} 
    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
      ${isActive 
        ? `text-sky-600 bg-sky-50/80` 
        : `text-sky-500 hover:text-sky-600 hover:bg-sky-50/50`
      }
      ${className || ''}
    `}
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

const MobileNavLink = ({ href, children, isActive, onClick, className }: NavLinkProps) => (
  <Link 
    href={href} 
    className={`p-3 text-lg font-medium rounded-xl transition-colors ${
      isActive 
        ? 'text-sky-600 bg-sky-50' 
        : 'text-sky-500 hover:text-sky-600 hover:bg-sky-50/50'
    } ${className || ''}`}
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
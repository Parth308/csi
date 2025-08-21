"use client"
import { useState, useEffect, useRef } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import FacultySection from '@/components/FacultySection'
import ClubInfoSection from '@/components/ClubInfoSection'
import EventsSection from '@/components/EventsSection'
import CoolEventsSection from '@/components/CoolEventsSection'

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('home')
  const sectionRefs: { [key in 'home' | 'about' | 'faculty' | 'events']: React.RefObject<HTMLDivElement> } = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    faculty: useRef<HTMLDivElement>(null),
    events: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for header

      Object.entries(sectionRefs).forEach(([section, ref]) => {
        if (ref.current && ref.current.offsetTop <= scrollPosition && ref.current.offsetTop + ref.current.offsetHeight > scrollPosition) {
          setActiveSection(section)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionRefs])

  const scrollToSection = (sectionId: 'home' | 'about' | 'faculty' | 'events') => {
    const section = sectionRefs[sectionId]?.current
    if (section) {
      const start = window.pageYOffset
      const target = section.offsetTop
      const distance = target - start
      const duration = 1000 // ms
      let startTime: number | null = null

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const run = easeInOutQuad(timeElapsed, start, distance, duration)
        window.scrollTo(0, run)
        if (timeElapsed < duration) requestAnimationFrame(animation)
      }

      requestAnimationFrame(animation)
    }
  }

  // Easing function
  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }
   let savedTheme;
  useEffect(() => {
    savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme);
    }
  }, []);
  const [isDark, setIsDark] = useState<string>(savedTheme ?? "dark");

  return (
    <div className={`min-h-screen bg-gray-900 text-blue-100 ${isDark === "dark" ? "dark" : ""} `}>
      <NavBar isDark={isDark} setIsDark={setIsDark} activeSection={activeSection} scrollToSection={scrollToSection} />
      <main>
        <div ref={sectionRefs.home}><HeroSection /></div>
        <div ref={sectionRefs.about}><AboutSection /></div>
        <div ref={sectionRefs.faculty}><FacultySection /></div>
        <ClubInfoSection />
        <div ref={sectionRefs.events}><EventsSection /></div>
        <CoolEventsSection />
      </main>
      <Footer />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import EventRegistrationForm from '@/components/EventRegistrationForm'
import ClosedRegistrationMessage from '@/components/ClosedRegistrationMessage'
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface Event {
  _id: string
  name: string
  date: string
  isOpen: boolean
}

export default function JoinUs() {
  const [events, setEvents] = useState<Event[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/admin/events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        setEvents(data.events.filter((event: Event) => event.isOpen))
      } catch (error) {
        console.error('Error fetching events:', error)
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchEvents()
  }, [toast])

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      })

      if (!response.ok) {
        const errorData: { error?: string } = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const data = await response.json()
      toast({
        title: "Registration successful",
        description: "Thank you for registering!",
        variant: "default",
      })
      console.log('Registration successful:', data)
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Registration failed",
        description: (error as Error).message || "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
        <div className="absolute top-0 w-full h-[60vh] bg-gradient-to-b from-gray-300 to-white z-0" />
        <NavBar activeSection={''} />
        <main className="flex-grow pt-20 relative z-1">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">Join Us</h1>
            <AnimatePresence mode="wait">
              {events.length > 0 ? (
                <EventRegistrationForm key="form" events={events} onSubmit={handleSubmit} />
              ) : (
                <ClosedRegistrationMessage key="closed" />
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ToastProvider>
  )
}
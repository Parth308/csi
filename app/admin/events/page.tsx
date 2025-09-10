'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddEventForm } from "@/components/AddEventForm"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Home, LayoutDashboard, Calendar, ChevronRight, Users } from 'lucide-react'
import { cn } from "@/lib/utils"
import CSILoading from '@/components/CsiLoading'

interface Event {
  _id: string
  name: string
  date: string
  isOpen: boolean
  teamSize: number
}

export default function EventsPage() {
  useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/admin/events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        setEvents(data.events)
      } catch (error: unknown) {
        console.error('Error fetching events:', error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const toggleEventRegistration = async (eventId: string, isOpen: boolean) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isOpen: !isOpen }),
      })
      if (!response.ok) throw new Error('Failed to toggle event registration')
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, isOpen: !isOpen } : event
      ))
      toast({
        title: isOpen ? "Event Registration Closed" : "Event Registration Opened",
        description: `Registration for this event is now ${isOpen ? 'closed' : 'open'}.`,
      })
    } catch (error) {
      console.error('Error toggling event registration:', error)
      toast({
        title: "Error",
        description: "Failed to toggle event registration status.",
        variant: "destructive",
      })
    }
  }

  const handleEventAdded = (newEvent: Event) => {
    setEvents([...events, newEvent])
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
        <Link href={`/admin`}>
          <div className="flex items-center justify-center h-16 bg-blue-600">
            <span className="text-2xl font-semibold text-white">CSI</span>
          </div>
          </Link>
          <nav className="flex-1 px-2 py-4 space-y-2">
            <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/events" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
              <Calendar className="mr-3 h-5 w-5" />
              Events
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <Button variant="outline" className="w-full justify-start text-gray-900" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Main Site
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link href="/admin/events">
            <h1 className="text-2xl font-semibold text-gray-900">Events Management</h1>
            </Link>
            <div className="flex space-x-2 text-gray-900">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <AddEventForm onEventAdded={handleEventAdded} />
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <CSILoading/>
            ) : error ? (
              <div className="text-center text-red-600">
                <p>Error: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">All Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px] text-gray-900">Event Name</TableHead>
                        <TableHead className="text-gray-900">Date</TableHead>
                        <TableHead className="text-gray-900">Team Size</TableHead>
                        <TableHead className="text-gray-900">Status</TableHead>
                        <TableHead className="text-gray-900">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event._id}>
                          <TableCell className="font-medium text-gray-900">{event.name}</TableCell>
                          <TableCell className="text-gray-900">
                            {new Date(event.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-900">
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4 text-gray-500" />
                              {event.teamSize} {event.teamSize === 1 ? 'member' : 'members'}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900">
                            {event.isOpen ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Open
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                Closed
                              </span>
                            )}
                          </TableCell>
                          <TableCell className='text-gray-900'>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`rounded-full ${event.isOpen ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                              onClick={() => toggleEventRegistration(event._id, event.isOpen)}
                            >
                              {event.isOpen ? 'Close Registration' : 'Open Registration'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
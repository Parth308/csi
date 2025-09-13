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
import { PlusCircle, Home, LayoutDashboard, Calendar, ChevronRight, Users, Building2, Eye, Edit, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import CSILoading from '@/components/CsiLoading'
import { Badge } from "@/components/ui/badge"

interface Question {
  id: string
  type: 'mcq' | 'text' | 'textarea' | 'number'
  question: string
  required: boolean
  options?: string[]
  maxLength?: number
  minLength?: number
  placeholder?: string
}

interface Team {
  id: string
  name: string
  description?: string
  maxMembers?: number
  questions: Question[]
}

interface Event {
  _id?: string
  name: string
  date: string
  isOpen: boolean
  eventType: 'team_registration' | 'recruitment'
  teamSize?: number
  teams?: Team[]
  commonQuestions?: Question[]
  allowMultipleTeamSelection?: boolean
  createdAt?: string
  updatedAt?: string
}

export default function EventsPage() {
  useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

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

  const toggleEventRegistration = async (eventId: string, isOpen: boolean) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: eventId, isOpen: !isOpen }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle event registration')
      }
      
      const updatedEvent = await response.json()
      setEvents(events.map(event => 
        event._id === eventId ? updatedEvent : event
      ))
      
      toast({
        title: isOpen ? "Event Registration Closed" : "Event Registration Opened",
        description: `Registration for this event is now ${isOpen ? 'closed' : 'open'}.`,
      })
    } catch (error) {
      console.error('Error toggling event registration:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle event registration status.",
        variant: "destructive",
      })
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: eventId }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete event')
      }
      
      setEvents(events.filter(event => event._id !== eventId))
      
      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete event.",
        variant: "destructive",
      })
    }
  }

  const handleEventAdded = (newEvent: Event) => {
    setEvents([...events, newEvent])
  }

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event._id === updatedEvent._id ? updatedEvent : event
    ))
    setShowEditDialog(false)
  }

  const showEventDetails = (event: Event) => {
    setSelectedEvent(event)
    setShowDetailsDialog(true)
  }

  const showEventEdit = (event: Event) => {
    setSelectedEvent(event)
    setShowEditDialog(true)
  }

  const getEventTypeDisplay = (eventType: string) => {
    switch (eventType) {
      case 'team_registration':
        return { label: 'Team Registration', color: 'bg-blue-100 text-blue-800' }
      case 'recruitment':
        return { label: 'Recruitment', color: 'bg-purple-100 text-purple-800' }
      default:
        return { label: eventType, color: 'bg-gray-100 text-gray-800' }
    }
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
            <div className="flex items-center justify-center h-16 bg-gray-800">
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
            <Button variant="outline" className="w-full justify-start text-gray-900 bg-gray-100 hover:bg-gray-200" asChild>
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
                  <Button variant="outline" className="bg-gray-100 hover:bg-gray-200">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-600">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <AddEventForm onEventAdded={handleEventAdded} />
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-200"
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
                <Button onClick={() => fetchEvents()} className="mt-4 bg-gray-800 hover:bg-gray-700">
                  Retry
                </Button>
              </div>
            ) : (
              <Card className="bg-white shadow-sm">
                <CardHeader className="bg-gray-50 rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-gray-900">All Events</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[200px] text-gray-900">Event Name</TableHead>
                          <TableHead className="text-gray-900">Type</TableHead>
                          <TableHead className="text-gray-900">Date</TableHead>
                          <TableHead className="text-gray-900">Configuration</TableHead>
                          <TableHead className="text-gray-900">Status</TableHead>
                          <TableHead className="text-gray-900">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event) => {
                          const eventTypeDisplay = getEventTypeDisplay(event.eventType)
                          return (
                            <TableRow key={event._id} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-gray-900">
                                {event.name}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                <Badge className={eventTypeDisplay.color}>
                                  {eventTypeDisplay.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {new Date(event.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {event.eventType === 'team_registration' ? (
                                  <div className="flex items-center">
                                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                                    {event.teamSize || 1} {(event.teamSize || 1) === 1 ? 'member' : 'members'}
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Building2 className="mr-2 h-4 w-4 text-gray-500" />
                                    {event.teams?.length || 0} teams
                                    {event.allowMultipleTeamSelection && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        Multiple
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {event.isOpen ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    Open
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800">
                                    Closed
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className='text-gray-900'>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => showEventDetails(event)}
                                    title="View Details"
                                    className="hover:bg-gray-200"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => showEventEdit(event)}
                                    title="Edit Event"
                                    className="hover:bg-gray-200"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${event.isOpen ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'} border-gray-300`}
                                    onClick={() => event._id && toggleEventRegistration(event._id, event.isOpen)}
                                    title={event.isOpen ? 'Close Registration' : 'Open Registration'}
                                  >
                                    {event.isOpen ? 'Close' : 'Open'}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => event._id && deleteEvent(event._id)}
                                    title="Delete Event"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {events.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                      <p className="text-gray-500">Get started by creating your first event.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Event Name</h3>
                  <p className="text-gray-600">{selectedEvent.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Event Type</h3>
                  <Badge className={getEventTypeDisplay(selectedEvent.eventType).color}>
                    {getEventTypeDisplay(selectedEvent.eventType).label}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Date</h3>
                  <p className="text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Status</h3>
                  <Badge className={selectedEvent.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {selectedEvent.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </div>

              {selectedEvent.eventType === 'team_registration' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Team Configuration</h3>
                  <p className="text-gray-600">Team Size: {selectedEvent.teamSize || 1} members</p>
                </div>
              )}

              {selectedEvent.eventType === 'recruitment' && (
                <>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Recruitment Configuration</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Multiple Team Selection: {selectedEvent.allowMultipleTeamSelection ? 'Allowed' : 'Not Allowed'}
                      </p>
                      <p className="text-gray-600">Teams: {selectedEvent.teams?.length || 0}</p>
                      <p className="text-gray-600">Common Questions: {selectedEvent.commonQuestions?.length || 0}</p>
                    </div>
                  </div>

                  {selectedEvent.teams && selectedEvent.teams.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Available Teams</h3>
                      <div className="space-y-3">
                        {selectedEvent.teams.map((team) => (
                          <div key={team.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{team.name}</h4>
                              {team.maxMembers && (
                                <Badge variant="outline">
                                  Max: {team.maxMembers} members
                                </Badge>
                              )}
                            </div>
                            {team.description && (
                              <p className="text-gray-600 mb-2">{team.description}</p>
                            )}
                            {team.questions && team.questions.length > 0 && (
                              <p className="text-sm text-gray-500">
                                {team.questions.length} custom questions
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEvent.commonQuestions && selectedEvent.commonQuestions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Common Questions</h3>
                      <div className="space-y-2">
                        {selectedEvent.commonQuestions.map((question, index) => (
                          <div key={question.id} className="border-l-4 border-blue-200 pl-4 py-2 bg-gray-50">
                            <p className="font-medium text-gray-900">
                              {index + 1}. {question.question}
                              {question.required && <span className="text-red-500 ml-1">*</span>}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {question.type.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-300">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailsDialog(false)}
                  className="bg-gray-100 hover:bg-gray-200"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setShowDetailsDialog(false)
                    showEventEdit(selectedEvent)
                  }}
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  Edit Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <AddEventForm 
              onEventAdded={handleEventUpdated} 
              editingEvent={selectedEvent}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
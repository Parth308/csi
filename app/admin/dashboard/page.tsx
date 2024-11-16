'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
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
import {  
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { Download, Users, Calendar, TrendingUp, Home, LayoutDashboard, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddEventForm } from "@/components/AddEventForm"
import { useToast } from "@/hooks/use-toast"

interface Registration {
  _id: string
  name: string
  registrationNumber: string
  officialEmail: string
  phoneNumber: string
  event: string | { _id: string; name: string }
  createdAt: string
}

interface Event {
  _id: string
  name: string
  date: string
  isOpen: boolean
}

export default function AdminDashboard() {
  const { status } = useSession()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<{
    totalRegistrations: number
    registrationsByEvent: { name: string; value: number }[]
    registrationTrend: { date: string; count: number }[]
  }>({
    totalRegistrations: 0,
    registrationsByEvent: [],
    registrationTrend: []
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/admin/login'
    }
  }, [status])

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated') return
      setLoading(true)
      setError(null)
      try {
        const [registrationsResponse, eventsResponse] = await Promise.all([
          fetch(`/api/admin/registrations?from=${dateRange?.from?.toISOString()}&to=${dateRange?.to?.toISOString()}`),
          fetch('/api/admin/events')
        ])
        
        if (!registrationsResponse.ok) throw new Error('Failed to fetch registrations')
        if (!eventsResponse.ok) throw new Error('Failed to fetch events')
        
        const registrationsData = await registrationsResponse.json()
        const eventsData = await eventsResponse.json()
        
        if (!registrationsData.registrations) {
          throw new Error('No registrations data received')
        }

        setRegistrations(registrationsData.registrations)
        setEvents(eventsData.events)

        const eventMap = eventsData.events.reduce((acc: Record<string, Event>, event: Event) => {
          acc[event._id] = event
          return acc
        }, {})
        
        // Calculate statistics
        const eventCounts = registrationsData.registrations.reduce((acc: Record<string, number>, reg: Registration) => {
          // const eventId = typeof reg.event === 'string' ? reg.event : reg.event._id
          const eventName = typeof reg.event === 'string' 
            ? (eventMap[reg.event]?.name || reg.event)
            : reg.event.name
          acc[eventName] = (acc[eventName] || 0) + 1
          return acc
        }, {})

        // Calculate registration trend
        const trendData = registrationsData.registrations.reduce((acc: Record<string, number>, reg: Registration) => {
          const date = new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})

        setStats({
          totalRegistrations: registrationsData.registrations.length,
          registrationsByEvent: Object.entries(eventCounts).map(([name, value]) => ({
            name,
            value: value as number,
          })),
          registrationTrend: Object.entries(trendData).map(([date, count]) => ({
            date,
            count: count as number
          }))
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange, status])

  const downloadExcel = async () => {
    try {
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrations, events }),
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'registrations.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading Excel:', error)
    }
  }

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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="text-sm font-medium text-gray-900">{`${label}`}</p>
          <p className="text-sm text-gray-600">{`Registrations: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = registrations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(registrations.length / itemsPerPage)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  const getEventName = (eventData: Registration['event']) => {
    if (typeof eventData === 'string') {
      const event = events.find(e => e._id === eventData)
      return event?.name || eventData
    }
    return eventData.name
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
          <Link href="/admin">
            <div className="flex items-center justify-center h-16 bg-blue-600">
              <span className="text-2xl font-semibold text-white">CSI</span>
            </div>
          </Link>
          <nav className="flex-1 px-2 py-4 space-y-2">
            <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/events" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
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
            <Link href={`/admin`}>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            </Link>
            <div className="flex space-x-2 text-gray-900">
              <Dialog>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <AddEventForm onEventAdded={(newEvent) => setEvents([...events, newEvent])} />
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
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center text-red-600">
                <p>Error: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900">Total Registrations</CardTitle>
                      <Users className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</div>
                      <p className="text-xs text-gray-600">In selected date range</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900">Unique Events</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground text-gray-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{stats.registrationsByEvent.length}</div>
                      <p className="text-xs text-muted-foreground text-gray-600">Different events registered</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900">Most Popular Event</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground text-gray-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">
                        {stats.registrationsByEvent.length > 0 ? stats.registrationsByEvent[0].name : 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground text-gray-600">Highest registration count</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900">Average Daily Registrations</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground text-gray-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">
                        {(stats.totalRegistrations / 
                          (stats.registrationTrend.length || 1)).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground text-gray-600">Per day in selected range</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mb-6">
                  <DateRangePicker
                    value={dateRange}
                    onValueChange={(newDateRange) => setDateRange(newDateRange)}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Registration Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.registrationTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#6b7280"
                              tick={{ fill: '#374151' }}
                            />
                            <YAxis 
                              stroke="#6b7280"
                              tick={{ fill: '#374151' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                              type="monotone" 
                              dataKey="count" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Registrations by Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.registrationsByEvent}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {stats.registrationsByEvent.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[index % COLORS.length]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Ongoing Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-900">Event Name</TableHead>
                          <TableHead className="text-gray-900">Date</TableHead>
                          <TableHead className="text-gray-900">Status</TableHead>
                          <TableHead className="text-gray-900">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event) => (
                          <TableRow key={event._id}>
                            <TableCell className="text-gray-900">{event.name}</TableCell>
                            <TableCell className="text-gray-900">{new Date(event.date).toLocaleDateString()}</TableCell>
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
                              className={`rounded-full ${event.isOpen ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
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

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-gray-900">Recent Registrations</CardTitle>
                    <Button onClick={downloadExcel} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4 text-gray-900" />
                      <div className="text-gray-900">Download</div>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-900">Name</TableHead>
                          <TableHead className="text-gray-900">Registration Number</TableHead>
                          <TableHead className="text-gray-900">Email</TableHead>
                          <TableHead className="text-gray-900">Event</TableHead>
                          <TableHead className="text-gray-900">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((registration) => (
                          <TableRow key={registration._id}>
                            <TableCell className="text-gray-900">{registration.name}</TableCell>
                            <TableCell className="text-gray-900">{registration.registrationNumber}</TableCell>
                            <TableCell className="text-gray-900">{registration.officialEmail}</TableCell>
                            <TableCell className="text-gray-900">{getEventName(registration.event)}</TableCell>
                            <TableCell className="text-gray-900">
                              {new Date(registration.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
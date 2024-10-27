'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from 'lucide-react'

interface Event {
  _id: string
  name: string
  date: string
  isOpen: boolean
}

interface AddEventFormProps {
  onEventAdded: (event: Event) => void
}

export function AddEventForm({ onEventAdded }: AddEventFormProps) {
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: eventName, date: eventDate, isOpen: true }),
      })
      if (!response.ok) throw new Error('Failed to add event')
      const newEvent = await response.json()
      toast({
        title: "Event Added",
        description: "The new event has been successfully added.",
      })
      onEventAdded(newEvent)
      setEventName('')
      setEventDate('')
    } catch (error) {
      console.error('Error adding event:', error)
      toast({
        title: "Error",
        description: "Failed to add the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
      <div>
        <Label htmlFor="eventName" className="text-base font-semibold">Event Name</Label>
        <Input
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="mt-1"
          placeholder="Enter event name"
        />
      </div>
      <div>
        <Label htmlFor="eventDate" className="text-base font-semibold">Event Date</Label>
        <div className="relative mt-1">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Add Event</Button>
    </form>
  )
}
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

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
        body: JSON.stringify({ name: eventName, date: eventDate }),
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
        <Label htmlFor="eventName">Event Name</Label>
        <Input
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="eventDate">Event Date</Label>
        <Input
          id="eventDate"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Event</Button>
    </form>
  )
}
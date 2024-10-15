'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, UserIcon, MailIcon, PhoneIcon, HashIcon } from 'lucide-react'
import { useToast } from "../hooks/use-toast"

interface EventRegistrationFormProps {
  events: { value: string; label: string }[];
  onSubmit: (formData: FormData) => void;
}

export default function EventRegistrationForm({ events, onSubmit }: EventRegistrationFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    officialEmail: '',
    phoneNumber: '',
    event: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Basic validation
    if (Object.values(formData).some(value => value === '')) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.officialEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    // Phone number validation (basic)
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    onSubmit(new FormData(e.currentTarget))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-blue-200">Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="pl-10" required />
            </div>
          </div>
          <div>
            <Label htmlFor="registrationNumber" className="text-blue-200">Registration Number</Label>
            <div className="relative">
              <HashIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="RA2011003010000" className="pl-10" required />
            </div>
          </div>
          <div>
            <Label htmlFor="officialEmail" className="text-blue-200">Official Email</Label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input id="officialEmail" name="officialEmail" type="email" value={formData.officialEmail} onChange={handleChange} placeholder="john@srmist.edu.in" className="pl-10" required />
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber" className="text-blue-200">Phone Number</Label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} placeholder="1234567890" className="pl-10" required />
            </div>
          </div>
          <div>
            <Label htmlFor="event" className="text-blue-200">Event</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select 
                id="event" 
                name="event"
                value={formData.event}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.value} value={event.value}>{event.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
          Register
        </Button>
      </form>
    </motion.div>
  )
}
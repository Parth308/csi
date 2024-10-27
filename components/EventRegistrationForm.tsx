'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserIcon, HashIcon, GraduationCapIcon, UserSquare, Mail, Phone, Calendar } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface Event {
  _id: string
  name: string
  date: string
  isOpen: boolean
}

interface EventRegistrationFormProps {
  events: Event[];
  onSubmit?: (formData: FormData) => void;
}

export default function EventRegistrationForm({ events, onSubmit }: EventRegistrationFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    year: '',
    branch: '',
    officialEmail: '',
    phoneNumber: '',
    event: ''
  })

  const years = [
    { value: "first", label: "First Year" },
    { value: "second", label: "Second Year" },
    { value: "third", label: "Third Year" },
    { value: "fourth", label: "Fourth Year" },
  ]

  const branches = [
    { value: "CSE", label: "Computer Science Engineering" },
    { value: "ECE", label: "Electronics & Communication Engineering" },
    { value: "EEE", label: "Electrical & Electronics Engineering" },
    { value: "MECH", label: "Mechanical Engineering" },
    { value: "CIVIL", label: "Civil Engineering" },
  ]

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (Object.values(formData).some(value => value === '')) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.officialEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    try {
      const form = e.currentTarget as HTMLFormElement;
      const formDataToSubmit = new FormData(form);
      
      // Manually append year, branch, and event if they are not part of form inputs
      formDataToSubmit.append('year', formData.year);
      formDataToSubmit.append('branch', formData.branch);
      formDataToSubmit.append('event', formData.event);
    
      if (onSubmit) {
        await onSubmit(formDataToSubmit);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          registrationNumber: '',
          year: '',
          branch: '',
          officialEmail: '',
          phoneNumber: '',
          event: ''
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.log("Form Data:", formData);
      if ((error as Error).message.includes('E11000') && 
      (error as Error).message.includes('dup key')) {
      toast({
      title: "Registration failed",
      description: "You have already registered for this event",
      variant: "destructive",
      });
    } else {
      toast({
      title: "Registration failed",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
      });
    }
    }
  
  }

  interface InputFieldProps {
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    type?: string;
    placeholder?: string;
  }

  const InputField = ({ id, label, icon: Icon, ...props }: InputFieldProps) => (
    <div>
      <Label htmlFor={id} className="text-base md:text-lg text-blue-900 font-normal">{label}</Label>
      <div className="relative mt-2">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
          <Icon width={20} height={20} />
        </div>
        <Input 
          id={id} 
          name={id}
          defaultValue={formData[id as keyof typeof formData]}
          onChange={(e) => handleChange(id, e.target.value)}
          className="pl-10 py-2.5 md:py-3 border-blue-300 rounded-md text-blue-900 text-sm md:text-base" 
          required 
          {...props}
        />
      </div>
    </div>
  )

  interface SelectFieldProps {
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    options: { value: string; label: string }[];
  }

  const SelectField = ({ id, label, icon: Icon, options }: SelectFieldProps) => (
    <div className="flex-1">
      <Label htmlFor={id} className="text-base md:text-lg text-blue-900 font-normal">{label}</Label>
      <div className="relative mt-2">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 z-10">
          <Icon width={20} height={20} />
        </div>
        <Select value={formData[id as keyof typeof formData]} onValueChange={(value) => handleChange(id, value)}>
          <SelectTrigger className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-background border border-blue-300 rounded-md text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-blue-900 bg-gray-100">{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 sm:px-6 md:px-8"
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <Card className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg">
          <CardContent className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-blue-900 font-semibold">Event Selection</h3>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <SelectField
                  id="event"
                  label="Select Event"
                  icon={Calendar}
                  options={events.map(event => ({ value: event._id, label: event.name }))}
                />
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-blue-900 font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputField
                  id="name"
                  label="Full Name"
                  icon={UserIcon}
                  placeholder="John Doe"
                />
                <InputField
                  id="registrationNumber"
                  label="Registration Number"
                  icon={HashIcon}
                  placeholder="RA2011003010000"
                />
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-blue-900 font-semibold">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <SelectField
                  id="year"
                  label="Current Year"
                  icon={GraduationCapIcon}
                  options={years}
                />
                <SelectField
                  id="branch"
                  label="Branch"
                  icon={UserSquare}
                  options={branches}
                />
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-blue-900 font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputField
                  id="officialEmail"
                  label="Official Email"
                  icon={Mail}
                  type="email"
                  placeholder="john@srmist.edu.in"
                />
                <InputField
                  id="phoneNumber"
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  placeholder="1234567890"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full py-4 md:py-6 text-base md:text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 mt-6 md:mt-8"
            >
              Register
            </Button>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}
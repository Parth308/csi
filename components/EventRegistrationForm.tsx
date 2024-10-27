'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { UserIcon, HashIcon, GraduationCapIcon, UserSquare, Mail, Phone } from 'lucide-react'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    onSubmit(new FormData(e.currentTarget))
  }

  const SelectField = ({ id, label, icon: Icon, options, value, onChange }: any) => (
    <div className="flex-1">
      <Label htmlFor={id} className="text-base md:text-lg text-primary font-normal">{label}</Label>
      <div className="relative mt-2">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" size={20} />
        <select 
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-background border border-primary-light rounded-md text-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
          required
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option: any) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
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
        <Card className="bg-background-lighter p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-card">
          <CardContent className="space-y-6 md:space-y-8">
            {/* Personal Information */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-primary font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Label htmlFor="name" className="text-base md:text-lg text-primary font-normal">Full Name</Label>
                  <div className="relative mt-2">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" size={20} />
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      className="pl-10 py-2.5 md:py-3 border-primary-light rounded-md text-text-secondary text-sm md:text-base" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="registrationNumber" className="text-base md:text-lg text-primary font-normal">Registration Number</Label>
                  <div className="relative mt-2">
                    <HashIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" size={20} />
                    <Input 
                      id="registrationNumber" 
                      name="registrationNumber" 
                      value={formData.registrationNumber} 
                      onChange={handleChange} 
                      placeholder="RA2011003010000" 
                      className="pl-10 py-2.5 md:py-3 border-primary-light rounded-md text-text-secondary text-sm md:text-base" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-primary font-semibold">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <SelectField
                  id="year"
                  label="Current Year"
                  icon={GraduationCapIcon}
                  options={years}
                  value={formData.year}
                  onChange={handleChange}
                />
                <SelectField
                  id="branch"
                  label="Branch"
                  icon={UserSquare}
                  options={branches}
                  value={formData.branch}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-primary font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Label htmlFor="officialEmail" className="text-base md:text-lg text-primary font-normal">Official Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" size={20} />
                    <Input 
                      id="officialEmail" 
                      name="officialEmail" 
                      type="email" 
                      value={formData.officialEmail} 
                      onChange={handleChange} 
                      placeholder="john@srmist.edu.in" 
                      className="pl-10 py-2.5 md:py-3 border-primary-light rounded-md text-text-secondary text-sm md:text-base" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-base md:text-lg text-primary font-normal">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" size={20} />
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      type="tel" 
                      value={formData.phoneNumber} 
                      onChange={handleChange} 
                      placeholder="1234567890" 
                      className="pl-10 py-2.5 md:py-3 border-primary-light rounded-md text-text-secondary text-sm md:text-base" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 md:py-6 text-base md:text-lg bg-gradient-primary hover:opacity-90 text-background rounded-md transition-opacity duration-200 mt-6 md:mt-8"
            >
              Register
            </Button>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}
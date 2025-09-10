"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserIcon, HashIcon, GraduationCapIcon, UserSquare, Mail, Phone, Calendar, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types
interface Event {
  _id: string
  name: string
  date: string
  isOpen: boolean
}

interface RegistrationFormData {
  name: string
  registrationNumber: string
  year: string
  branch: string
  officialEmail: string
  phoneNumber: string
  event: string
}

interface EventRegistrationFormProps {
  events: Event[]
  onSubmit?: (formData: RegistrationFormData) => Promise<boolean>
}

// Constants
const FORM_SECTIONS = {
  EVENT: "Event Selection",
  PERSONAL: "Personal Information",
  ACADEMIC: "Academic Details",
  CONTACT: "Contact Information",
} as const

const INITIAL_FORM_STATE: RegistrationFormData = {
  name: "",
  registrationNumber: "",
  year: "",
  branch: "",
  officialEmail: "",
  phoneNumber: "",
  event: "",
}

const ACADEMIC_OPTIONS = {
  years: [
    { value: "first", label: "First Year" },
    { value: "second", label: "Second Year" },
    { value: "third", label: "Third Year" },
    { value: "fourth", label: "Fourth Year" },
  ],
  branches: [
    { value: "CSE", label: "Computer Science Engineering" },
    { value: "ECE", label: "Electronics & Communication Engineering" },
    { value: "EEE", label: "Electrical & Electronics Engineering" },
    { value: "MECH", label: "Mechanical Engineering" },
    { value: "CIVIL", label: "Civil Engineering" },
  ],
}

// Form Field Components
interface FieldProps {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface InputFieldProps extends FieldProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

const InputField = ({ id, label, icon: Icon, type = "text", placeholder, value, onChange }: InputFieldProps) => (
  <div className="flex-1">
    <Label htmlFor={id} className="text-base md:text-lg text-gray-700 dark:text-cyan-300 font-normal">
      {label}
    </Label>
    <div className="relative mt-2">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-cyan-400">
        <Icon className="w-5 h-5" />
      </div>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 py-2.5 md:py-3 bg-gray-50 dark:bg-blue-900/20 border-gray-300 dark:border-blue-800 rounded-md text-gray-900 dark:text-cyan-100 placeholder:text-gray-500 dark:placeholder:text-blue-400 text-sm md:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-blue-500 dark:focus:border-cyan-400"
        required
      />
    </div>
  </div>
)

interface SelectFieldProps extends FieldProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

const SelectField = ({ id, label, icon: Icon, options, value, onChange }: SelectFieldProps) => (
  <div className="flex-1">
    <Label htmlFor={id} className="text-base md:text-lg text-gray-700 dark:text-cyan-300 font-normal">
      {label}
    </Label>
    <div className="relative mt-2">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-cyan-400 z-10">
        <Icon className="w-5 h-5" />
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-50 dark:bg-blue-900/20 border border-gray-300 dark:border-blue-800 rounded-md text-gray-900 dark:text-cyan-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-blue-500 dark:focus:border-cyan-400 text-sm md:text-base">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-gray-900 dark:text-cyan-100 bg-white dark:bg-blue-900 hover:bg-gray-100 dark:hover:bg-blue-800 cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
)

// Main Component
export default function EventRegistrationForm({ events, onSubmit }: EventRegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  

  const handleChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (Object.values(formData).some((value) => !value)) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.officialEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return false
    }

    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const success = await onSubmit?.(formData)


      if (success) {
        console.log("Resetting form...")
        setFormData(INITIAL_FORM_STATE)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 sm:px-6 md:px-8 min-h-screen"
    >


      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto pb-8">
        <Card className="bg-white dark:bg-blue-900/20 border-gray-200 dark:border-blue-800 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg dark:shadow-cyan-900/20">
          <CardContent className="space-y-6 md:space-y-8">
            {/* Event Selection */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
                {FORM_SECTIONS.EVENT}
              </h3>
              <SelectField
                id="event"
                label="Select Event"
                icon={Calendar}
                options={events.map((event) => ({
                  value: event._id,
                  label: `${event.name}`,
                }))}
                value={formData.event}
                onChange={(value) => handleChange("event", value)}
              />
            </div>

            {/* Personal Information */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
                {FORM_SECTIONS.PERSONAL}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputField
                  id="name"
                  label="Full Name"
                  icon={UserIcon}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(value) => handleChange("name", value)}
                />
                <InputField
                  id="registrationNumber"
                  label="Registration Number"
                  icon={HashIcon}
                  placeholder="RA2011003010000"
                  value={formData.registrationNumber}
                  onChange={(value) => handleChange("registrationNumber", value)}
                />
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
                {FORM_SECTIONS.ACADEMIC}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <SelectField
                  id="year"
                  label="Current Year"
                  icon={GraduationCapIcon}
                  options={ACADEMIC_OPTIONS.years}
                  value={formData.year}
                  onChange={(value) => handleChange("year", value)}
                />
                <SelectField
                  id="branch"
                  label="Branch"
                  icon={UserSquare}
                  options={ACADEMIC_OPTIONS.branches}
                  value={formData.branch}
                  onChange={(value) => handleChange("branch", value)}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
                {FORM_SECTIONS.CONTACT}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputField
                  id="officialEmail"
                  label="Official Email"
                  icon={Mail}
                  type="email"
                  placeholder="john@srmist.edu.in"
                  value={formData.officialEmail}
                  onChange={(value) => handleChange("officialEmail", value)}
                />
                <InputField
                  id="phoneNumber"
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  placeholder="1234567890"
                  value={formData.phoneNumber}
                  onChange={(value) => handleChange("phoneNumber", value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 md:py-6 text-base md:text-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-white dark:text-cyan-100 rounded-md transition-colors duration-200 mt-6 md:mt-8 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500 dark:border-blue-700 hover:border-blue-600 dark:hover:border-cyan-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}

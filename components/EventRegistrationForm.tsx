"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserIcon, HashIcon, GraduationCapIcon, UserSquare, Mail, Phone, Calendar, Loader2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types
interface Event {
  _id: string
  name: string
  date: string
  isOpen: boolean
  teamSize: number
}

interface MemberData {
  name: string
  registrationNumber: string
  section: string
  year: string
  branch: string
  officialEmail: string
  phoneNumber: string
}

interface RegistrationFormData {
  members: MemberData[]
  event: string
}

interface EventRegistrationFormProps {
  events: Event[]
  onSubmit?: (formData: { members: MemberData[]; event: string }) => Promise<boolean>
}

// Constants
const ACADEMIC_OPTIONS = {
  years: [
    { value: "first", label: "First Year" },
    { value: "second", label: "Second Year" },
    { value: "third", label: "Third Year" },
    { value: "fourth", label: "Fourth Year" },
  ],
  branches: [
    { value: "CSE", label: "CSE-CORE" },
    { value: "ECE", label: "ECE" },
    { value: "AIML", label: "AIML" },
    { value: "CC", label: "Cloud Computing" },
    { value: "CYBER", label: "Cyber Security" },
    { value: "DS", label: "Data Science" },
    { value: "CSBS", label: "CSBS" },
    { value: "BCA", label: "BCA" },
    { value: "BBA", label: "BBA" },
    { value: "MBA", label: "MBA" },
    { value: "Others", label: "Others" },
  ],
  sections: [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "G", label: "G" },
    { value: "H", label: "H" },
    { value: "I", label: "I" },
    { value: "J", label: "J" },
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

// Helper function to create initial member data
const getInitialMembers = (count: number): MemberData[] => 
  Array(count).fill(null).map(() => ({
    name: "",
    registrationNumber: "",
    section: "",
    year: "",
    branch: "",
    officialEmail: "",
    phoneNumber: "",
  }))

// Main Component
export default function EventRegistrationForm({ events, onSubmit }: EventRegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    members: getInitialMembers(1),
    event: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Get current event details
  const currentEvent = events.find(event => event._id === formData.event)
  const teamSize = currentEvent?.teamSize || 1

  // Set default event to the first available open event
  useEffect(() => {
    if (events.length > 0 && !formData.event) {
      const firstOpenEvent = events.find(event => event.isOpen)
      if (firstOpenEvent) {
        setFormData(prev => ({
          ...prev,
          event: firstOpenEvent._id,
          members: getInitialMembers(firstOpenEvent.teamSize)
        }))
      }
    }
  }, [events, formData.event])

  // Update members array when event changes
  useEffect(() => {
    if (formData.event) {
      const newTeamSize = events.find(e => e._id === formData.event)?.teamSize || 1
      setFormData(prev => ({
        ...prev,
        members: getInitialMembers(newTeamSize)
      }))
    }
  }, [formData.event, events])

  const handleMemberChange = (
    memberIndex: number,
    field: keyof MemberData,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedMembers = [...prev.members];
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        [field]: value,
      };
      return { ...prev, members: updatedMembers };
    });
  };

  const validateForm = () => {
    // Check if event is selected
    if (!formData.event) {
      toast({
        title: "Missing Event",
        description: "Please select an event",
        variant: "destructive",
      });
      return false;
    }

    // Validate each member
    for (let i = 0; i < formData.members.length; i++) {
      const member = formData.members[i];
      if (
        !member.name ||
        !member.registrationNumber ||
        !member.section ||
        !member.year ||
        !member.branch ||
        !member.officialEmail ||
        !member.phoneNumber
      ) {
        toast({
          title: "Missing Fields",
          description: `Please fill in all required fields for Member ${i + 1}`,
          variant: "destructive",
        });
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(member.officialEmail)) {
        toast({
          title: "Invalid Email",
          description: `Please enter a valid email address for Member ${i + 1}`,
          variant: "destructive",
        });
        return false;
      }

      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(member.phoneNumber)) {
        toast({
          title: "Invalid Phone",
          description: `Please enter a valid 10-digit phone number for Member ${i + 1}`,
          variant: "destructive",
        });
        return false;
      }
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
        // Reset form but keep the selected event
        setFormData({
          members: getInitialMembers(teamSize),
          event: formData.event
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get open events for the dropdown
  const openEvents = events.filter(event => event.isOpen)
  
  // Get the selected event's display name
  const selectedEvent = events.find(e => e._id === formData.event)
  const eventDisplayName = selectedEvent 
    ? `${selectedEvent.name} (${selectedEvent.teamSize} member${selectedEvent.teamSize > 1 ? 's' : ''})`
    : "Select Event"

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
                Event Selection
              </h3>
              <SelectField
                id="event"
                label="Select Event"
                icon={Calendar}
                options={openEvents.map((event) => ({
                  value: event._id,
                  label: `${event.name} (${event.teamSize} member${event.teamSize > 1 ? 's' : ''})`,
                }))}
                value={formData.event}
                onChange={(value) => setFormData({ members: getInitialMembers(1), event: value })}
              />
              
              {currentEvent && (
                <div className="text-sm text-gray-600 dark:text-cyan-400 mt-2">
                  This event requires {teamSize} member{teamSize > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Members Information */}
            {formData.event && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
                  Team Members Information
                </h3>
                
                {formData.members.map((member, index) => (
                  <div key={index} className="space-y-4 p-4 bg-gray-50 dark:bg-blue-900/10 rounded-lg border border-gray-200 dark:border-blue-800">
                    <h4 className="text-lg text-gray-800 dark:text-cyan-300 font-medium">
                      Member {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <InputField
                        id={`member-${index}-name`}
                        label="Full Name"
                        icon={UserIcon}
                        placeholder="John Doe"
                        value={member.name}
                        onChange={(value) => handleMemberChange(index, "name", value)}
                      />
                      <InputField
                        id={`member-${index}-registrationNumber`}
                        label="Registration Number"
                        icon={HashIcon}
                        placeholder="RA2011003010000"
                        value={member.registrationNumber}
                        onChange={(value) => handleMemberChange(index, "registrationNumber", value)}
                      />
                      <SelectField
                        id={`member-${index}-section`}
                        label="Section"
                        icon={Users}
                        options={ACADEMIC_OPTIONS.sections}
                        value={member.section}
                        onChange={(value) => handleMemberChange(index, "section", value)}
                      />
                      <SelectField
                        id={`member-${index}-year`}
                        label="Current Year"
                        icon={GraduationCapIcon}
                        options={ACADEMIC_OPTIONS.years}
                        value={member.year}
                        onChange={(value) => handleMemberChange(index, "year", value)}
                      />
                      <SelectField
                        id={`member-${index}-branch`}
                        label="Branch"
                        icon={UserSquare}
                        options={ACADEMIC_OPTIONS.branches}
                        value={member.branch}
                        onChange={(value) => handleMemberChange(index, "branch", value)}
                      />
                      <InputField
                        id={`member-${index}-officialEmail`}
                        label="Official Email"
                        icon={Mail}
                        type="email"
                        placeholder="john@srmist.edu.in"
                        value={member.officialEmail}
                        onChange={(value) => handleMemberChange(index, "officialEmail", value)}
                      />
                      <InputField
                        id={`member-${index}-phoneNumber`}
                        label="Phone Number"
                        icon={Phone}
                        type="tel"
                        placeholder="1234567890"
                        value={member.phoneNumber}
                        onChange={(value) => handleMemberChange(index, "phoneNumber", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.event && (
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
                  `Register Team (${teamSize} member${teamSize > 1 ? 's' : ''})`
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}
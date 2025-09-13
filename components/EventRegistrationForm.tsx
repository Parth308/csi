"use client"
import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  UserIcon, 
  HashIcon, 
  GraduationCapIcon, 
  UserSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Loader2, 
  Users, 
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  RefreshCw,
  PartyPopper
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Event, RegistrationFormData } from "@/types/events";


// Types
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



interface MemberData {
  name: string
  registrationNumber: string
  section: string
  year: string
  branch: string
  officialEmail: string
  phoneNumber: string
}

interface Answer {
  questionId: string
  answer: string | number | string[]
}

interface ParticipantData {
  name: string
  registrationNumber: string
  section: string
  year: string
  branch: string
  officialEmail: string
  phoneNumber: string
  selectedTeams: string[]
  commonAnswers: Answer[]
  teamAnswers: {
    teamId: string
    answers: Answer[]
  }[]
}



interface EventRegistrationFormProps {
  events: Event[]
  onSubmit?: (formData: RegistrationFormData) => Promise<boolean>
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
  required?: boolean
}

const InputField = ({ id, label, icon: Icon, type = "text", placeholder, value, onChange, required = false }: InputFieldProps) => (
  <div className="w-full">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-cyan-300 mb-1 block">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <div className="relative">
      <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-cyan-400">
        <Icon className="w-4 h-4" />
      </div>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="pl-8 py-2.5 h-10 bg-gray-50 dark:bg-blue-900/20 border-gray-300 dark:border-blue-800 rounded-lg text-gray-900 dark:text-cyan-100 placeholder:text-gray-500 dark:placeholder:text-blue-400 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-blue-500 dark:focus:border-cyan-400 transition-colors"
      />
    </div>
  </div>
)

interface SelectFieldProps extends FieldProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  required?: boolean
}

const SelectField = ({ id, label, icon: Icon, options, value, onChange, required = false }: SelectFieldProps) => (
  <div className="w-full">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-cyan-300 mb-1 block">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <div className="relative">
      <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-cyan-400 z-10">
        <Icon className="w-4 h-4" />
      </div>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger className="w-full pl-8 pr-3 py-2.5 h-10 bg-gray-50 dark:bg-blue-900/20 border border-gray-300 dark:border-blue-800 rounded-lg text-gray-900 dark:text-cyan-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-blue-500 dark:focus:border-cyan-400 text-sm">
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

// Question Component
interface QuestionFieldProps {
  question: Question
  answer: string | number | string[]
  onChange: (answer: string | number | string[]) => void
}

const QuestionField = ({ question, answer, onChange }: QuestionFieldProps) => {
  const handleChange = (value: string | string[]) => {
    if (question.type === 'number') {
      onChange(value === '' ? '' : Number(value))
    } else {
      onChange(value)
    }
  }

  switch (question.type) {
    case 'mcq':
      return (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-cyan-300">
            {question.question} {question.required && <span className="text-red-500">*</span>}
          </Label>
          <RadioGroup
            value={answer as string}
            onValueChange={(value) => handleChange(value)}
            className="space-y-2"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`${question.id}-${index}`}
                  className="border-gray-300 dark:border-blue-800 text-blue-600 dark:text-cyan-400"
                />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="text-sm text-gray-700 dark:text-cyan-100 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    case 'textarea':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-cyan-300">
            {question.question} {question.required && <span className="text-red-500">*</span>}
          </Label>
          <Textarea
            value={answer as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
            className="bg-gray-50 dark:bg-blue-900/20 border-gray-300 dark:border-blue-800 rounded-lg text-gray-900 dark:text-cyan-100 placeholder:text-gray-500 dark:placeholder:text-blue-400 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-blue-500 dark:focus:border-cyan-400 transition-colors min-h-[100px]"
          />
          {question.maxLength && (
            <div className="text-xs text-gray-500 dark:text-blue-400 text-right">
              {(answer as string)?.length || 0}/{question.maxLength}
            </div>
          )}
        </div>
      )
    case 'number':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-cyan-300">
            {question.question} {question.required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="number"
            value={answer as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            className="bg-gray-50 dark:bg-blue-900/20 border-gray-300 dark:border-blue-800 rounded-lg text-gray-900 dark:text-cyan-100 placeholder:text-gray-500 dark:placeholder:text-blue-400 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-blue-500 dark:focus:border-cyan-400 transition-colors"
          />
        </div>
      )
    default: // text
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-cyan-300">
            {question.question} {question.required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="text"
            value={answer as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
            className="bg-gray-50 dark:bg-blue-900/20 border-gray-300 dark:border-blue-800 rounded-lg text-gray-900 dark:text-cyan-100 placeholder:text-gray-500 dark:placeholder:text-blue-400 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-blue-500 dark:focus:border-cyan-400 transition-colors"
          />
          {question.maxLength && (
            <div className="text-xs text-gray-500 dark:text-blue-400 text-right">
              {(answer as string)?.length || 0}/{question.maxLength}
            </div>
          )}
        </div>
      )
  }
}

// Success Message Component
const SuccessMessage = ({ eventName, onRegisterAgain }: { eventName: string, onRegisterAgain: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.5 }}
    className="text-center space-y-6 py-8"
  >
    <div className="flex justify-center">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
        <PartyPopper className="w-12 h-12 text-green-600 dark:text-green-400" />
      </div>
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
        Registration Successful!
      </h2>
      <p className="text-gray-600 dark:text-blue-300 max-w-md mx-auto">
        Your registration for <span className="font-semibold">{eventName}</span> has been submitted successfully. 
        You will receive a confirmation email shortly.
      </p>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
      <Button
        onClick={onRegisterAgain}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white shadow-lg hover:shadow-xl"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Register for Another Event</span>
      </Button>
    </div>
    <div className="text-xs text-gray-500 dark:text-blue-400 bg-gray-50 dark:bg-blue-900/20 p-3 rounded-lg">
      If you don&apos;t receive a confirmation email within 15 minutes, please check your spam folder or contact support.
    </div>
  </motion.div>
)

// Helper functions
const getInitialMembers = (count: number): MemberData[] =>
  Array(count)
    .fill(null)
    .map(() => ({
      name: "",
      registrationNumber: "",
      section: "",
      year: "",
      branch: "",
      officialEmail: "",
      phoneNumber: "",
    }))

const getInitialParticipant = (): ParticipantData => ({
  name: "",
  registrationNumber: "",
  section: "",
  year: "",
  branch: "",
  officialEmail: "",
  phoneNumber: "",
  selectedTeams: [],
  commonAnswers: [],
  teamAnswers: []
})

// Main Component
export default function EventRegistrationForm({ events = [], onSubmit }: EventRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<RegistrationFormData>({
    eventType: 'team_registration',
    members: getInitialMembers(1),
    participant: getInitialParticipant(),
    eventId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()

  // Get current event details
  const currentEvent = events.find((event) => event._id === formData.eventId)

  // Set default event to the first available open event
  useEffect(() => {
    if (events.length > 0 && !formData.eventId) {
      const firstOpenEvent = events.find((event) => event.isOpen)
      if (firstOpenEvent) {
        setFormData((prev) => ({
          ...prev,
          eventId: firstOpenEvent._id,
          eventType: firstOpenEvent.eventType,
          members: firstOpenEvent.eventType === 'team_registration' ? getInitialMembers(firstOpenEvent.teamSize || 1) : undefined,
          participant: firstOpenEvent.eventType === 'recruitment' ? getInitialParticipant() : undefined,
        }))
      }
    }
  }, [events, formData.eventId])

  // Update form data when event changes
  useEffect(() => {
    if (formData.eventId) {
      const selectedEvent = events.find((e) => e._id === formData.eventId)
      if (selectedEvent) {
        setFormData((prev) => ({
          ...prev,
          eventType: selectedEvent.eventType,
          members: selectedEvent.eventType === 'team_registration' ? getInitialMembers(selectedEvent.teamSize || 1) : undefined,
          participant: selectedEvent.eventType === 'recruitment' ? getInitialParticipant() : undefined,
        }))
        setCurrentStep(0)
      }
    }
  }, [formData.eventId, events])

  const handleEventChange = (eventId: string) => {
    setFormData(prev => ({ ...prev, eventId: eventId }))
  }

  const handleMemberChange = (memberIndex: number, field: keyof MemberData, value: string) => {
    if (!formData.members) return
    setFormData((prev) => {
      const updatedMembers = [...(prev.members || [])]
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        [field]: value,
      }
      return { ...prev, members: updatedMembers }
    })
  }

  const handleParticipantChange = <T extends keyof ParticipantData>(field: T, value: ParticipantData[T]) => {
    if (!formData.participant) return
    setFormData((prev) => ({
      ...prev,
      participant: {
        ...prev.participant!,
        [field]: value,
      },
    }))
  }

  const handleTeamSelection = (teamId: string, selected: boolean) => {
    if (!formData.participant || !currentEvent) return
    setFormData((prev) => {
      const currentTeams = prev.participant!.selectedTeams
      let newTeams: string[]
      if (selected) {
        if (currentEvent.allowMultipleTeamSelection) {
          newTeams = [...currentTeams, teamId]
        } else {
          newTeams = [teamId]
        }
      } else {
        newTeams = currentTeams.filter(id => id !== teamId)
      }
      return {
        ...prev,
        participant: {
          ...prev.participant!,
          selectedTeams: newTeams,
        },
      }
    })
  }

  const handleCommonAnswerChange = (questionId: string, answer: string | number | string[]) => {
    if (!formData.participant) return
    setFormData((prev) => {
      const commonAnswers = prev.participant!.commonAnswers.filter(a => a.questionId !== questionId)
      commonAnswers.push({ questionId, answer })
      return {
        ...prev,
        participant: {
          ...prev.participant!,
          commonAnswers,
        },
      }
    })
  }

  const handleTeamAnswerChange = (teamId: string, questionId: string, answer: string | number | string[]) => {
    if (!formData.participant) return
    setFormData((prev) => {
      const teamAnswers = [...prev.participant!.teamAnswers]
      let teamAnswerIndex = teamAnswers.findIndex(ta => ta.teamId === teamId)
      if (teamAnswerIndex === -1) {
        teamAnswers.push({ teamId, answers: [] })
        teamAnswerIndex = teamAnswers.length - 1
      }
      const answers = teamAnswers[teamAnswerIndex].answers.filter(a => a.questionId !== questionId)
      answers.push({ questionId, answer })
      teamAnswers[teamAnswerIndex].answers = answers
      return {
        ...prev,
        participant: {
          ...prev.participant!,
          teamAnswers,
        },
      }
    })
  }

  const validateCurrentStep = (): boolean => {
    if (!currentEvent) {
      toast({
        title: "No Event Selected",
        description: "Please select an event to continue",
      })
      return false
    }

    if (currentStep === 0) {
      // Event selection step
      return true
    }

    if (formData.eventType === 'team_registration') {
      if (!formData.members) return false
      // Validate current member
      const memberIndex = currentStep - 1
      if (memberIndex >= 0 && memberIndex < formData.members.length) {
        const member = formData.members[memberIndex]
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
            description: `Please fill in all required fields for Member ${memberIndex + 1}`,
          })
          return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(member.officialEmail)) {
          toast({
            title: "Invalid Email",
            description: `Please enter a valid email address for Member ${memberIndex + 1}`,
          })
          return false
        }

        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(member.phoneNumber)) {
          toast({
            title: "Invalid Phone",
            description: `Please enter a valid 10-digit phone number for Member ${memberIndex + 1}`,
          })
          return false
        }
      }
    } else if (formData.eventType === 'recruitment') {
      if (!formData.participant) return false

      if (currentStep === 1) {
        // Personal info step
        const participant = formData.participant
        if (
          !participant.name ||
          !participant.registrationNumber ||
          !participant.section ||
          !participant.year ||
          !participant.branch ||
          !participant.officialEmail ||
          !participant.phoneNumber
        ) {
          toast({
            title: "Missing Fields",
            description: "Please fill in all required personal information",
          })
          return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(participant.officialEmail)) {
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address",
          })
          return false
        }

        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(participant.phoneNumber)) {
          toast({
            title: "Invalid Phone",
            description: "Please enter a valid 10-digit phone number",
          })
          return false
        }
      } else if (currentStep === 2 && currentEvent.commonQuestions && currentEvent.commonQuestions.length > 0) {
        // Common questions step
        for (const question of currentEvent.commonQuestions) {
          if (question.required) {
            const answer = formData.participant.commonAnswers.find(a => a.questionId === question.id)
            if (!answer || answer.answer === '' || (Array.isArray(answer.answer) && answer.answer.length === 0)) {
              toast({
                title: "Missing Answer",
                description: `Please answer the required question: "${question.question}"`,
              })
              return false
            }
          }
        }
      } else if (currentStep === getTeamSelectionStepIndex()) {
        // Team selection step
        if (formData.participant.selectedTeams.length === 0) {
          toast({
            title: "No Teams Selected",
            description: "Please select at least one team",
          })
          return false
        }
      } else if (currentStep === getTeamQuestionsStepIndex()) {
        // Team-specific questions step
        const selectedTeams = currentEvent.teams?.filter(team => 
          formData.participant!.selectedTeams.includes(team.id) && 
          team.questions && 
          team.questions.length > 0
        ) || []

        for (const team of selectedTeams) {
          for (const question of team.questions || []) {
            if (question.required) {
              const teamAnswers = formData.participant.teamAnswers.find(ta => ta.teamId === team.id)
              const answer = teamAnswers?.answers.find(a => a.questionId === question.id)
              if (!answer || answer.answer === '' || (Array.isArray(answer.answer) && answer.answer.length === 0)) {
                toast({
                  title: "Missing Answer",
                  description: `Please answer the required question for ${team.name}: "${question.question}"`,
                })
                return false
              }
            }
          }
        }
      }
    }
    return true
  }

  const getTeamSelectionStepIndex = (): number => {
    if (!currentEvent || formData.eventType !== 'recruitment') return -1
    let stepIndex = 2 // Event selection + personal info
    if (currentEvent.commonQuestions && currentEvent.commonQuestions.length > 0) stepIndex++
    return stepIndex
  }

  const getTeamQuestionsStepIndex = (): number => {
    if (!currentEvent || formData.eventType !== 'recruitment') return -1
    return getTeamSelectionStepIndex() + 1
  }

  const getTotalSteps = (): number => {
    if (!currentEvent) return 1

    if (currentEvent.eventType === 'team_registration') {
      return 1 + (currentEvent.teamSize || 1) // Event selection + members
    } else {
      let steps = 2 // Event selection + personal info
      if (currentEvent.commonQuestions && currentEvent.commonQuestions.length > 0) steps++
      steps++ // Team selection
      if (formData.participant?.selectedTeams.length) {
        const hasTeamQuestions = formData.participant.selectedTeams.some(teamId => {
          const team = currentEvent.teams?.find(t => t.id === teamId)
          return team && team.questions && team.questions.length > 0
        })
        if (hasTeamQuestions) steps++
      }
      return steps
    }
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, getTotalSteps() - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleRegisterAgain = () => {
    setShowSuccess(false)
    setFormData({
      eventType: currentEvent?.eventType || 'team_registration',
      members: currentEvent?.eventType === 'team_registration' ? getInitialMembers(currentEvent?.teamSize || 1) : undefined,
      participant: currentEvent?.eventType === 'recruitment' ? getInitialParticipant() : undefined,
      eventId: formData.eventId,
    })
    setCurrentStep(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    try {
      const submitData: RegistrationFormData = {
        eventType: formData.eventType,
        eventId: formData.eventId,
      }

      if (formData.eventType === 'team_registration' && formData.members) {
        submitData.members = formData.members
      } else if (formData.eventType === 'recruitment' && formData.participant) {
        submitData.participant = formData.participant
      }

      const success = await onSubmit?.(submitData)
      if (success) {
        setShowSuccess(true)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    if (showSuccess) {
      return <SuccessMessage eventName={currentEvent?.name || "Event"} onRegisterAgain={handleRegisterAgain} />
    }

    if (!currentEvent) return null

    if (currentStep === 0) {
      // Event Selection
      return (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
            Event Selection
          </h3>
          <SelectField
            id="event"
            label="Select Event"
            icon={Calendar}
            options={events.filter(e => e.isOpen).map((event) => ({
              value: event._id,
              label: `${event.name} (${event.eventType === 'team_registration' ? `${event.teamSize} member${event.teamSize! > 1 ? 's' : ''}` : 'Recruitment'})`,
            }))}
            value={formData.eventId}
            onChange={handleEventChange}
            required
          />
          {currentEvent && (
            <div className="text-xs sm:text-sm text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              <div className="font-medium mb-1">Event Details:</div>
              <div>Type: {currentEvent.eventType === 'team_registration' ? 'Team Registration' : 'Recruitment'}</div>
              {currentEvent.eventType === 'team_registration' && (
                <div>Team Size: {currentEvent.teamSize} member{currentEvent.teamSize! > 1 ? 's' : ''}</div>
              )}
              {currentEvent.eventType === 'recruitment' && (
                <div>
                  Teams Available: {currentEvent.teams?.length || 0}
                  {currentEvent.allowMultipleTeamSelection && <span className="ml-2">(Multiple selection allowed)</span>}
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    if (formData.eventType === 'team_registration' && formData.members) {
      // Team Registration - Member Information
      const memberIndex = currentStep - 1
      const member = formData.members[memberIndex]
      if (!member) return null

      return (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
            Member {memberIndex + 1} Information
          </h3>
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id={`member-${memberIndex}-name`}
                label="Full Name"
                icon={UserIcon}
                placeholder="John Doe"
                value={member.name}
                onChange={(value) => handleMemberChange(memberIndex, "name", value)}
                required
              />
              <InputField
                id={`member-${memberIndex}-registrationNumber`}
                label="Registration Number"
                icon={HashIcon}
                placeholder="RA2011003010000"
                value={member.registrationNumber}
                onChange={(value) => handleMemberChange(memberIndex, "registrationNumber", value)}
                required
              />
            </div>
            {/* Academic Information */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SelectField
                id={`member-${memberIndex}-year`}
                label="Year"
                icon={GraduationCapIcon}
                options={ACADEMIC_OPTIONS.years}
                value={member.year}
                onChange={(value) => handleMemberChange(memberIndex, "year", value)}
                required
              />
              <SelectField
                id={`member-${memberIndex}-section`}
                label="Section"
                icon={Users}
                options={ACADEMIC_OPTIONS.sections}
                value={member.section}
                onChange={(value) => handleMemberChange(memberIndex, "section", value)}
                required
              />
              <div className="col-span-2 sm:col-span-1">
                <SelectField
                  id={`member-${memberIndex}-branch`}
                  label="Branch"
                  icon={UserSquare}
                  options={ACADEMIC_OPTIONS.branches}
                  value={member.branch}
                  onChange={(value) => handleMemberChange(memberIndex, "branch", value)}
                  required
                />
              </div>
            </div>
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id={`member-${memberIndex}-phoneNumber`}
                label="Phone Number"
                icon={Phone}
                type="tel"
                placeholder="1234567890"
                value={member.phoneNumber}
                onChange={(value) => handleMemberChange(memberIndex, "phoneNumber", value)}
                required
              />
              <InputField
                id={`member-${memberIndex}-officialEmail`}
                label="Official Email"
                icon={Mail}
                type="email"
                placeholder="john@srmist.edu.in"
                value={member.officialEmail}
                onChange={(value) => handleMemberChange(memberIndex, "officialEmail", value)}
                required
              />
            </div>
          </div>
        </div>
      )
    }

    if (formData.eventType === 'recruitment' && formData.participant) {
      if (currentStep === 1) {
        // Personal Information
        const participant = formData.participant
        return (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
              Personal Information
            </h3>
            <div className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  id="participant-name"
                  label="Full Name"
                  icon={UserIcon}
                  placeholder="John Doe"
                  value={participant.name}
                  onChange={(value) => handleParticipantChange("name", value)}
                  required
                />
                <InputField
                  id="participant-registrationNumber"
                  label="Registration Number"
                  icon={HashIcon}
                  placeholder="RA2011003010000"
                  value={participant.registrationNumber}
                  onChange={(value) => handleParticipantChange("registrationNumber", value)}
                  required
                />
              </div>
              {/* Academic Information */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <SelectField
                  id="participant-year"
                  label="Year"
                  icon={GraduationCapIcon}
                  options={ACADEMIC_OPTIONS.years}
                  value={participant.year}
                  onChange={(value) => handleParticipantChange("year", value)}
                  required
                />
                <SelectField
                  id="participant-section"
                  label="Section"
                  icon={Users}
                  options={ACADEMIC_OPTIONS.sections}
                  value={participant.section}
                  onChange={(value) => handleParticipantChange("section", value)}
                  required
                />
                <div className="col-span-2 sm:col-span-1">
                  <SelectField
                    id="participant-branch"
                    label="Branch"
                    icon={UserSquare}
                    options={ACADEMIC_OPTIONS.branches}
                    value={participant.branch}
                    onChange={(value) => handleParticipantChange("branch", value)}
                    required
                  />
                </div>
              </div>
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  id="participant-phoneNumber"
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  placeholder="1234567890"
                  value={participant.phoneNumber}
                  onChange={(value) => handleParticipantChange("phoneNumber", value)}
                  required
                />
                <InputField
                  id="participant-officialEmail"
                  label="Official Email"
                  icon={Mail}
                  type="email"
                  placeholder="john@srmist.edu.in"
                  value={participant.officialEmail}
                  onChange={(value) => handleParticipantChange("officialEmail", value)}
                  required
                />
              </div>
            </div>
          </div>
        )
      }

      if (currentStep === 2 && currentEvent.commonQuestions && currentEvent.commonQuestions.length > 0) {
        // Common Questions
        return (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
              General Questions
            </h3>
            <div className="space-y-6">
              {currentEvent.commonQuestions.map((question, index) => {
                const existingAnswer = formData.participant!.commonAnswers.find(a => a.questionId === question.id)
                return (
                  <div key={question.id} className="p-4 bg-gray-50 dark:bg-blue-900/10 rounded-lg border border-gray-200 dark:border-blue-800">
                    <div className="mb-2 text-sm font-medium text-blue-600 dark:text-cyan-400">
                      Question {index + 1}
                    </div>
                    <QuestionField
                      question={{ ...question, type: question.type || 'text', required: question.required || false }}
                      answer={existingAnswer?.answer || ''}
                      onChange={(answer) => handleCommonAnswerChange(question.id, answer)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      const teamSelectionStep = getTeamSelectionStepIndex()
      if (currentStep === teamSelectionStep) {
        // Team Selection
        return (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
              Select Teams
            </h3>
            {currentEvent.allowMultipleTeamSelection && (
              <div className="text-sm text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                You can select multiple teams for this event.
              </div>
            )}
            <div className="space-y-4">
              {currentEvent.teams?.map((team) => (
                <div key={team.id} className="border border-gray-200 dark:border-blue-800 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 dark:bg-blue-900/10">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`team-${team.id}`}
                        checked={formData.participant!.selectedTeams.includes(team.id)}
                        onCheckedChange={(checked) => handleTeamSelection(team.id, checked as boolean)}
                        className="border-gray-300 dark:border-blue-800"
                      />
                      <div className="flex-1">
                        <Label htmlFor={`team-${team.id}`} className="text-lg font-semibold text-gray-800 dark:text-cyan-300 cursor-pointer">
                          {team.name}
                        </Label>
                        {team.description && (
                          <p className="text-sm text-gray-600 dark:text-blue-300 mt-1">
                            {team.description}
                          </p>
                        )}
                        {team.maxMembers && (
                          <p className="text-xs text-gray-500 dark:text-blue-400 mt-1">
                            Max members: {team.maxMembers}
                          </p>
                        )}
                        {team.questions && team.questions.length > 0 && (
                          <p className="text-xs text-blue-600 dark:text-cyan-400 mt-1">
                            This team has {team.questions.length} additional question{team.questions.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      const teamQuestionsStep = getTeamQuestionsStepIndex()
      if (currentStep === teamQuestionsStep && formData.participant.selectedTeams.length > 0) {
        // Team-specific Questions
        const selectedTeams = currentEvent.teams?.filter(team => 
          formData.participant!.selectedTeams.includes(team.id) && 
          team.questions && 
          team.questions.length > 0
        ) || []

        if (selectedTeams.length === 0) {
          return null
        }

        return (
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 dark:text-cyan-300 font-semibold">
              Team-Specific Questions
            </h3>
            {selectedTeams.map((team) => (
              <div key={team.id} className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-3 rounded-lg">
                  <h4 className="text-lg font-semibold text-white">
                    {team.name}
                  </h4>
                </div>
                <div className="space-y-4">
                  {(team.questions || []).map((question, index) => {
                    const teamAnswers = formData.participant!.teamAnswers.find(ta => ta.teamId === team.id)
                    const existingAnswer = teamAnswers?.answers.find(a => a.questionId === question.id)
                    return (
                      <div key={question.id} className="p-4 bg-gray-50 dark:bg-blue-900/10 rounded-lg border border-gray-200 dark:border-blue-800">
                        <div className="mb-2 text-sm font-medium text-blue-600 dark:text-cyan-400">
                          Question {index + 1}
                        </div>
                        <QuestionField
                          question={{ ...question, type: question.type || 'text', required: question.required || false }}
                          answer={existingAnswer?.answer || ''}
                          onChange={(answer) => handleTeamAnswerChange(team.id, question.id, answer)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      }
    }

    return null
  }

  // Get open events for the dropdown
  const openEvents = events.filter((event) => event.isOpen)
  const totalSteps = getTotalSteps()
  const isLastStep = currentStep === totalSteps - 1

  if (openEvents.length === 0) {
    return (
      <div className="w-full px-4 py-8 text-center">
        <div className="text-gray-500 dark:text-blue-400 text-lg">
          No events are currently open for registration.
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full px-2 sm:px-3 md:px-4 lg:px-6 min-h-screen py-3 sm:py-4"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-blue-900/20 border-0 md:border md:border-gray-200 md:dark:border-blue-800 shadow-lg dark:shadow-cyan-900/20 rounded-xl overflow-hidden">
          <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Progress Indicator */}
            {totalSteps > 1 && !showSuccess && (
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2 flex-1">
                  {Array.from({ length: totalSteps }, (_, index) => (
                    <React.Fragment key={index}>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                        index < currentStep 
                          ? 'bg-green-500 text-white' 
                          : index === currentStep 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 dark:bg-blue-800 text-gray-600 dark:text-blue-400'
                      }`}>
                        {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      {index < totalSteps - 1 && (
                        <div className={`flex-1 h-1 rounded transition-colors ${
                          index < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-blue-800'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="ml-4 text-sm font-medium text-gray-600 dark:text-blue-400">
                  Step {currentStep + 1} of {totalSteps}
                </div>
              </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={showSuccess ? 'success' : currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {!showSuccess && (
              <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-blue-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 bg-white dark:bg-blue-900/20 border-gray-300 dark:border-blue-800 text-gray-700 dark:text-cyan-100 hover:bg-gray-50 dark:hover:bg-blue-800/50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
                {isLastStep ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}
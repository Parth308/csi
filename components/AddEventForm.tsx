'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Users, Building2, HelpCircle, X, Edit } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

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
}

interface AddEventFormProps {
  onEventAdded: (event: Event) => void
  editingEvent?: Event
}

type EventValue = string | boolean | number | Team[] | Question[] | undefined

export function AddEventForm({ onEventAdded, editingEvent }: AddEventFormProps) {
  const [formData, setFormData] = useState<Event>({
    name: '',
    date: '',
    isOpen: true,
    eventType: 'team_registration',
    teamSize: 1,
    teams: [],
    commonQuestions: [],
    allowMultipleTeamSelection: false,
  })
  
  const [loading, setLoading] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<{ question: Question; teamId?: string; isCommon?: boolean } | null>(null)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const { toast } = useToast()

  // Initialize form with editing data
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        teams: editingEvent.teams || [],
        commonQuestions: editingEvent.commonQuestions || [],
      })
    }
  }, [editingEvent])

  const handleInputChange = (field: keyof Event, value: EventValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTeam = () => {
    const newTeam: Team = {
      id: uuidv4(),
      name: '',
      description: '',
      maxMembers: undefined,
      questions: []
    }
    setFormData(prev => ({
      ...prev,
      teams: [...(prev.teams || []), newTeam]
    }))
  }

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams?.map(team => 
        team.id === teamId ? { ...team, ...updates } : team
      ) || []
    }))
  }

  const removeTeam = (teamId: string) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams?.filter(team => team.id !== teamId) || []
    }))
  }

  const addCommonQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'text',
      question: '',
      required: true,
      placeholder: ''
    }
    setEditingQuestion({ question: newQuestion, isCommon: true })
    setShowQuestionForm(true)
  }

  const addTeamQuestion = (teamId: string) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'text',
      question: '',
      required: true,
      placeholder: ''
    }
    setEditingQuestion({ question: newQuestion, teamId })
    setShowQuestionForm(true)
  }

  const editQuestion = (question: Question, teamId?: string, isCommon?: boolean) => {
    setEditingQuestion({ question: { ...question }, teamId, isCommon })
    setShowQuestionForm(true)
  }

  const saveQuestion = (question: Question) => {
    if (editingQuestion?.isCommon) {
      // Add/update common question
      setFormData(prev => {
        const existingIndex = prev.commonQuestions?.findIndex(q => q.id === question.id) ?? -1
        if (existingIndex >= 0) {
          // Update existing
          return {
            ...prev,
            commonQuestions: prev.commonQuestions?.map((q, i) => 
              i === existingIndex ? question : q
            ) || []
          }
        } else {
          // Add new
          return {
            ...prev,
            commonQuestions: [...(prev.commonQuestions || []), question]
          }
        }
      })
    } else if (editingQuestion?.teamId) {
      // Add/update team question
      updateTeam(editingQuestion.teamId, {
        questions: (() => {
          const team = formData.teams?.find(t => t.id === editingQuestion.teamId)
          if (!team) return [question]
          
          const existingIndex = team.questions.findIndex(q => q.id === question.id)
          if (existingIndex >= 0) {
            // Update existing
            return team.questions.map((q, i) => i === existingIndex ? question : q)
          } else {
            // Add new
            return [...team.questions, question]
          }
        })()
      })
    }
    
    setShowQuestionForm(false)
    setEditingQuestion(null)
  }

  const removeQuestion = (questionId: string, teamId?: string, isCommon?: boolean) => {
    if (isCommon) {
      setFormData(prev => ({
        ...prev,
        commonQuestions: prev.commonQuestions?.filter(q => q.id !== questionId) || []
      }))
    } else if (teamId) {
      const team = formData.teams?.find(t => t.id === teamId)
      if (team) {
        updateTeam(teamId, {
          questions: team.questions.filter(q => q.id !== questionId)
        })
      }
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Event name is required", variant: "destructive" })
      return false
    }
    if (!formData.date) {
      toast({ title: "Error", description: "Event date is required", variant: "destructive" })
      return false
    }
    if (formData.eventType === 'recruitment') {
      if (!formData.teams || formData.teams.length === 0) {
        toast({ title: "Error", description: "At least one team is required for recruitment events", variant: "destructive" })
        return false
      }
      for (const team of formData.teams) {
        if (!team.name.trim()) {
          toast({ title: "Error", description: "All teams must have a name", variant: "destructive" })
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const url = '/api/admin/events'
      const method = editingEvent ? 'PUT' : 'POST'
      
      // Prepare the payload according to backend expectations
      const payload = {
        name: formData.name,
        date: formData.date,
        eventType: formData.eventType,
        isOpen: formData.isOpen,
      }

      // Add fields based on event type
      if (formData.eventType === 'team_registration') {
        Object.assign(payload, {
          teamSize: formData.teamSize || 1
        })
      } else if (formData.eventType === 'recruitment') {
        Object.assign(payload, {
          teams: formData.teams || [],
          commonQuestions: formData.commonQuestions || [],
          allowMultipleTeamSelection: formData.allowMultipleTeamSelection || false
        })
      }

      // Add ID for updates
      if (editingEvent && editingEvent._id) {
        Object.assign(payload, { id: editingEvent._id })
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save event')
      }

      const savedEvent = await response.json()
      onEventAdded(savedEvent)
      
      toast({
        title: editingEvent ? "Event Updated" : "Event Created",
        description: `${formData.name} has been ${editingEvent ? 'updated' : 'created'} successfully.`,
      })

      if (!editingEvent) {
        // Reset form for new events
        setFormData({
          name: '',
          date: '',
          isOpen: true,
          eventType: 'team_registration',
          teamSize: 1,
          teams: [],
          commonQuestions: [],
          allowMultipleTeamSelection: false,
        })
      }
    } catch (error) {
      console.error('Error saving event:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save event",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto bg-gray-100 text-black p-4 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Event Info */}
        <Card className="bg-white text-black shadow-sm">
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle className="text-black">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="name" className="text-black">Event Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter event name"
                required
                className="text-black"
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-black">Event Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                className="text-black"
              />
            </div>

            <div>
              <Label htmlFor="eventType" className="text-black">Event Type *</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value: 'team_registration' | 'recruitment') => 
                  handleInputChange('eventType', value)
                }
              >
                <SelectTrigger className="text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_registration">
                    <div className="flex items-center bg-gray-700 text-white rounded px-2 py-1">
                      <Users className="mr-2 h-4 w-4" />
                      Team Registration
                    </div>
                  </SelectItem>
                  <SelectItem value="recruitment">
                    <div className="flex items-center bg-gray-700 text-white rounded px-2 py-1">
                      <Building2 className="mr-2 h-4 w-4" />
                      Recruitment
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isOpen"
                checked={formData.isOpen}
                onCheckedChange={(checked) => handleInputChange('isOpen', checked)}
              />
              <Label htmlFor="isOpen" className="text-black">Registration Open</Label>
            </div>
          </CardContent>
        </Card>

        {/* Team Registration Configuration */}
        {formData.eventType === 'team_registration' && (
          <Card className="bg-white text-black shadow-sm">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-black">Team Configuration</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div>
                <Label htmlFor="teamSize" className="text-black">Team Size *</Label>
                <Select
                  value={formData.teamSize?.toString() || '1'}
                  onValueChange={(value) => handleInputChange('teamSize', parseInt(value))}
                >
                  <SelectTrigger className="text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-500'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} {size === 1 ? 'member' : 'members'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-1">
                  Select how many members can participate in this event as a team
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recruitment Configuration */}
        {formData.eventType === 'recruitment' && (
          <>
            {/* Recruitment Settings */}
            <Card className="bg-white text-black shadow-sm">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-black">Recruitment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowMultiple"
                    checked={formData.allowMultipleTeamSelection}
                    onCheckedChange={(checked) => handleInputChange('allowMultipleTeamSelection', checked)}
                  />
                  <Label htmlFor="allowMultiple" className="text-black">Allow Multiple Team Selection</Label>
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, participants can apply to multiple teams in a single registration
                </p>
              </CardContent>
            </Card>

            {/* Common Questions */}
            <Card className="bg-white text-black shadow-sm">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-black">Common Questions</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addCommonQuestion} 
                    variant="outline" 
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 border-gray-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Questions shown to all participants before team selection
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                {formData.commonQuestions && formData.commonQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {formData.commonQuestions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{question.type.toUpperCase()}</Badge>
                              {question.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                            </div>
                            <p className="font-medium text-black">
                              {index + 1}. {question.question || 'Untitled Question'}
                            </p>
                            {question.options && question.options.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-1">Options:</p>
                                <div className="flex flex-wrap gap-1">
                                  {question.options.map((option, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {option}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => editQuestion(question, undefined, true)}
                              className="hover:bg-gray-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id, undefined, true)}
                              className="text-red-600 hover:text-red-700 hover:bg-gray-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <HelpCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>No common questions added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Teams */}
            <Card className="bg-white text-black shadow-sm">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-black">Teams *</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addTeam} 
                    variant="outline" 
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 border-gray-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Define the teams available for recruitment
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                {formData.teams && formData.teams.length > 0 ? (
                  <div className="space-y-4">
                    {formData.teams.map((team, teamIndex) => (
                      <Card key={team.id} className="border border-gray-200 bg-white shadow-sm">
                        <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg text-black">Team {teamIndex + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTeam(team.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-gray-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-black">Team Name *</Label>
                              <Input
                                value={team.name}
                                onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                                placeholder="Enter team name"
                                required
                                className="text-black"
                              />
                            </div>
                            <div>
                              <Label className="text-black">Max Members</Label>
                              <Input
                                type="number"
                                value={team.maxMembers || ''}
                                onChange={(e) => updateTeam(team.id, { 
                                  maxMembers: e.target.value ? parseInt(e.target.value) : undefined 
                                })}
                                placeholder="Unlimited"
                                min="1"
                                className="text-black"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-black">Description</Label>
                            <Textarea
                              value={team.description || ''}
                              onChange={(e) => updateTeam(team.id, { description: e.target.value })}
                              placeholder="Describe this team's role and responsibilities"
                              rows={2}
                              className="text-black"
                            />
                          </div>

                          {/* Team Questions */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <Label className="text-base font-medium text-black">Team Questions</Label>
                              <Button
                                type="button"
                                onClick={() => addTeamQuestion(team.id)}
                                variant="outline"
                                size="sm"
                                className="bg-gray-500 hover:bg-gray-200 border-gray-300"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Question
                              </Button>
                            </div>

                            {team.questions.length > 0 ? (
                              <div className="space-y-2">
                                {team.questions.map((question, qIndex) => (
                                  <div key={question.id} className="border rounded p-3 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <Badge variant="outline" className="text-xs">
                                            {question.type.toUpperCase()}
                                          </Badge>
                                          {question.required && (
                                            <Badge variant="destructive" className="text-xs">
                                              Required
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-sm font-medium text-black">
                                          {qIndex + 1}. {question.question || 'Untitled Question'}
                                        </p>
                                        {question.options && question.options.length > 0 && (
                                          <div className="mt-1">
                                            <div className="flex flex-wrap gap-1">
                                              {question.options.map((option, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                  {option}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => editQuestion(question, team.id)}
                                          className="hover:bg-gray-200"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeQuestion(question.id, team.id)}
                                          className="text-red-600 hover:text-red-700 hover:bg-gray-200"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded">
                                <HelpCircle className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                                <p className="text-sm">No questions for this team yet</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <Building2 className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>No teams added yet</p>
                    <p className="text-sm">Add at least one team to continue</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-300">
          <Button 
            type="submit" 
            disabled={loading} 
            className="min-w-[120px] bg-gray-800 text-white hover:bg-gray-700"
          >
            {loading ? "Saving..." : (editingEvent ? "Update Event" : "Create Event")}
          </Button>
        </div>
      </form>

      {/* Question Form Modal */}
      {showQuestionForm && editingQuestion && (
        <QuestionForm
          question={editingQuestion.question}
          onSave={saveQuestion}
          onCancel={() => {
            setShowQuestionForm(false)
            setEditingQuestion(null)
          }}
        />
      )}
    </div>
  )
}

// Question Form Component
interface QuestionFormProps {
  question: Question
  onSave: (question: Question) => void
  onCancel: () => void
}

function QuestionForm({ question, onSave, onCancel }: QuestionFormProps) {
  const [formData, setFormData] = useState<Question>({ ...question })
  const [newOption, setNewOption] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.question.trim()) return
    onSave(formData)
  }

  const addOption = () => {
    if (!newOption.trim()) return
    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption.trim()]
    }))
    setNewOption('')
  }

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-black shadow-xl">
        <CardHeader className="bg-gray-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-black">
              {question.question ? 'Edit Question' : 'Add Question'}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="questionText" className="text-black">Question *</Label>
              <Textarea
                id="questionText"
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question"
                required
                rows={2}
                className="text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="questionType" className="text-black">Question Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Question['type']) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-500'>
                    <SelectItem value="text">Short Text</SelectItem>
                    <SelectItem value="textarea">Long Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="required"
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="required" className="text-black">Required</Label>
              </div>
            </div>

            {formData.type === 'mcq' && (
              <div>
                <Label className="text-black">Options</Label>
                <div className="space-y-2">
                  {formData.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input value={option} readOnly className="flex-1 text-black" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-gray-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add option"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                      className="text-black"
                    />
                    <Button 
                      type="button" 
                      onClick={addOption} 
                      variant="outline" 
                      size="sm"
                      className="bg-gray-100 hover:bg-gray-200 border-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {(formData.type === 'text' || formData.type === 'textarea') && (
              <>
                <div>
                  <Label htmlFor="placeholder" className="text-black">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    value={formData.placeholder || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
                    placeholder="Enter placeholder text"
                    className="text-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLength" className="text-black">Min Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={formData.minLength || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        minLength: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      min="0"
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLength" className="text-black">Max Length</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      value={formData.maxLength || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      min="1"
                      className="text-black"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-300">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                className="text-black border-gray-400 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gray-800 text-white hover:bg-gray-700"
              >
                Save Question
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
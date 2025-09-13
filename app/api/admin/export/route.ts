// app/api/admin/export/route.ts
import { NextRequest, NextResponse } from 'next/server'
import * as xlsx from 'xlsx'

// Define interfaces matching your Mongoose models
interface Answer {
  questionId: string
  answer: string | number | string[] // Can be string, number, or array for multiple selections
}

interface Member {
  name: string
  registrationNumber: string
  section?: string
  year: string
  branch: string
  officialEmail: string
  phoneNumber: string
}

interface Participant {
  name: string
  registrationNumber: string
  section?: string
  year: string
  branch: string
  officialEmail: string
  phoneNumber: string
  selectedTeams?: string[]
  commonAnswers: Answer[]
  teamAnswers: {
    teamId: string
    answers: Answer[]
  }[]
}

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
  _id: string
  name: string
  eventType: 'team_registration' | 'recruitment'
  teams?: Team[]
  commonQuestions?: Question[]
}

interface Registration {
  _id: string
  eventType: 'team_registration' | 'recruitment'
  members: Member[]
  participant?: Participant
  event: string | Event
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export async function POST(request: NextRequest) {
  try {
    const { eventId, registrations, events } = await request.json()

    // Filter registrations for the selected event
    const filteredRegistrations = registrations.filter((reg: Registration) => {
      if (typeof reg.event === 'string') {
        return reg.event === eventId
      }
      return reg.event._id === eventId
    })

    if (filteredRegistrations.length === 0) {
      return NextResponse.json({ error: 'No registrations found for this event' }, { status: 404 })
    }

    // Get event details
    const event = events.find((e: Event) => e._id === eventId) || 
                  (typeof filteredRegistrations[0].event === 'string' 
                    ? events.find((e: Event) => e._id === filteredRegistrations[0].event)
                    : filteredRegistrations[0].event)

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const eventName = event.name
    const eventType = event.eventType

    // Create workbook and worksheet
    const workbook = xlsx.utils.book_new()

    // Transform registrations based on event type
    let transformedRegistrations = []

    if (eventType === 'team_registration') {
      // Team registration data
      transformedRegistrations = filteredRegistrations.map((reg: Registration) => {
        const baseData = {
          'Registration ID': reg._id,
          'Event': eventName,
          'Registration Date': new Date(reg.createdAt).toLocaleDateString(),
          'Status': reg.status,
          'Team Size': reg.members.length
        }

        // Add member data for each member
        const memberData: Record<string, string | undefined> = {}
        reg.members.forEach((member: Member, index: number) => {
          const memberNum = index + 1
          memberData[`Member ${memberNum} Name`] = member.name
          memberData[`Member ${memberNum} Reg Number`] = member.registrationNumber
          memberData[`Member ${memberNum} Section`] = member.section
          memberData[`Member ${memberNum} Email`] = member.officialEmail
          memberData[`Member ${memberNum} Phone`] = member.phoneNumber
          memberData[`Member ${memberNum} Year`] = member.year
          memberData[`Member ${memberNum} Branch`] = member.branch
        })

        return { ...baseData, ...memberData }
      })
    } else {
      // Recruitment data with questions and answers
      // Create headers for common questions
      const commonQuestionHeaders: Record<string, string> = {}
      if (event.commonQuestions) {
        event.commonQuestions.forEach((question: Question) => {
          commonQuestionHeaders[`Common: ${question.question}`] = ''
        })
      }

      // Create headers for team-specific questions
      const teamQuestionHeaders: Record<string, string> = {}
      if (event.teams) {
        event.teams.forEach((team: Team) => {
          if (team.questions) {
            team.questions.forEach((question: Question) => {
              teamQuestionHeaders[`Team ${team.name}: ${question.question}`] = ''
            })
          }
        })
      }

      // Process each registration
      transformedRegistrations = filteredRegistrations.map((reg: Registration) => {
        const participant = reg.participant
        
        // Base participant data
        const baseData = {
          'Registration ID': reg._id,
          'Event': eventName,
          'Registration Date': new Date(reg.createdAt).toLocaleDateString(),
          'Status': reg.status,
          'Name': participant?.name || '',
          'Reg Number': participant?.registrationNumber || '',
          'Section': participant?.section || '',
          'Email': participant?.officialEmail || '',
          'Phone': participant?.phoneNumber || '',
          'Year': participant?.year || '',
          'Branch': participant?.branch || '',
          'Selected Teams': participant?.selectedTeams?.map(teamId => {
            const team = event.teams?.find((t: Team) => t.id === teamId)
            return team ? team.name : teamId
          }).join(', ') || ''
        }

        // Initialize question answer data
        const questionAnswerData = { ...commonQuestionHeaders, ...teamQuestionHeaders }

        // Fill common question answers
        if (participant?.commonAnswers && event.commonQuestions) {
          participant.commonAnswers.forEach((answer: Answer) => {
            const question = event.commonQuestions?.find((q: Question) => q.id === answer.questionId)
            if (question) {
              const headerKey = `Common: ${question.question}`
              questionAnswerData[headerKey] = Array.isArray(answer.answer) 
                ? answer.answer.join(', ') 
                : String(answer.answer)
            }
          })
        }

        // Fill team-specific question answers
        if (participant?.teamAnswers && event.teams) {
          participant.teamAnswers.forEach((teamAnswer) => {
            const team = event.teams?.find((t: Team) => t.id === teamAnswer.teamId)
            if (team && team.questions) {
              teamAnswer.answers.forEach((answer: Answer) => {
                const question = team.questions.find((q: Question) => q.id === answer.questionId)
                if (question) {
                  const headerKey = `Team ${team.name}: ${question.question}`
                  questionAnswerData[headerKey] = Array.isArray(answer.answer) 
                    ? answer.answer.join(', ') 
                    : String(answer.answer)
                }
              })
            }
          })
        }

        return { ...baseData, ...questionAnswerData }
      })
    }

    const worksheet = xlsx.utils.json_to_sheet(transformedRegistrations)

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, `${eventName} Registrations`)

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${eventName.replace(/\s+/g, '_')}_registrations.xlsx`
      }
    })
  } catch (error) {
    console.error('Error generating Excel:', error)
    return NextResponse.json({ error: 'Failed to generate Excel file' }, { status: 500 })
  }
}
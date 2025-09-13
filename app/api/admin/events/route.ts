// app/api/admin/events/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/lib/models/Event'

export async function GET() {
  try {
    await connectToDatabase()
    const events = await Event.find().sort({ date: 1 })
    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    const { name, date, eventType = 'team_registration', teamSize, teams, commonQuestions, allowMultipleTeamSelection } = requestData
    
    if (!name || !date) {
      return NextResponse.json(
        { error: 'Name and date are required' },
        { status: 400 }
      )
    }

    // Validate based on event type
    if (eventType === 'team_registration') {
      if (teamSize !== undefined && (typeof teamSize !== 'number' || teamSize < 1 || teamSize > 10)) {
        return NextResponse.json(
          { error: 'Team size must be a number between 1 and 10' },
          { status: 400 }
        )
      }
    } else if (eventType === 'recruitment') {
      if (!teams || !Array.isArray(teams) || teams.length === 0) {
        return NextResponse.json(
          { error: 'At least one team is required for recruitment events' },
          { status: 400 }
        )
      }

      // Validate teams structure
      for (const team of teams) {
        if (!team.id || !team.name) {
          return NextResponse.json(
            { error: 'Each team must have an id and name' },
            { status: 400 }
          )
        }
      }
    }

    await connectToDatabase()
    
    const eventData: any = {
      name,
      date,
      eventType,
      isOpen: true
    }

    if (eventType === 'team_registration') {
      eventData.teamSize = teamSize || 1
    } else if (eventType === 'recruitment') {
      eventData.teams = teams
      eventData.commonQuestions = commonQuestions || []
      eventData.allowMultipleTeamSelection = allowMultipleTeamSelection || false
    }

    const newEvent = await Event.create(eventData)

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Validate teamSize if provided in update for team registration events
    if (updateData.eventType === 'team_registration' && updateData.teamSize !== undefined && 
        (typeof updateData.teamSize !== 'number' || updateData.teamSize < 1 || updateData.teamSize > 10)) {
      return NextResponse.json(
        { error: 'Team size must be a number between 1 and 10' },
        { status: 400 }
      )
    }

    // Validate teams for recruitment events
    if (updateData.eventType === 'recruitment' && updateData.teams) {
      if (!Array.isArray(updateData.teams) || updateData.teams.length === 0) {
        return NextResponse.json(
          { error: 'At least one team is required for recruitment events' },
          { status: 400 }
        )
      }

      for (const team of updateData.teams) {
        if (!team.id || !team.name) {
          return NextResponse.json(
            { error: 'Each team must have an id and name' },
            { status: 400 }
          )
        }
      }
    }

    await connectToDatabase()
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    )

    if (!updatedEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()
    const deletedEvent = await Event.findByIdAndDelete(id)

    if (!deletedEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
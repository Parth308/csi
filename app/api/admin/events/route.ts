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
    const { name, date, teamSize } = await request.json()
    
    if (!name || !date) {
      return NextResponse.json(
        { error: 'Name and date are required' },
        { status: 400 }
      )
    }

    // Validate teamSize if provided
    if (teamSize !== undefined && (typeof teamSize !== 'number' || teamSize < 1 || teamSize > 10)) {
      return NextResponse.json(
        { error: 'Team size must be a number between 1 and 10' },
        { status: 400 }
      )
    }

    await connectToDatabase()
    const newEvent = await Event.create({
      name,
      date,
      teamSize: teamSize || 1, // Default to 1 if not provided
      isOpen: true
    })

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

    // Validate teamSize if provided in update
    if (updateData.teamSize !== undefined && 
        (typeof updateData.teamSize !== 'number' || updateData.teamSize < 1 || updateData.teamSize > 10)) {
      return NextResponse.json(
        { error: 'Team size must be a number between 1 and 10' },
        { status: 400 }
      )
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
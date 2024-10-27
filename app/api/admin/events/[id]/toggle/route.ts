import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/lib/models/Event'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { isOpen } = await request.json()

    await connectToDatabase()
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { isOpen },
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
    console.error('Error toggling event registration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
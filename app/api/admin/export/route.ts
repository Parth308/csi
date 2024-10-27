import { NextRequest, NextResponse } from 'next/server'
import * as xlsx from 'xlsx'

interface Event {
  _id: string;
  name: string;
}

interface Registration {
  name: string;
  registrationNumber: string;
  officialEmail: string;
  phoneNumber: string;
  event: string | { _id: string; name: string };
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { registrations, events } = await request.json()

    // Create workbook and worksheet
    const workbook = xlsx.utils.book_new()

    const getEventName = (eventData: Registration['event']) => {
      if (typeof eventData === 'string') {
        const event = events.find((e: Event) => e._id === eventData)
        return event?.name || eventData
      }
      return eventData.name
    }

    const worksheet = xlsx.utils.json_to_sheet(registrations.map((reg: Registration) => ({
      Name: reg.name,
      'Registration Number': reg.registrationNumber,
      Email: reg.officialEmail,
      'Phone Number': reg.phoneNumber,
      Event: getEventName(reg.event),
      'Registration Date': new Date(reg.createdAt).toLocaleDateString()
    })))

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Registrations')

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=registrations.xlsx'
      }
    })
  } catch (error) {
    console.error('Error generating Excel:', error)
    return NextResponse.json({ error: 'Failed to generate Excel file' }, { status: 500 })
  }
}
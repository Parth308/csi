// app/api/admin/export/route.ts

import { NextRequest, NextResponse } from 'next/server'
import * as xlsx from 'xlsx'

interface Member {
  name: string
  registrationNumber: string
  officialEmail: string
  phoneNumber: string
  year: string
  branch: string
}

interface Event {
  _id: string;
  name: string;
}

interface Registration {
  _id: string;
  members: Member[];
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

    // Transform registrations to have all members in one row
    const transformedRegistrations = registrations.map((reg: Registration) => {
      const baseData = {
        'Team ID': reg._id,
        'Event': getEventName(reg.event),
        'Registration Date': new Date(reg.createdAt).toLocaleDateString(),
        'Team Size': reg.members.length
      }

      // Add member data for each member
      const memberData: { [key: string]: any } = {}
      reg.members.forEach((member: Member, index: number) => {
        const memberNum = index + 1
        memberData[`Member ${memberNum} Name`] = member.name
        memberData[`Member ${memberNum} Reg Number`] = member.registrationNumber
        memberData[`Member ${memberNum} Email`] = member.officialEmail
        memberData[`Member ${memberNum} Phone`] = member.phoneNumber
        memberData[`Member ${memberNum} Year`] = member.year
        memberData[`Member ${memberNum} Branch`] = member.branch
      })

      return { ...baseData, ...memberData }
    })

    const worksheet = xlsx.utils.json_to_sheet(transformedRegistrations)

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
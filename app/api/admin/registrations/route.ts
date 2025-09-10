// app/api/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import Event from '@/lib/models/Event';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { members, event } = body;

    if (!members || !Array.isArray(members) || members.length === 0 || !event) {
      return NextResponse.json(
        { error: 'Members array and event are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get event details to validate team size
    const eventDoc = await Event.findById(event);
    if (!eventDoc) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (members.length !== eventDoc.teamSize) {
      return NextResponse.json(
        { error: `This event requires exactly ${eventDoc.teamSize} members` },
        { status: 400 }
      );
    }

    // Validate required fields for each member
    for (const member of members) {
      const { name, registrationNumber, section, year, branch, officialEmail, phoneNumber } = member;
      if (!name || !registrationNumber || !section || !year || !branch || !officialEmail || !phoneNumber) {
        return NextResponse.json(
          { error: 'All fields are required for each member' },
          { status: 400 }
        );
      }
    }

    // Check for existing registration for any member
    const existingConditions = members.map(member => ({
      $or: [
        { 'members.registrationNumber': member.registrationNumber },
        { 'members.officialEmail': member.officialEmail }
      ]
    }));

    const existingRegistration = await Registration.findOne({
      event,
      $or: existingConditions
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'One or more members have already registered for this event' },
        { status: 400 }
      );
    }

    console.log('Creating registration with members:', members, 'for event:', event);
    // Create new registration
    const registration = await Registration.create({
      members,
      event
    });

    return NextResponse.json(
      { message: 'Registration successful', registration },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: (error instanceof Error) ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const registrations = await Registration.find()
      .populate('event')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
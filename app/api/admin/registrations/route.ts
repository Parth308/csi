import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      registrationNumber, 
      year,
      branch,
      officialEmail, 
      phoneNumber, 
      event 
    } = body;

    // Validate required fields
    if (!name || !registrationNumber || !year || !branch || !officialEmail || !phoneNumber || !event) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check for existing registration
    const existingRegistration = await Registration.findOne({
      event,
      $or: [
        { registrationNumber },
        { officialEmail }
      ]
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You have already registered for this event with this email or registration number' },
        { status: 400 }
      );
    }

    // Create new registration
    const registration = await Registration.create({
      name,
      registrationNumber,
      year,
      branch,
      officialEmail,
      phoneNumber,
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
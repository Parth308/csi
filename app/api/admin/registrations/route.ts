import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import Event from '@/lib/models/Event';

// Define interfaces for better typing
interface Member {
  name: string;
  registrationNumber: string;
  section: string;
  year: string;
  branch: string;
  officialEmail: string;
  phoneNumber: string;
}

// Define the structure for answers
interface QuestionAnswer {
  questionId: string;  // or number, depending on your implementation
  answer: string | string[] | boolean;  // adjust based on your question types
}

interface Participant extends Member {
  selectedTeams: string[];
  commonAnswers?: QuestionAnswer[];
  teamAnswers?: QuestionAnswer[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, eventType, members, participant } = body;

    if (!eventId || !eventType) {
      return NextResponse.json(
        { error: 'Event ID and event type are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get event details
    const eventDoc = await Event.findById(eventId);
    if (!eventDoc) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (!eventDoc.isOpen) {
      return NextResponse.json(
        { error: 'Event registration is closed' },
        { status: 400 }
      );
    }

    if (eventDoc.eventType !== eventType) {
      return NextResponse.json(
        { error: 'Event type mismatch' },
        { status: 400 }
      );
    }

    const registrationData: {
      event: string;
      eventType: string;
      members?: Member[];
      participant?: Participant;
    } = {
      event: eventId,
      eventType: eventType,
    };

    if (eventType === 'team_registration') {
      // Handle team registration
      if (!members || !Array.isArray(members) || members.length === 0) {
        return NextResponse.json(
          { error: 'Members array is required for team registration' },
          { status: 400 }
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
      const existingConditions = members.map((member) => ({
        $or: [
          { 'members.registrationNumber': member.registrationNumber },
          { 'members.officialEmail': member.officialEmail }
        ]
      }));

      const existingRegistration = await Registration.findOne({
        event: eventId,
        eventType: 'team_registration',
        $or: existingConditions
      });

      if (existingRegistration) {
        return NextResponse.json(
          { error: 'One or more members have already registered for this event' },
          { status: 400 }
        );
      }

      registrationData.members = members;

    } else if (eventType === 'recruitment') {
      // Handle recruitment registration
      if (!participant) {
        return NextResponse.json(
          { error: 'Participant data is required for recruitment events' },
          { status: 400 }
        );
      }

      const {
        name,
        registrationNumber,
        section,
        year,
        branch,
        officialEmail,
        phoneNumber,
        selectedTeams,
        commonAnswers,
        teamAnswers
      } = participant;

      // Validate required participant fields
      if (!name || !registrationNumber || !section || !year || !branch || !officialEmail || !phoneNumber) {
        return NextResponse.json(
          { error: 'All participant fields are required' },
          { status: 400 }
        );
      }

      // Validate selected teams
      if (!selectedTeams || selectedTeams.length === 0) {
        return NextResponse.json(
          { error: 'At least one team must be selected' },
          { status: 400 }
        );
      }

      // Check if multiple team selection is allowed
      if (selectedTeams.length > 1 && !eventDoc.allowMultipleTeamSelection) {
        return NextResponse.json(
          { error: 'Multiple team selection is not allowed for this event' },
          { status: 400 }
        );
      }

      // Validate selected teams exist in event
      const validTeamIds = eventDoc.teams.map((team: { id: string }) => team.id);
      for (const teamId of selectedTeams) {
        if (!validTeamIds.includes(teamId)) {
          return NextResponse.json(
            { error: `Invalid team selected: ${teamId}` },
            { status: 400 }
          );
        }
      }

      // Check for existing registration
      const existingRegistration = await Registration.findOne({
        event: eventId,
        eventType: 'recruitment',
        $or: [
          { 'participant.registrationNumber': registrationNumber },
          { 'participant.officialEmail': officialEmail }
        ]
      });

      if (existingRegistration) {
        return NextResponse.json(
          { error: 'You have already registered for this event' },
          { status: 400 }
        );
      }

      registrationData.participant = {
        name,
        registrationNumber,
        section,
        year,
        branch,
        officialEmail,
        phoneNumber,
        selectedTeams,
        commonAnswers: commonAnswers || [],
        teamAnswers: teamAnswers || []
      };
    }

    // Create new registration
    const registration = await Registration.create(registrationData);

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
      .limit(10000);

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
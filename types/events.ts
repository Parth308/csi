// types/events.ts
export interface Question {
  id: string; // keep `id` (used in EventRegistrationForm)
  type?: "mcq" | "text" | "textarea" | "number"; // optional for backend
  question: string;
  required?: boolean;
  options?: string[];
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
}

export interface Team {
  id: string; // keep `id`
  name: string;
  description?: string;
  maxMembers?: number;
  questions?: Question[];
}

export interface Event {
  _id: string; // backend sends `_id`
  name: string;
  date: string;
  isOpen: boolean;
  eventType: "team_registration" | "recruitment";
  teamSize?: number;
  teams?: Team[];
  commonQuestions?: Question[];
  allowMultipleTeamSelection?: boolean;
}

export interface MemberData {
  name: string;
  registrationNumber: string;
  section: string;
  year: string;
  branch: string;
  officialEmail: string;
  phoneNumber: string;
}

export interface Answer {
  questionId: string;
  answer: string | number | string[];
}

export interface ParticipantData {
  name: string;
  registrationNumber: string;
  section: string;
  year: string;
  branch: string;
  officialEmail: string;
  phoneNumber: string;
  selectedTeams: string[];
  commonAnswers: Answer[];
  teamAnswers: {
    teamId: string;
    answers: Answer[];
  }[];
}

export interface RegistrationFormData {
  eventType: "team_registration" | "recruitment";
  members?: MemberData[];
  participant?: ParticipantData;
  eventId: string;
}

export interface EventsApiResponse {
  events: Event[];
}

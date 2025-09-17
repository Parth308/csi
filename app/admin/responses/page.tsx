// app/admin/responses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight, Users, User, LayoutDashboard, Calendar, Home, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import CSILoading from '@/components/CsiLoading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Define TypeScript interfaces
interface Answer {
  questionId: string;
  answer: string | number | string[];
}

interface Member {
  name: string;
  registrationNumber: string;
  section?: string;
  year: string;
  branch: string;
  officialEmail: string;
  phoneNumber: string;
}

interface Participant {
  name: string;
  registrationNumber: string;
  section?: string;
  year: string;
  branch: string;
  officialEmail: string;
  phoneNumber: string;
  selectedTeams?: string[];
  commonAnswers: Answer[];
  teamAnswers: {
    teamId: string;
    answers: Answer[];
  }[];
}

interface Question {
  id: string;
  type: 'mcq' | 'text' | 'textarea' | 'number';
  question: string;
  required: boolean;
  options?: string[];
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  maxMembers?: number;
  questions: Question[];
}

interface Event {
  _id: string;
  name: string;
  eventType: 'team_registration' | 'recruitment';
  teams?: Team[];
  commonQuestions?: Question[];
}

interface Registration {
  _id: string;
  eventType: 'team_registration' | 'recruitment';
  members: Member[];
  participant?: Participant;
  event: string | Event;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function RegistrationResponsesPage() {
  const { status } = useSession();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedExportEvent, setSelectedExportEvent] = useState<string>('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/admin/login';
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated') return;
      setLoading(true);
      setError(null);
      try {
        const [registrationsResponse, eventsResponse] = await Promise.all([
          fetch('/api/admin/registrations'),
          fetch('/api/admin/events')
        ]);

        if (!registrationsResponse.ok) throw new Error('Failed to fetch registrations');
        if (!eventsResponse.ok) throw new Error('Failed to fetch events');

        const registrationsData = await registrationsResponse.json();
        const eventsData = await eventsResponse.json();

        setRegistrations(registrationsData.registrations);
        setEvents(eventsData.events);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  const downloadExcel = async (eventId: string) => {
    try {
      setIsExportDialogOpen(false);
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, registrations, events }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${events.find(e => e._id === eventId)?.name.replace(/\s+/g, '_')}_registrations.xlsx` || 'registrations.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: "Registrations exported successfully!",
      });
    } catch (error) {
      console.error('Error downloading Excel:', error);
      toast({
        title: "Export Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesEvent = selectedEventFilter === 'all' ||
      (typeof reg.event === 'string' ? reg.event === selectedEventFilter : reg.event._id === selectedEventFilter);

    const regType = reg.eventType || (typeof reg.event !== 'string' ? reg.event.eventType : 'team_registration');
    const matchesType = selectedTypeFilter === 'all' || selectedTypeFilter === regType;
    
    const lowercasedQuery = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      (reg.participant?.name.toLowerCase().includes(lowercasedQuery)) ||
      (reg.members.some(member => member.name.toLowerCase().includes(lowercasedQuery)));

    return matchesEvent && matchesType && matchesSearch;
  });

  // Auto-select the first registration when filters change
  useEffect(() => {
    if (filteredRegistrations.length > 0) {
      const currentSelectionInFilteredList = filteredRegistrations.some(r => r._id === selectedRegistrationId);
      if (!currentSelectionInFilteredList) {
        setSelectedRegistrationId(filteredRegistrations[0]._id);
      }
    } else {
      setSelectedRegistrationId(null);
    }
  }, [selectedEventFilter, selectedTypeFilter, searchQuery, registrations]);


  if (status === 'loading') {
    return <div><CSILoading /></div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const getEventDetails = (eventData: Registration['event']) => {
    if (typeof eventData === 'string') {
      return events.find(e => e._id === eventData);
    }
    return eventData;
  };

  const getTeamName = (teamId: string, event: Event) => {
    const team = event.teams?.find(t => t.id === teamId);
    return team ? team.name : teamId;
  };

  const renderAnswer = (answer: string | number | string[]) => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return String(answer);
  };
  
  const selectedRegistration = registrations.find(reg => reg._id === selectedRegistrationId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}>
        <Link href="/admin">
          <div className="flex items-center justify-center h-16 bg-blue-600">
            <span className="text-2xl font-semibold text-white">CSI ADMIN</span>
          </div>
        </Link>
        <nav className="px-2 py-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/events" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <Calendar className="mr-3 h-5 w-5" />
            Events
          </Link>
          <Link href="/admin/responses" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
            <Users className="mr-3 h-5 w-5" />
            Responses
          </Link>
        </nav>
        
        <hr className="my-2 border-gray-200" />
        
        <div className="px-4 pb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Registrants ({filteredRegistrations.length})</h3>
        </div>

        {/* Scrollable list of registrants */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
            {filteredRegistrations.length > 0 ? (
                <div className="space-y-1">
                    {filteredRegistrations.map(reg => (
                        <Button 
                          key={reg._id}
                          variant="ghost"
                          onClick={() => setSelectedRegistrationId(reg._id)}
                          className={cn(
                            "w-full justify-start text-left h-auto py-2",
                            selectedRegistrationId === reg._id && "bg-blue-100 hover:bg-blue-100 text-blue-800"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-black">
                              {reg.participant ? reg.participant.name : reg.members[0]?.name || 'N/A'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getEventDetails(reg.event)?.name || 'Unknown Event'}
                            </span>
                          </div>
                        </Button>
                    ))}
                </div>
            ) : (
                <div className="text-center text-sm text-gray-500 px-4 py-8">
                    No matching registrations found.
                </div>
            )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full justify-start text-gray-900" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Main Site
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Registration Responses</h1>
            <div className="flex space-x-2 text-gray-900">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <CSILoading />
            ) : error ? (
              <div className="text-center text-red-600">
                <p>Error: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Filter and Export</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start md:items-end gap-4">
                    <div className="w-full md:flex-1 relative">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
                        <Search className="absolute left-3 top-9 h-4 w-4 text-gray-500" />
                        <Input 
                            id="search"
                            placeholder="e.g. John Doe" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="w-full md:w-auto min-w-[180px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                      <Select value={selectedEventFilter} onValueChange={setSelectedEventFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          <SelectItem value="all">All Events</SelectItem>
                          {events.map(event => (
                            <SelectItem key={event._id} value={event._id || ''}>
                              {event.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-auto min-w-[180px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                      <Select value={selectedTypeFilter} onValueChange={setSelectedTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="team_registration">Team Registration</SelectItem>
                          <SelectItem value="recruitment">Recruitment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-auto">
                        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white text-black">
                                <DialogHeader>
                                <DialogTitle>Select Event to Export</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                <Select value={selectedExportEvent} onValueChange={setSelectedExportEvent}>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select an event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {events.map(event => (
                                        <SelectItem key={event._id} value={event._id || ''} className="bg-white text-black">
                                        {event.name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                                    Cancel
                                    </Button>
                                    <Button
                                    onClick={() => downloadExcel(selectedExportEvent)}
                                    disabled={!selectedExportEvent}
                                    >
                                    Export
                                    </Button>
                                </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                  </CardContent>
                </Card>
                
                {selectedRegistration ? (
                    (() => {
                        const registration = selectedRegistration;
                        const eventDetails = getEventDetails(registration.event);
                        const isTeamRegistration = registration.eventType === 'team_registration' ||
                                                   (eventDetails && eventDetails.eventType === 'team_registration');
                        return (
                            <Card>
                                <CardContent className="p-6">
                                    <div key={registration._id} className="bg-white">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                            {isTeamRegistration ? (registration.members[0]?.name + "'s Team") : registration.participant?.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                            Event: {eventDetails?.name || 'Unknown Event'}
                                            </p>
                                        </div>
                                        <span className={cn(
                                            "mt-2 md:mt-0 px-2 py-1 rounded-full text-xs font-medium",
                                            registration.status === 'approved' && "bg-green-100 text-green-800",
                                            registration.status === 'rejected' && "bg-red-100 text-red-800",
                                            registration.status === 'pending' && "bg-yellow-100 text-yellow-800"
                                        )}>
                                            {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                        </span>
                                        </div>

                                        <div className="space-y-6">
                                            {isTeamRegistration ? (
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    Team Members ({registration.members.length})
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {registration.members.map((member, index) => (
                                                        <div key={index} className="border rounded p-3 bg-gray-50">
                                                        <div className="font-medium text-gray-900">{member.name}</div>
                                                        <div className="text-sm text-gray-600">
                                                            <p>Reg No: {member.registrationNumber}</p>
                                                            <p>Email: {member.officialEmail}</p>
                                                            <p>Phone: {member.phoneNumber}</p>
                                                            <p>Year: {member.year} | Branch: {member.branch}</p>
                                                            {member.section && <p>Section: {member.section}</p>}
                                                        </div>
                                                        </div>
                                                    ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                                    <User className="mr-2 h-4 w-4" />
                                                    Participant Details
                                                    </h4>
                                                    {registration.participant && (
                                                    <div className="border rounded p-3 bg-gray-50 mb-4">
                                                        <div className="font-medium text-gray-900">{registration.participant.name}</div>
                                                        <div className="text-sm text-gray-600">
                                                        <p>Reg No: {registration.participant.registrationNumber}</p>
                                                        <p>Email: {registration.participant.officialEmail}</p>
                                                        <p>Phone: {registration.participant.phoneNumber}</p>
                                                        <p>Year: {registration.participant.year} | Branch: {registration.participant.branch}</p>
                                                        {registration.participant.section && <p>Section: {registration.participant.section}</p>}
                                                        {registration.participant.selectedTeams && eventDetails && (
                                                            <p className="mt-2">
                                                            Selected Teams: {registration.participant.selectedTeams.map(teamId =>
                                                                getTeamName(teamId, eventDetails)
                                                            ).join(', ')}
                                                            </p>
                                                        )}
                                                        </div>
                                                    </div>
                                                    )}

                                                    {eventDetails && eventDetails.commonQuestions && registration.participant?.commonAnswers && (
                                                    <div className="mb-4">
                                                        <h4 className="font-medium text-gray-900 mb-2">Common Questions</h4>
                                                        <div className="space-y-3">
                                                        {eventDetails.commonQuestions.map(question => {
                                                            const answer = registration.participant?.commonAnswers?.find(
                                                            ans => ans.questionId === question.id
                                                            );
                                                            return (
                                                            <div key={question.id} className="border rounded p-3">
                                                                <p className="font-medium text-gray-900">{question.question}</p>
                                                                <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                                                                {answer ? renderAnswer(answer.answer) : 'No answer provided'}
                                                                </p>
                                                            </div>
                                                            );
                                                        })}
                                                        </div>
                                                    </div>
                                                    )}

                                                    {eventDetails && eventDetails.teams && registration.participant?.teamAnswers && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Team-Specific Questions</h4>
                                                        <div className="space-y-4">
                                                        {registration.participant.teamAnswers.map((teamAnswer, index) => {
                                                            const team = eventDetails.teams?.find(t => t.id === teamAnswer.teamId);
                                                            return (
                                                            <div key={index} className="border rounded p-3">
                                                                <h5 className="font-medium text-gray-900 mb-2">
                                                                Team: {team ? team.name : teamAnswer.teamId}
                                                                </h5>
                                                                <div className="space-y-3">
                                                                {team?.questions.map(question => {
                                                                    const answer = teamAnswer.answers.find(
                                                                    ans => ans.questionId === question.id
                                                                    );
                                                                    return (
                                                                    <div key={question.id}>
                                                                        <p className="font-medium text-gray-900">{question.question}</p>
                                                                        <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                                                                        {answer ? renderAnswer(answer.answer) : 'No answer provided'}
                                                                        </p>
                                                                    </div>
                                                                    );
                                                                })}
                                                                </div>
                                                            </div>
                                                            );
                                                        })}
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 text-sm text-gray-500 border-t pt-4">
                                            Registered on {new Date(registration.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })()
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Registration Selected</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {registrations.length > 0 ? 'Select a registration from the sidebar to view details.' : 'No registrations found.'}
                        </p>
                    </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import ClosedRegistrationMessage from "@/components/ClosedRegistrationMessage";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

// Updated Event interface to include teamSize
interface Event {
  _id: string;
  name: string;
  date: string;
  isOpen: boolean;
  teamSize: number;
}

// Define the API response structure
interface EventsApiResponse {
  events: Event[];
}

// Updated form data interface for team registration
interface MemberData {
  name: string;
  registrationNumber: string;
  year: string;
  branch: string;
  officialEmail: string;
  phoneNumber: string;
}

interface RegistrationFormData {
  members: MemberData[];
  event: string;
}

export default function JoinUs() {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/admin/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data: EventsApiResponse = await response.json();
        // Filter for open events and ensure teamSize exists
        setEvents(
          data.events
            .filter((event) => event.isOpen)
            .map((event) => ({
              ...event,
              teamSize: event.teamSize || 1, // Default to 1 if not set
            }))
        );
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchEvents();
  }, [toast]);

  const handleSubmit = async (
    formData: RegistrationFormData
  ): Promise<boolean> => {
    try {
      console.log("Submitting form data:", formData);

      const response = await fetch("/api/admin/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        console.log("Response not ok, throwing error");
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registration successful");
      toast({
        title: "Success!",
        description: "Your registration has been submitted successfully",
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: (error as Error).message,
      });
      return false;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
        <div className="absolute top-0 w-full h-[100%] dark:from-[#05050A] dark:via-[#0B1A2D] dark:to-[#04070F] bg-gradient-to-b from-white to-[#f0f9ff] z-0" />
        <NavBar activeSection={""} />
        <main className="flex-grow pt-20 relative z-1">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
              Registeration
            </h1>
            <AnimatePresence mode="wait">
              {events.length > 0 ? (
                <EventRegistrationForm
                  key="form"
                  events={events}
                  onSubmit={handleSubmit}
                />
              ) : (
                <ClosedRegistrationMessage key="closed" />
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ToastProvider>
  );
}
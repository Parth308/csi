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

interface Event {
  _id: string;
  name: string;
  date: string;
  isOpen: boolean;
  teamSize: number;
}

interface EventsApiResponse {
  events: Event[];
}

interface MemberData {
  name: string;
  registrationNumber: string;
  section: string;
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data: EventsApiResponse = await response.json();
        
        if (isMounted) {
          setEvents(
            data.events
              .filter((event) => event.isOpen)
              .map((event) => ({
                ...event,
                teamSize: event.teamSize || 1,
              }))
          );
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load events. Please try again later.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
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

  // Skeleton loading component
  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto w-full px-2 sm:px-3 md:px-4 lg:px-6 animate-pulse">
      <div className="bg-white dark:bg-blue-900/20 border-0 md:border md:border-gray-200 md:dark:border-blue-800 shadow-lg dark:shadow-cyan-900/20 rounded-xl overflow-hidden">
        <div className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {/* Event Selection Skeleton */}
          <div className="space-y-2 sm:space-y-3">
            <div className="h-6 sm:h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>

          {/* Team Members Section Skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="h-6 sm:h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            
            {/* Member Card Skeleton */}
            <div className="bg-gray-50 dark:bg-blue-900/10 rounded-xl border-0 md:border md:border-gray-200 md:dark:border-blue-800 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 h-8 sm:h-10"></div>
              <div className="p-2 sm:p-3 space-y-3">
                {/* Name and Registration Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                
                {/* Academic Info Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                
                {/* Contact Info Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button Skeleton */}
          <div className="pt-3 sm:pt-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
        <div className="absolute top-0 w-full h-[100%] dark:from-[#05050A] dark:via-[#0B1A2D] dark:to-[#04070F] bg-gradient-to-b from-white to-[#f0f9ff] z-0" />
        <NavBar activeSection={""} />
        <main className="flex-grow pt-20 relative z-1">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
              Registration
            </h1>
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingSkeleton key="loading" />
              ) : events.length > 0 ? (
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
"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

interface TeamMember {
  Name: string;
  Role: string;
  LinkedIn: string;
  GitHub: string;
  Email: string;
  Image: string;
}

interface TeamData {
  WebDevTeam: {
    TeamLead: TeamMember;
    TeamMembers: TeamMember[];
  };
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const MemberCard: React.FC<{ 
  member: TeamMember; 
  onSelect: (member: TeamMember) => void;
  isLead?: boolean;
}> = ({ member, onSelect, isLead }) => {
  return (
    <motion.div
      layoutId={`member-${member.Name}`}
      onClick={() => onSelect(member)}
      className={`group relative cursor-pointer ${
        isLead ? 'sm:scale-110' : ''
      }`}
      variants={fadeInUp}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-0">
          <div className="relative h-72 w-full">
            <Image
              src={member.Image}
              alt={member.Name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              priority={isLead}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">{member.Name}</h3>
              <div className="flex items-center space-x-2">
                {isLead && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Team Lead
                  </span>
                )}
                <p className="text-sm opacity-90">{member.Role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MemberDetails: React.FC<{ 
  member: TeamMember; 
  onClose: () => void;
  isLead?: boolean;
}> = ({ member, onClose, isLead }) => {
  return (
    <motion.div
      initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
      animate={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId={`member-${member.Name}`}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-80 w-full">
          <Image 
            src={member.Image} 
            alt={member.Name} 
            layout="fill" 
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Close details"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-blue-900 ">
                {member.Name}
              </h2>
              <div className="flex items-center space-x-3">
                {isLead && (
                  <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                    Team Lead
                  </span>
                 )}
                <p className="text-xl text-blue-600 dark:text-blue-400">
                  {member.Role}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-6">
            <a
              href={member.GitHub}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Github size={24} />
              <span>GitHub</span>
            </a>
            <a
              href={member.LinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Linkedin size={24} />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${member.Email}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Mail size={24} />
              <span>Email</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function WebDevTeam() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/web_dev.json');
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        const data = await response.json();
        setTeamData(data);
      } catch (error) {
        setError('Failed to load team data. Please try again later.');
        console.error('Error fetching team data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavBar activeSection="" scrollToSection={() => {}} />
      <main className="flex-grow pt-20 sm:pt-24 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundImage: [
              "radial-gradient(circle at 20% 30%, #3b82f6 1px, transparent 1px)",
              "radial-gradient(circle at 80% 70%, #3b82f6 1px, transparent 1px)"
            ],
            backgroundSize: "50px 50px",
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Meet Our Web Dev Team
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We&apos;re a team of passionate developers dedicated to creating amazing web experiences.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="text-gray-600 dark:text-gray-300">Loading team data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 dark:text-red-400 p-8">
              <p>{error}</p>
            </div>
          ) : teamData ? (
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-16"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
                <div className="sm:col-start-2">
                  <MemberCard 
                    member={teamData.WebDevTeam.TeamLead} 
                    onSelect={setSelectedMember}
                    isLead
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamData.WebDevTeam.TeamMembers.map((member) => (
                  <MemberCard 
                    key={member.Name} 
                    member={member} 
                    onSelect={setSelectedMember}
                  />
                ))}
              </div>
            </motion.div>
          ) : null}

          <AnimatePresence>
            {selectedMember && (
              <MemberDetails 
                member={selectedMember} 
                onClose={() => setSelectedMember(null)}
                isLead={selectedMember.Name === teamData?.WebDevTeam.TeamLead.Name}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
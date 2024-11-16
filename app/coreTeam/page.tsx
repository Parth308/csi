"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Mail, X } from 'lucide-react'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

interface TeamMember {
  Name: string
  Role: string
  LinkedIn: string
  GitHub: string
  Email: string
  Image: string
}

interface TeamData {
  WebDevTeam: {
    TeamLead: TeamMember
    TeamMembers: TeamMember[]
  }
}

const MemberCard: React.FC<{ member: TeamMember; onSelect: (member: TeamMember) => void }> = ({ member, onSelect }) => {
  return (
    <motion.div
      layoutId={`member-${member.Name}`}
      onClick={() => onSelect(member)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-64 w-full">
        <Image src={member.Image} alt={member.Name} layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold">{member.Name}</h3>
          <p className="text-sm opacity-90">{member.Role}</p>
        </div>
      </div>
    </motion.div>
  )
}

const MemberDetails: React.FC<{ member: TeamMember; onClose: () => void }> = ({ member, onClose }) => {
  return (
    <motion.div
      layoutId={`member-${member.Name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 w-full">
          <Image src={member.Image} alt={member.Name} layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close details"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{member.Name}</h2>
          <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">{member.Role}</p>
          <div className="flex space-x-4">
            <a href={member.GitHub} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <Github size={24} />
            </a>
            <a href={member.LinkedIn} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href={`mailto:${member.Email}`} className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function WebDevTeam() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [teamData, setTeamData] = useState<TeamData | null>(null)

  useEffect(() => {
    fetch('/web_dev.json')
      .then(response => response.json())
      .then(data => {
        setTeamData(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching team data:', error)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#f9fcff] to-[#e6f5ff]">
      <NavBar activeSection="" scrollToSection={() => {}} />
      
      <main className="flex-grow pt-16 sm:pt-20 relative overflow-hidden">
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

        <div className="container mx-auto px-4 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">
              <span className="bg-gradient-to-r from-blue-500 via-gray-600 to-blue-500 bg-clip-text text-transparent">
                Meet Our Web Dev Team
              </span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              We're a group of passionate developers dedicated to creating amazing web experiences.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : teamData ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="sm:col-start-2">
                  <MemberCard 
                    member={teamData.WebDevTeam.TeamLead} 
                    onSelect={setSelectedMember}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamData.WebDevTeam.TeamMembers.map((member) => (
                  <MemberCard key={member.Name} member={member} onSelect={setSelectedMember} />
                ))}
              </div>
            </motion.div>
          ) : null}

          <AnimatePresence>
            {selectedMember && (
              <MemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
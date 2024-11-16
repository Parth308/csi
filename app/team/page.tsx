"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { GithubIcon, LinkedinIcon, Sparkles, X } from 'lucide-react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const FloatingParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-400 rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [-20, -40],
      x: [-10, 10]
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
)

const TimelineDot = ({ year, isActive, onClick, delay }: { 
  year: number, 
  isActive: boolean, 
  onClick: () => void,
  delay: number 
}) => (
  <motion.div 
    className="relative flex flex-col items-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <motion.div
      className="relative cursor-pointer mb-4 sm:mb-8"
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <motion.div
        className="absolute -inset-4 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100"
        initial={false}
        animate={isActive ? { scale: 1.2, opacity: 0.2 } : { scale: 1, opacity: 0 }}
      />
      <motion.div
        className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
          ${isActive ? 'bg-gradient-to-r from-blue-500 to-gray-600' : 'bg-blue-200'}`}
        animate={{ 
          scale: isActive ? [1, 1.1, 1] : 1,
          rotate: isActive ? [0, 5, -5, 0] : 0
        }}
        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
      >
        {isActive && (
          <motion.div
            className="absolute -inset-2 border-2 border-blue-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <Sparkles 
          className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-blue-500'}`}
          style={{ opacity: isActive ? 1 : 0.5 }}
        />
      </motion.div>
    </motion.div>
    
    <motion.div
      className="absolute top-full text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.2, duration: 0.5 }}
    >
      <span className={`text-sm sm:text-base font-bold ${isActive ? 'text-blue-600' : 'text-blue-400'}`}>
        {year}
      </span>
    </motion.div>
  </motion.div>
)

interface TeamMember {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  linkedin?: string
  github?: string
}

const TeamMemberCard = ({ member, index, onClick }: { member: TeamMember; index: number; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
      onClick={onClick}
    >
      <Card className="relative bg-white/80 backdrop-blur-md overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-gray-600/10 to-blue-500/10"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        <div className="p-4 sm:p-6 relative">
          <motion.div
            className="flex flex-col items-center gap-4 sm:gap-6"
            animate={isHovered ? { y: -10 } : { y: 0 }}
          >
            <motion.div 
              className="relative w-24 h-24 sm:w-32 sm:h-32"
              animate={isHovered ? { scale: 1.1, y: 5 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-gray-600 rounded-xl"
                animate={isHovered ? { 
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-1 bg-white rounded-xl overflow-hidden"
                style={{ zIndex: 1 }}
              >
                <Image
                  src={member.imageUrl || '/placeholder.svg'}
                  alt={member.title}
                  layout="fill"
                  objectFit="cover"
                  className="transform transition-all duration-300"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                />
              </motion.div>
            </motion.div>

            <div className="text-center relative">
              <motion.h3
                className="text-lg sm:text-xl font-bold"
                animate={isHovered ? { y: -5 } : { y: 0 }}
              >
                <span className="bg-gradient-to-r from-blue-600 to-gray-600 bg-clip-text text-transparent">
                  {member.title}
                </span>
              </motion.h3>
              <motion.p
                className="text-xs sm:text-sm text-blue-600 mt-1"
                animate={isHovered ? { y: -5 } : { y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {member.subtitle}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}

const TeamMemberPopup = ({ member, onClose }: { member: TeamMember | null; onClose: () => void }) => {
  if (!member) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center space-y-6">
          <motion.div 
            className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Image
              src={member.imageUrl || '/placeholder.svg'}
              alt={member.title}
              layout="fill"
              objectFit="cover"
            />
          </motion.div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-900">{member.title}</h3>
            <p className="text-xl text-blue-700">{member.subtitle}</p>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
              <LinkedinIcon size={32} />
            </a>
          )}
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
              <GithubIcon size={32} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Team() {
  const [selectedYear, setSelectedYear] = useState(2023)
  const [teamData, setTeamData] = useState<{ currentLeads: TeamMember[], pastLeads: TeamMember[] }>({ currentLeads: [], pastLeads: [] })
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const years = [2023, 2022]

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setTeamData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  const displayedTeam = selectedYear === 2023 ? teamData.currentLeads : teamData.pastLeads

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

        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}

        <div className="container mx-auto px-4 py-6 sm:py-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">
              <span className="bg-gradient-to-r from-blue-500 via-gray-600 to-blue-500 bg-clip-text text-transparent">
                Our Team Timeline
              </span>
            </h1>
          </motion.div>

          <div className="relative mb-16 sm:mb-32">
            <motion.div 
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-gray-200 to-blue-200 top-1/2 transform -translate-y-1/2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ transformOrigin: "left" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-200 via-gray-200 to-blue-200"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </motion.div>
            
            <div className="flex justify-center gap-16 sm:gap-32 items-center relative">
              {years.map((year, index) => (
                <TimelineDot
                  key={year}
                  year={year}
                  isActive={selectedYear === year}
                  onClick={() => setSelectedYear(year)}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
            >
              <AnimatePresence mode="wait">
                {displayedTeam.map((member, index) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    index={index}
                    onClick={() => setSelectedMember(member)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <AnimatePresence>
        {selectedMember && (
          <TeamMemberPopup
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
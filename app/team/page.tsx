"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GithubIcon, LinkedinIcon } from 'lucide-react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import './Timeline.css';

export default function Team() {
  const [current, setCurrent] = useState(true)
  interface TeamMember {
    id: string
    title: string
    role: string
    imageUrl: string
    linkedin?: string
    github?: string
    subtitle: string
  }

  const [currentTeam, setCurrentTeam] = useState<TeamMember[]>([])
  const [pastTeam, setPastTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setCurrentTeam(data.currentLeads)
        setPastTeam(data.pastLeads)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }, [])

  function handlePast() {
    setCurrent(false)
  }

  function handleCurrent() {
    setCurrent(true)
  }

  const displayedTeam = current ? currentTeam : pastTeam

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#f9fcff] to-[#e6f5ff] text-blue-100">
      <NavBar activeSection="" scrollToSection={() => { }} />
      <main className="flex-grow pt-20">
        <div className='container mx-auto px-4 py-8 flex flex-col items-center justify-center gap-8'>
          <motion.h1
            className='text-3xl md:text-5xl lg:text-6xl font-bold text-center py-4 bg-gradient-to-r from-blue-500 to-blue-700 inline-block text-transparent bg-clip-text'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meet Our Team
          </motion.h1>

          <div className="container">
            <div className="row text-center justify-content-center mb-5">
            </div>
            <div className="row">
              <div className="col">
                <div className="timeline-steps aos-init aos-animate" data-aos="fade-up">
                  <div className="timeline-step">
                    <div className="timeline-content" data-toggle="popover" data-trigger="hover" data-placement="top" title="" >
                      <Button className="my-button" variant={current ? "secondary" : "ghost"}
                        onMouseEnter={handleCurrent}>
                        <div className="inner-circle"></div></Button>
                      <p className="h6 mt-3 mb-1 black-text"><strong>2023</strong></p>
                    </div>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-content" data-toggle="popover" data-trigger="hover" data-placement="top" title="" >
                      <Button className="my-button" variant={!current ? "secondary" : "ghost"}
                        onMouseEnter={handlePast}>
                        <div className="inner-circle"></div></Button>
                      <p className="h6 mt-3 mb-1 black-text"><strong>2022</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-blue-300">Loading...</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={current ? 'current' : 'past'}
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {displayedTeam.length > 0 ? (
                  displayedTeam.map((member, index) => (
                    <TeamMemberCard
                      key={member.id}
                      name={member.title}
                      subtitle={member.subtitle}
                      role={member.subtitle}
                      image={member.imageUrl}
                      linkedin={member.linkedin}
                      github={member.github}
                      index={index}
                      isCurrent={current}
                    />
                  ))
                ) : (
                  <div className='col-span-full text-center text-blue-300'>
                    Data not available
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface TeamMemberCardProps {
  name: string
  role: string
  image: string
  linkedin?: string
  github?: string
  index: number
  isCurrent: boolean
  subtitle: string
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, image, linkedin, github, index, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex flex-col items-center"
  >
    <div className="relative w-48 h-48 mb-4">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
      <div className="absolute inset-1 bg-gray-100 rounded-full"></div>
      <div className="absolute inset-2 overflow-hidden rounded-full group">
        <Image
          src={image || '/placeholder.svg'}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent  opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
          <div className="w-full bg-blue-600 bg-opacity-90 py-2 px-1 flex items-center justify-center h-16 overflow-hidden">
            <p className="text-white font-semibold leading-tight text-center text-xs break-words whitespace-normal overflow-hidden">
              {subtitle}
            </p>
          </div>
        </div>



      </div>
    </div>
    <Card className="bg-gray-50 w-full p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-blue-900 truncate">{name}</h3>
      <p className="text-sm text-black mb-2 truncate">{subtitle}</p>
      <div className="flex justify-center space-x-2">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
            <LinkedinIcon size={20} />
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
            <GithubIcon size={20} />
          </a>
        )}
      </div>
    </Card>
  </motion.div>
);

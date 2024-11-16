"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { GithubIcon, LinkedinIcon, Sparkles } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

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
);

const TimelineDot = ({ year, isActive, onClick, delay }: { 
  year: number, 
  isActive: boolean, 
  onClick: () => void,
  delay: number 
}) => (
  <div className="relative flex flex-col items-center">
    <motion.div
      className="relative cursor-pointer mb-8"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5,
        delay: delay + 0.8,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <motion.div
        className="absolute -inset-4 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100"
        initial={false}
        animate={isActive ? { scale: 1.2, opacity: 0.2 } : { scale: 1, opacity: 0 }}
      />
      <motion.div
        className={`relative w-8 h-8 rounded-full flex items-center justify-center
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
          className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`}
          style={{ opacity: isActive ? 1 : 0.5 }}
        />
      </motion.div>
    </motion.div>
    
    <motion.div
      className="absolute top-full text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 1, duration: 0.5 }}
    >
      <span className={`font-bold ${isActive ? 'text-blue-600' : 'text-blue-400'}`}>
        {year}
      </span>
    </motion.div>
  </div>
);

interface TeamMember {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  linkedin?: string;
  github?: string;
}

const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Card className="relative bg-white/80 backdrop-blur-md overflow-hidden border-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-gray-600/10 to-blue-500/10"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        <div className="p-6 relative">
          <motion.div
            className="flex flex-col items-center gap-6"
            animate={isHovered ? { y: -10 } : { y: 0 }}
          >
            <motion.div 
              className="relative w-32 h-32"
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
                className="text-xl font-bold"
                animate={isHovered ? { y: -5 } : { y: 0 }}
              >
                <span className="bg-gradient-to-r from-blue-600 to-gray-600 bg-clip-text text-transparent">
                  {member.title}
                </span>
              </motion.h3>
              <motion.p
                className="text-sm text-blue-600 mt-1"
                animate={isHovered ? { y: -5 } : { y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {member.subtitle}
              </motion.p>

              <motion.div 
                className="flex justify-center gap-4 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.2 }}
              >
                {member.linkedin && (
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 rounded-lg text-blue-500 hover:text-gray-600 transition-colors"
                  >
                    <LinkedinIcon size={20} />
                  </motion.a>
                )}
                {member.github && (
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 rounded-lg text-blue-500 hover:text-gray-600 transition-colors"
                  >
                    <GithubIcon size={20} />
                  </motion.a>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function Team() {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [teamData, setTeamData] = useState<{ currentLeads: TeamMember[], pastLeads: TeamMember[] }>({ currentLeads: [], pastLeads: [] });
  const [loading, setLoading] = useState(true);

  const years = [2023, 2022];

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setTeamData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  const displayedTeam = selectedYear === 2023 ? teamData.currentLeads : teamData.pastLeads;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#f9fcff] to-[#e6f5ff]">
      <NavBar activeSection="" scrollToSection={() => {}} />
      
      <main className="flex-grow pt-20 relative overflow-hidden">
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

        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">
              <span className="bg-gradient-to-r from-blue-500 via-gray-600 to-blue-500 bg-clip-text text-transparent">
                Our Team Timeline
              </span>
            </h1>
          </motion.div>

          <div className="relative mb-32">
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
            
            <div className="flex justify-center gap-32 items-center relative">
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
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              <AnimatePresence mode="wait">
                {displayedTeam.map((member, index) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
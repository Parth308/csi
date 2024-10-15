import { useEffect } from 'react'
import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'

export default function CoolEventsSection() {
  const controls = useAnimation()

  useEffect(() => {
    controls.start(i => ({
      rotate: [0, 360],
      transition: { repeat: Infinity, duration: 20, delay: i * 0.2 },
    }))
  }, [controls])

  return (
    <section className="py-20 bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-300">Cool Random Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <motion.div
            className="absolute inset-0 z-0"
            animate={controls}
            custom={0}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 opacity-10 rounded-full" />
          </motion.div>
          <motion.div
            className="absolute inset-0 z-0"
            animate={controls}
            custom={1}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-700 to-blue-900 opacity-10 rounded-full" />
          </motion.div>
          <CoolEventCard
            title="Midnight Coding Marathon"
            description="Our annual 12-hour coding spree fueled by pizza and energy drinks. Last year's winner created a fully functional AI chatbot!"
            image="/placeholder.svg"
          />
          <CoolEventCard
            title="Tech Treasure Hunt"
            description="A campus-wide scavenger hunt using AR technology. Participants solved coding puzzles to unlock clues and navigate to the next location."
            image="/placeholder.svg"
          />
          <CoolEventCard
            title="Retro Gaming Night"
            description="We transformed our lab into an 80s arcade, complete with classic consoles and a game development challenge using vintage hardware."
            image="/placeholder.svg"
          />
          <CoolEventCard
            title="AI vs. Human Chess Tournament"
            description="Our student-developed AI went head-to-head with chess champions. The nail-biting final match ended in a surprising draw!"
            image="/placeholder.svg"
          />
        </div>
      </div>
    </section>
  )
}

interface CoolEventCardProps {
  title: string;
  description: string;
  image: string;
}

const CoolEventCard = ({ title, description, image }: CoolEventCardProps) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gray-900 rounded-lg shadow-xl overflow-hidden z-10"
  >
    <Image src={image} alt={title} width={600} height={400} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-blue-300">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  </motion.div>
)
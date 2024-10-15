import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function EventsSection() {
  return (
    <section id="events" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-300">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EventCard
            title="AI Workshop"
            date="June 15, 2023"
            description="Learn about the latest advancements in Artificial Intelligence."
          />
          <EventCard
            title="Hackathon 2023"
            date="July 1-2, 2023"
            description="48-hour coding challenge to solve real-world problems."
          />
          <EventCard
            title="Tech Talk: Quantum Computing"
            date="August 10, 2023"
            description="Explore the future of computing with industry experts."
          />
        </div>
      </div>
    </section>
  )
}

interface EventCardProps {
  title: string;
  date: string;
  description: string;
}

const EventCard = ({ title, date, description }: EventCardProps) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gray-800 p-6 rounded-lg shadow-xl"
  >
    <h3 className="text-xl font-semibold mb-2 text-blue-300">{title}</h3>
    <p className="text-blue-400 mb-4">{date}</p>
    <p className="text-blue-100">{description}</p>
    <Button variant="outline" className="mt-4 text-blue-300 border-blue-300 hover:bg-blue-300 hover:text-gray-900">Learn More</Button>
  </motion.div>
)
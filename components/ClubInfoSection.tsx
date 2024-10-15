import { motion } from 'framer-motion'
import { UsersIcon, CalendarIcon, GlobeIcon, BookOpenIcon } from 'lucide-react'

export default function ClubInfoSection() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-300">Club Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <InfoCard
            icon={<UsersIcon className="w-12 h-12 text-blue-400" />}
            title="200+ Members"
            description="A thriving community of tech enthusiasts"
          />
          <InfoCard
            icon={<CalendarIcon className="w-12 h-12 text-blue-400" />}
            title="50+ Events/Year"
            description="Regular workshops, seminars, and competitions"
          />
          <InfoCard
            icon={<GlobeIcon className="w-12 h-12 text-blue-400" />}
            title="Global Network"
            description="Connected to CSI chapters worldwide"
          />
          <InfoCard
            icon={<BookOpenIcon className="w-12 h-12 text-blue-400" />}
            title="Learning Resources"
            description="Access to exclusive tech content and tutorials"
          />
        </div>
      </div>
    </section>
  )
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InfoCard = ({ icon, title, description }: InfoCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-900 p-6 rounded-lg shadow-xl text-center"
  >
    <div className="flex flex-col items-center">
      {icon}
      <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-300">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  </motion.div>
)
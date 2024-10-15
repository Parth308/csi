import Image from 'next/image'
import { motion } from 'framer-motion'

export default function FacultySection() {
  return (
    <section id="faculty" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-300">Our Esteemed Faculty</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FacultyCard
            name="Dr. Jane Smith"
            position="Faculty Advisor"
            image="/placeholder.svg"
            description="Expert in Artificial Intelligence and Machine Learning"
          />
          <FacultyCard
            name="Prof. John Doe"
            position="Technical Mentor"
            image="/placeholder.svg"
            description="Specializes in Cybersecurity and Network Systems"
          />
          <FacultyCard
            name="Dr. Emily Brown"
            position="Research Coordinator"
            image="/placeholder.svg"
            description="Focuses on Data Science and Big Data Analytics"
          />
        </div>
      </div>
    </section>
  )
}

interface FacultyCardProps {
  name: string;
  position: string;
  image: string;
  description: string;
}

const FacultyCard = ({ name, position, image, description }: FacultyCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 p-6 rounded-lg shadow-xl text-center"
  >
    <Image src={image} alt={name} width={150} height={150} className="mx-auto rounded-full mb-4" />
    <h3 className="text-xl font-semibold text-blue-300">{name}</h3>
    <p className="text-blue-400 mb-2">{position}</p>
    <p className="text-blue-100">{description}</p>
  </motion.div>
)
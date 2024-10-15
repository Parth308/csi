import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section id="home" className="pt-32 pb-32 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image src="/csi_logo.png" alt="CSI Logo Large" width={200} height={200} className="mx-auto mb-8 bg-white rounded-full" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Computer Society of India
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-200">Empowering the Future of Technology</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Explore Our World
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
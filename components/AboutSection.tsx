import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-300">About CSI</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <p className="text-lg leading-relaxed text-blue-100">
              The Computer Society of India (CSI), founded on March 6, 1965, is a non-profit professional meet to exchange views and information to learn and share ideas. The wide spectrum of members is committed to the advancement of theory and practice of Computer Engineering and Technology Systems, Science and Engineering, Information Processing and related Arts and Sciences.
            </p>
          </div>
          <div className="md:w-1/3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-64 h-64 mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r rounded-full animate-pulse"></div>
              <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
              <div className="absolute inset-2 overflow-hidden rounded-full">
                <Image
                  src="/csi_logo.png"
                  alt="CSI Logo"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
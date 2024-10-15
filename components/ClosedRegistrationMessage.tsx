
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function ClosedRegistrationMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Event Registration Closed</h2>
        <p className="text-blue-100 mb-6">
          We're sorry, but event registration is currently closed. Please check back later for upcoming events!
        </p>
        <div className="space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Notify Me of Future Events
          </Button>
          <Button variant="outline" className="w-full text-blue-300 border-blue-300 hover:bg-blue-800">
            View Past Events
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
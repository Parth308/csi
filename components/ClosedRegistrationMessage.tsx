'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Calendar, Mail } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'

export default function ClosedRegistrationMessage() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Notify email:', email)
    toast({
      title: "Notification Set",
      description: "We'll notify you when new events are available!",
      duration: 5000,
    })
    setEmail('')
  }

  return (
    <div className="min-h-scree flex flex-col items-center justify-center px-4 pb-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 rounded-full p-3">
            <AlertCircle className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-blue-500 text-center mb-4">Event Registration Closed</h2>
        <p className="text-blue-600 text-center mb-6">
          We are sorry, but event registration is currently closed. Stay tuned for upcoming events!
        </p>
        <form onSubmit={handleNotifyMe} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300">
            Notify Me of Future Events
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-500 hover:text-blue-600 inline-flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            View Past Events
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
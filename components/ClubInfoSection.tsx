import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Globe, BookOpen } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.4
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const stats = [
  { icon: Users, label: "Members", value: "200+", description: "A thriving community of tech enthusiasts" },
  { icon: Calendar, label: "Events/Year", value: "30+", description: "Regular workshops, seminars, and competitions" },
  { icon: Globe, label: "Network", value: "National", description: "Connected to CSI chapters worldwide" },
  { icon: BookOpen, label: "Resources", value: "100+", description: "Access to exclusive tech content and tutorials" }
];

export default function ClubInfoSection() {
  return (
    <section className="pt-24 pb-40 bg-gradient-to-b from-[#f0f9ff] to-white dark:from-blue-950 dark:to-blue-900 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="absolute top-20 -left-20 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.div 
        className="container mx-auto px-4 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div 
          className="text-center mb-24"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Club Information
          </motion.h2>
          <motion.div 
            className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-blue-900/50 p-8 rounded-2xl border border-blue-50 dark:border-blue-800 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="mb-4"
                >
                  <stat.icon className="w-12 h-12 text-blue-500 dark:text-blue-300" />
                </motion.div>
                <motion.div 
                  className="font-bold text-3xl text-blue-600 dark:text-blue-300 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                  {stat.label}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
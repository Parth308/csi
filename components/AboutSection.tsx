import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Globe, Calendar } from 'lucide-react';

export default function AboutSection() {
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
    { icon: Users, label: "Members", value: "100+" },
    { icon: Calendar, label: "Events", value: "30+" },
    { icon: Globe, label: "Teams", value: "7+" }
  ];

  return (
    <>
      <div className="relative h-32 bg-white">
        <svg
          className="absolute bottom-0 w-full h-32"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 74L1440 74L1440 0C1440 0 1082.5 74 720 74C357.5 74 0 0 0 0L0 74Z"
            className="fill-[#f0f9ff] dark:fill-blue-950"
          />
        </svg>
      </div>

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
          <motion.div 
            className="absolute top-40 right-1/4 w-64 h-64 bg-blue-200 dark:bg-blue-700 rounded-full blur-2xl opacity-20"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.28, 0.2]
            }}
            transition={{ 
              duration: 7,
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
              About CSI
            </motion.h2>
            <motion.div 
              className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div variants={itemVariants}>
              <motion.div 
                className="bg-white dark:bg-blue-900/50 rounded-3xl p-10 shadow-xl border border-blue-100 dark:border-blue-700 backdrop-blur-sm"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-200 mb-8">
                  The Computer Society of India (CSI), founded on March 6, 1965, stands 
                  as a premier organization dedicated to the advancement of computer 
                  engineering and technology. Our platform serves as a dynamic space 
                  for professionals and enthusiasts to exchange innovative ideas, 
                  fostering growth in Computer Engineering, Technology Systems, 
                  Science and Engineering, and Information Processing.
                </p>
                <motion.a
                  href="#learn-more"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 font-medium hover:gap-3 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  Learn more about our mission <ArrowRight size={20} />
                </motion.a>
              </motion.div>
              <div className="grid grid-cols-3 gap-6 mt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-blue-900/50 p-6 rounded-2xl border border-blue-50 dark:border-blue-800 text-center"
                    whileHover={{ y: -5 }}
                  >
                    <stat.icon className="w-8 h-8 mb-3 mx-auto text-blue-500 dark:text-blue-300" />
                    <motion.div 
                      className="font-bold text-2xl text-blue-600 dark:text-blue-300"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", delay: index * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative w-96 h-96"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3))",
                    padding: "3px"
                  }}
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full"
                  style={{
                    background: "linear-gradient(-45deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.2))",
                    padding: "3px"
                  }}
                />
                <motion.div 
                  className="absolute inset-2 bg-white dark:bg-blue-900 rounded-full shadow-2xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                  viewport={{ once: true }}
                />
                <motion.div 
                  className="absolute inset-8 overflow-hidden rounded-full bg-white dark:bg-blue-900"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src="/csi_logo.png"
                    alt="CSI Logo"
                    fill
                    className="object-contain p-6 dark:filter dark:brightness-150"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
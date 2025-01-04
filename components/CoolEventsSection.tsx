import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

const events = [
   {
    title: "Android Development Workshop",
    description: "The participants learned how to build mobile applications through hands-on demonstrations and competitive tasks.",
    image: "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998260/Evnt4_gfhqcw.png",
    tags: ["Development","Programming","Workshop"]
  },
  {
    title: "Tech Treasure Hunt",
    description: "A campus-wide scavenger hunt using AR technology. Participants solved coding puzzles to unlock clues and navigate to the next location.",
    image: "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998144/Evnt2_obvcnv.png",
    tags: ["AR", "Puzzle", "Adventure"]
  },
  {
    title: "Midnight Coding Marathon",
    description: "Our annual 12-hour coding spree fueled by pizza and energy drinks. Last year's winner created a fully functional AI chatbot!",
    image: "https://res.cloudinary.com/dcajrxpot/image/upload/v1735997837/Evnt1_pypt7q.png",
    tags: ["Coding", "Competition", "Fun"]
  },
  {
    title: "Retro Gaming Night",
    description: "We transformed our lab into an 80s arcade, complete with classic consoles and a game development challenge using vintage hardware.",
    image: "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998233/Evnt3_ms3uab.png",
    tags: ["Gaming", "Retro", "Development"]
  },
  {
    title: "AI vs. Human Chess Tournament",
    description: "Our student-developed AI went head-to-head with chess champions. The nail-biting final match ended in a surprising draw!",
    image: " https://res.cloudinary.com/dcajrxpot/image/upload/v1735999368/Evnt6_waf1fp.png",
    tags: ["AI", "Chess", "Competition"]
  }

];

interface EventCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  index: number;
}

const EventCard = ({ title, description, image, tags}: EventCardProps) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-blue-900/50 rounded-2xl border border-blue-50 dark:border-blue-800 overflow-hidden backdrop-blur-sm"
  >
    <div className="relative h-48">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-300 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default function CoolEventsSection() {
  return (
    <section className="pt-24 pb-40 bg-gradient-to-b from-white to-[#f0f9ff] dark:from-blue-900 dark:to-blue-950 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="absolute top-40 -right-20 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl opacity-20"
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
          className="absolute bottom-40 -left-20 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full blur-3xl opacity-20"
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
            Cool Random Events
          </motion.h2>
          <motion.div 
            className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <EventCard
              key={event.title}
              {...event}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
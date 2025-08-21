// import React from 'react';
// import { motion } from 'framer-motion';
// import { Calendar, Clock, MapPin, ArrowRight, Users } from 'lucide-react';

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 1,
//       staggerChildren: 0.4
//     }
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 50 },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     transition: {
//       type: "spring",
//       stiffness: 100,
//       damping: 15
//     }
//   }
// };

// const events = [
//   {
//     title: "AI Workshop",
//     date: "June 15, 2024",
//     time: "2:00 PM - 5:00 PM",
//     location: "Main Auditorium",
//     description: "Learn about the latest advancements in Artificial Intelligence with hands-on demonstrations and expert insights.",
//     category: "Workshop",
//     capacity: "150 seats",
//     registrationDeadline: "June 10, 2024"
//   },
//   {
//     title: "Hackathon 2024",
//     date: "July 1-2, 2024",
//     time: "48 Hours",
//     location: "Engineering Block",
//     description: "48-hour coding challenge to solve real-world problems. Amazing prizes and networking opportunities await!",
//     category: "Competition",
//     capacity: "200 teams",
//     registrationDeadline: "June 25, 2024"
//   },
//   {
//     title: "Tech Talk: Quantum Computing",
//     date: "August 10, 2024",
//     time: "3:30 PM - 5:00 PM",
//     location: "Virtual Event",
//     description: "Explore the future of computing with industry experts. Special guest speakers from leading tech companies.",
//     category: "Seminar",
//     capacity: "Unlimited",
//     registrationDeadline: "August 8, 2024"
//   }
// ];

// interface EventCardProps {
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   description: string;
//   category: string;
//   capacity: string;
//   registrationDeadline: string;
//   index: number;
// }

// const EventCard = ({ 
//   title, 
//   date, 
//   time, 
//   location, 
//   description, 
//   category, 
//   capacity,
//   registrationDeadline
// }: EventCardProps) => (
//   <motion.div
//     variants={itemVariants}
//     whileHover={{ y: -5 }}
//     className="bg-white dark:bg-blue-900/50 rounded-2xl border border-blue-50 dark:border-blue-800 overflow-hidden backdrop-blur-sm"
//   >
//     <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-1">
//       <span className="text-white text-sm font-medium px-3 py-1 rounded-full">
//         {category}
//       </span>
//     </div>
    
//     <div className="p-6">
//       <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4">
//         {title}
//       </h3>
      
//       <div className="space-y-3 mb-6">
//         <div className="flex items-center text-gray-600 dark:text-gray-300">
//           <Calendar className="w-5 h-5 mr-3 text-blue-500" />
//           <span>{date}</span>
//         </div>
        
//         <div className="flex items-center text-gray-600 dark:text-gray-300">
//           <Clock className="w-5 h-5 mr-3 text-blue-500" />
//           <span>{time}</span>
//         </div>
        
//         <div className="flex items-center text-gray-600 dark:text-gray-300">
//           <MapPin className="w-5 h-5 mr-3 text-blue-500" />
//           <span>{location}</span>
//         </div>

//         <div className="flex items-center text-gray-600 dark:text-gray-300">
//           <Users className="w-5 h-5 mr-3 text-blue-500" />
//           <span>{capacity}</span>
//         </div>
//       </div>
      
//       <p className="text-gray-600 dark:text-gray-300 mb-6">
//         {description}
//       </p>
      
//       <div className="space-y-4">
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Registration Deadline: {registrationDeadline}
//         </p>
        
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl 
//                      flex items-center justify-center gap-2 transition-transform duration-200
//                      hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//         >
//           Register Now
//           <ArrowRight className="w-5 h-5" />
//         </motion.button>
//       </div>
//     </div>
//   </motion.div>
// );

// export default function UpcomingEventsSection() {
//   return (
//     <section className="pt-24 pb-40 bg-gradient-to-b from-[#f0f9ff] to-white dark:from-blue-950 dark:to-blue-900 relative overflow-hidden">
//       {/* Animated background elements */}
//       <motion.div 
//         className="absolute inset-0"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 1.5 }}
//         viewport={{ once: true }}
//       >
//         <motion.div 
//           className="absolute top-20 -left-20 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl opacity-20"
//           animate={{ 
//             scale: [1, 1.2, 1],
//             opacity: [0.2, 0.3, 0.2]
//           }}
//           transition={{ 
//             duration: 8,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         />
//         <motion.div 
//           className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full blur-3xl opacity-20"
//           animate={{ 
//             scale: [1, 1.1, 1],
//             opacity: [0.2, 0.25, 0.2]
//           }}
//           transition={{ 
//             duration: 6,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         />
//       </motion.div>

//       <motion.div 
//         className="container mx-auto px-4 relative"
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-100px" }}
//       >
//         {/* Section Header */}
//         <motion.div 
//           className="text-center mb-24"
//           variants={itemVariants}
//         >
//           <motion.h2 
//             className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent mb-6"
//             initial={{ opacity: 0, y: -30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//           >
//             Upcoming Events
//           </motion.h2>
//           <motion.div 
//             className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"
//             initial={{ width: 0 }}
//             whileInView={{ width: 128 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             viewport={{ once: true }}
//           />
//         </motion.div>

//         {/* Events Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {events.map((event, index) => (
//             <EventCard
//               key={event.title}
//               {...event}
//               index={index}
//             />
//           ))}
//         </div>
//       </motion.div>
//     </section>
//   );
}
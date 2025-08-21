import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Users, Globe, Book } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function AboutSection() {
  const shouldReduceMotion = useReducedMotion();
  const { ref: sectionRef, inView: isSectionInView } = useInView({
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const stats = [
    { icon: Users, label: "Members", value: "100+" },
    { icon: Book, label: "Chapters", value: "7+" },
    { icon: Globe, label: "States", value: "15+" },
  ];

  return (
    <>
      <div className="relative h-32 bg-white dark:bg-[#04070F]">
        <svg
          className="absolute bottom-0 w-full h-32"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 74L1440 74L1440 0C1440 0 1082.5 74 720 74C357.5 74 0 0 0 0L0 74Z"
            className="fill-[#f0f9ff] dark:fill-[#05050A]"
          />
        </svg>
      </div>

      <section className="pt-24 pb-40 bg-gradient-to-b from-[#f0f9ff] to-white dark:bg-gradient-to-b dark:from-[#05050A] dark:via-[#0B1A2D] dark:to-[#04070F] relative overflow-hidden">
        <motion.div
          className="container mx-auto px-4 relative"
          variants={containerVariants}
          initial="hidden"
          animate={isSectionInView ? "visible" : "hidden"}
          ref={sectionRef}
        >
          <motion.div className="text-center mb-24" variants={itemVariants}>
            <motion.h2
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent mb-6"
              variants={itemVariants}
            >
              About CSI
            </motion.h2>
            <motion.div
              className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"
              variants={itemVariants}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div variants={itemVariants}>
              <motion.div
                className="bg-white dark:bg-gradient-to-b dark:from-[#05050A] dark:via-[#0B1A2D] dark:to-[#04070F] rounded-3xl p-10 shadow-xl border border-blue-100 dark:border-blue-900 backdrop-blur-sm"
                variants={itemVariants}
              >
                <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-200 mb-8">
                  The Computer Society of India (CSI), founded on March 6, 1965,
                  stands as a premier organization dedicated to the advancement
                  of computer engineering and technology. Our platform serves as
                  a dynamic space for professionals and enthusiasts to exchange
                  innovative ideas, fostering growth in Computer Engineering,
                  Technology Systems, Science and Engineering, and Information
                  Processing.
                </p>
                <motion.a
                  href="#learn-more"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 font-medium hover:gap-3 transition-all"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                >
                  Learn more about our mission <ArrowRight size={20} />
                </motion.a>
              </motion.div>
              <div className="grid grid-cols-3 gap-6 mt-8">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="bg-white dark:bg-[#0B1A2D]/50 p-6 rounded-2xl border border-blue-50 dark:border-[#0B1A2D] text-center"
                    whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                  >
                    <stat.icon className="w-8 h-8 mb-3 mx-auto text-blue-500 dark:text-blue-300" />
                    <div className="font-bold text-2xl text-blue-600 dark:text-blue-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-end"
            >
              <motion.div
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                className="relative w-96 h-96"
              >
                <motion.div
                  className="absolute inset-2 bg-white dark:bg-gradient-to-b dark:from-[#05050A] dark:via-[#0B1A2D] dark:to-[#04070F] rounded-full shadow-2xl"
                  variants={itemVariants}
                />
                <motion.div
                  className="absolute inset-8 overflow-hidden rounded-full bg-white dark:bg-gradient-to-b dark:from-[#05050A] dark:via-[#0B1A2D] dark:to-[#04070F]"
                  variants={itemVariants}
                >
                  <Image
                    src="/csi_logo.png"
                    alt="CSI Logo"
                    fill
                    className="object-contain p-6 dark:filter dark:brightness-150"
                    priority
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

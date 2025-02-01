"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50/50 via-white to-white">
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-sky-100 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-100 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto mb-12 w-48 h-48 md:w-56 md:h-56"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-200 via-sky-100 to-white animate-pulse" />
            <Image
              src="/csi_logo.png"
              alt="CSI Logo Large"
              width={240}
              height={240}
              className="relative rounded-full shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500 leading-tight"
          >
            Computer Society
            <br />
            of India
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl mb-12 text-sky-600/80 font-medium"
          >
            Empowering the Future of Technology
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <button className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
              Explore Our World
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

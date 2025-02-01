import Image from "next/image";
import { motion } from "framer-motion";

export default function FacultySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 12 },
    },
  };

  return (
    <section id="faculty" className="relative">
      <div className="absolute top-0 left-0 w-full overflow-hidden -mt-1">
        <svg
          className="relative w-full h-32"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L1440 0L1440 74C1440 74 1082.5 0 720 0C357.5 0 0 74 0 74L0 0Z"
            className="fill-white dark:fill-blue-900"
          />
        </svg>
      </div>

      <div className="pt-24 pb-40 bg-gradient-to-b from-white to-[#f0f9ff] dark:from-blue-900 dark:to-blue-950 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute top-20 -left-20 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl opacity-10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full blur-3xl opacity-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          className="container mx-auto px-4 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-24" variants={itemVariants}>
            <motion.h2
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Esteemed Faculty
            </motion.h2>
            <motion.div
              className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            />
          </motion.div>

          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center mx-auto">
              <motion.div className="md:col-start-2" variants={itemVariants}>
                <FacultyCard
                  name="Jitender Singh"
                  position="Associate Professor"
                  image="/jitendersir.png"
                  description="Jitender Singh is an Associate Professor at the Department of Computer Science and Engineering, SRM Institute of Science and Technology, Delhi-NCR Campus. He has a Master's degree in Computer Science and Engineering and has been teaching for over 10 years. He is passionate about teaching and research in the field of Computer Science."
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface FacultyCardProps {
  name: string;
  position: string;
  image: string;
  description: string;
}

const FacultyCard = ({
  name,
  position,
  image,
  description,
}: FacultyCardProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
    className="bg-white dark:bg-blue-900/50 p-8 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-700 backdrop-blur-sm"
  >
    <div className="relative w-32 h-32 mx-auto mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-lg opacity-30" />
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={25560}
          height={25560}
          className="rounded-full border-4 border-white dark:border-blue-700"
        />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-2">
      {name}
    </h3>
    <p className="text-lg font-medium text-blue-500 dark:text-blue-400 mb-4">
      {position}
    </p>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

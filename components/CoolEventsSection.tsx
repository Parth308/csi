import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Calendar, MapPin, Clock, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const fadeInVariant = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const backgroundVariants = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.2, 0.3, 0.2],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const events = [
  {
    title: "Android Development Workshop",
    description:
      "The participants learned how to build mobile applications through hands-on demonstrations and competitive tasks.",
    images: [
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998260/Evnt4_gfhqcw.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735997837/Evnt1_pypt7q.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998144/Evnt2_obvcnv.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998233/Evnt3_ms3uab.png",
    ],
    tags: ["Development", "Programming", "Workshop"],
  },
  {
    title: "Tech Treasure Hunt",
    description:
      "A campus-wide scavenger hunt using AR technology. Participants solved coding puzzles to unlock clues and navigate to the next location.",
    images: [
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735997837/Evnt1_pypt7q.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998260/Evnt4_gfhqcw.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998144/Evnt2_obvcnv.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998233/Evnt3_ms3uab.png",
    ],
    tags: ["AR", "Puzzle", "Adventure"],
  },
  {
    title: "Midnight Coding Marathon",
    description:
      "Our annual 12-hour coding spree is an electrifying marathon fueled by endless pizza slices, energy drinks, and unstoppable creativity. It's a thrilling blend of innovation and adrenaline, where developers, designers, and tech enthusiasts push their limits to build groundbreaking projects within the tight time frame. Last year's event was a showstopper, with the winning team crafting a fully functional AI chatbot — a seamless blend of intelligence and interaction that left everyone in awe. This year promises even fiercer competition, bolder ideas, and unforgettable moments. Let the countdown begin!",
    images: [
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998144/Evnt2_obvcnv.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998260/Evnt4_gfhqcw.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735997837/Evnt1_pypt7q.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998233/Evnt3_ms3uab.png",
    ],
    tags: ["Coding", "Competition", "Fun"],
  },
  {
    title: "Retro Gaming Night",
    description:
      "We transformed our lab into an 80s arcade, complete with classic consoles and a game development challenge using vintage hardware.",
    images: [
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998233/Evnt3_ms3uab.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998260/Evnt4_gfhqcw.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735997837/Evnt1_pypt7q.png",
      "https://res.cloudinary.com/dcajrxpot/image/upload/v1735998144/Evnt2_obvcnv.png",
    ],
    tags: ["Gaming", "Retro", "Development"],
  },
];

interface EventImage {
  src: string;
  alt: string;
}

interface EventDetailsCardProps {
  title: string;
  description: string;
  date?: string;
  location?: string;
  time?: string;
  images?: string[];
  tags?: string[];
  setEventDetails: (show: boolean) => void;
}

interface EventCardProps {
  title: string;
  description: string;
  images: string[];
  index: number;
  tags: string[];
  setEventDetails: (details: boolean) => void;
  setEventIndex: (index: number) => void;
}

const handleClick = (setEventDetails: (details: boolean) => void, setEventIndex: (index: number) => void, index: number) => {
  setEventDetails(true);
  setEventIndex(index);
};

const EventCard = ({
  title,
  description,
  images = [],
  index,
  tags,
  setEventDetails,
  setEventIndex,
}: EventCardProps) => (
  <motion.div
    onClick={() => handleClick(setEventDetails, setEventIndex, index)}
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="cursor-pointer bg-white dark:bg-blue-900/50 rounded-2xl border border-blue-50 dark:border-blue-800 overflow-hidden backdrop-blur-sm"
  >
    <div className="relative h-48">
      <Image
        src={images[0]}
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
      <div className="relative max-h-20 overflow-hidden mb-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {description}
        </p>
        <div className="absolute bottom-0 left-0 w-full h-5 bg-gradient-to-t from-white dark:from-blue-900/50 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string) => (
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

const EventDetailsCard: React.FC<EventDetailsCardProps> = ({
  title,
  description,
  date,
  location,
  time,
  images = [],
  tags = [],
  setEventDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize images to always have the same structure
  const normalizedImages = images.map((img, index) => {
    return {
      src: img,
      alt: `Event image ${index + 1}`,
    };
  });

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEventDetails(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setEventDetails]);

  return (
    <AnimatePresence>
      <motion.div
        onClick={() => setEventDetails(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-6xl max-h-[90vh] flex flex-col relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.4,
          }}
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white dark:bg-slate-800 z-10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={() => setEventDetails(false)}
            className="absolute top-4 right-4 z-20 p-1 rounded-full bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors duration-200 shadow-md"
            aria-label="Close details"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Image Section - Takes 40% on desktop */}
            <div className="w-full md:w-[40%] relative">
              {normalizedImages.length > 1 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, EffectFade]}
                  navigation={{
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next",
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  effect="fade"
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  onSlideChange={(swiper) =>
                    setCurrentImageIndex(swiper.realIndex)
                  }
                  className="w-full h-64 md:h-full"
                >
                  {normalizedImages.map((img, index) => (
                    <SwiperSlide
                      key={index}
                      className="bg-slate-100 dark:bg-slate-900"
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-black/50 md:to-transparent pointer-events-none"></div>
                      </div>
                    </SwiperSlide>
                  ))}

                  {/* Custom navigation buttons */}
                  <div className="swiper-button-prev !text-white !w-10 !h-10 !rounded-full !bg-black/30 hover:!bg-black/50 transition-colors after:!text-lg"></div>
                  <div className="swiper-button-next !text-white !w-10 !h-10 !rounded-full !bg-black/30 hover:!bg-black/50 transition-colors after:!text-lg"></div>
                </Swiper>
              ) : normalizedImages.length === 1 ? (
                <div className="relative w-full h-64 md:h-full bg-slate-100 dark:bg-slate-900">
                  <img
                    src={normalizedImages[0].src}
                    alt={normalizedImages[0].alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-black/50 md:to-transparent pointer-events-none"></div>
                </div>
              ) : (
                <div className="w-full h-64 md:h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <h3 className="text-white text-xl font-medium">
                    No images available
                  </h3>
                </div>
              )}

              {/* Image counter */}
              {normalizedImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full z-10">
                  {currentImageIndex + 1} / {normalizedImages.length}
                </div>
              )}
            </div>

            {/* Content Section - Takes 60% on desktop */}
            <div className="w-full md:w-3/5 p-6 overflow-y-auto custom-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Title with gradient underline */}
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2 pb-2 relative">
                  {title}
                  <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
                </h2>

                {/* Event metadata */}
                <div className="flex flex-wrap gap-y-2 mb-6 text-sm text-slate-600 dark:text-slate-300">
                  {date && (
                    <div className="flex items-center mr-6">
                      <Calendar size={16} className="mr-1 text-blue-500" />
                      <span>{date}</span>
                    </div>
                  )}

                  {time && (
                    <div className="flex items-center mr-6">
                      <Clock size={16} className="mr-1 text-blue-500" />
                      <span>{time}</span>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-blue-500" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>

                {/* Description with better typography */}
                <div className="prose prose-slate dark:prose-invert prose-sm md:prose-base max-w-none mb-6">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>

                {/* Tags with improved styling */}
                {tags.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Tag size={16} className="mr-2 text-blue-500" />
                      <span>Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800/50"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                    Share Event
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function CoolEventsSection() {
  const [eventDetails, setEventDetails] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  
  return (
    <section className="pt-24 pb-40 bg-gradient-to-b from-white to-[#f0f9ff] dark:from-blue-900 dark:to-blue-950 relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute top-40 -right-20 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl opacity-20"
          variants={backgroundVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-40 -left-20 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full blur-3xl opacity-20"
          variants={backgroundVariants}
          animate="animate"
        />
      </motion.div>

      <motion.div
        className="container mx-auto px-4 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="text-center mb-24" variants={itemVariants}>
          <motion.h2
            className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent mb-6"
            variants={fadeInVariant}
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
              setEventDetails={setEventDetails}
              setEventIndex={setEventIndex}
            />
          ))}
          {eventDetails && (
            <EventDetailsCard
              {...events[eventIndex]}
              setEventDetails={setEventDetails}
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
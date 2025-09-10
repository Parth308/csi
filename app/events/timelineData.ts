// Define proper TypeScript interfaces
interface VideoData {
  url: string;
  title: string;
}

interface TimelineItem {
  year: string;
  title: string;
  date: string;
  description: string;
  content: string;
  images: string[];
  video: VideoData | null; // Changed from empty string to null
}

export const timelineData: TimelineItem[] = [
  {
    year: "2024",
    title: "Codeclash 3.0",
    date: "February 1, 2024",
    description:
      "An intense coding competition challenging participants to solve complex algorithmic problems within a limited timeframe.",
    content:
      "Codeclash 3.0 brought together the brightest programming minds on campus for a battle of logic and efficiency. Participants tackled a series of increasingly difficult coding challenges, testing their problem-solving abilities and coding speed. The event featured multiple rounds, with each round eliminating participants until only the coding elite remained.",
    images: [
     
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806847/DSC_0298_zj0l1k.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527071/IMG_1398_xnzbqg.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527069/IMG_1445_eu7sgp.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527069/IMG_1408_zw2sxu.jpg",

    ],
    video: null, // Changed from empty string to null
  },
  {
    year: "2024",
    title: "WebMinds",
    date: "February 4, 2024",
    description:
      "A collaborative web development hackathon focused on creating innovative solutions for real-world problems.",
    content:
      "WebMinds provided a platform for aspiring web developers to showcase their creativity and technical skills. Teams worked together to design and implement web applications addressing various challenges. The event emphasized modern frameworks, responsive design, and user experience. Mentors were available throughout to guide participants and provide feedback on their projects.",
    images: [
     
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527076/IMG_1443_qm6zhi.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806841/DSC_0309_faidwg.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806838/DSC_0351_q94o9l.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527077/IMG_1403_up221q.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806837/DSC_0310_qwoffn.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527075/IMG_1407_qvy2ld.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806835/DSC_0323_gtcb5y.jpg",
    ],
    video: null,
  },
  {
    year: "2024",
    title: "Code Clash 4.0",
    date: "August 14, 2024",
    description:
      "The return of our flagship competitive programming event with new challenges and higher stakes.",
    content:
      "Building on the success of Code Clash 3.0, this iteration brought even more challenging problems and introduced new competitive formats. Participants competed in both individual and team categories, with special rounds focusing on specific domains like machine learning algorithms and optimization problems. Industry experts served as judges, offering valuable feedback and insights to participants.",
    images: [
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806852/DSC_0141_vmpkxu.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806850/DSC_0175_eplfnx.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527076/IMG_1401_ee6qxy.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806849/DSC_0179_g6zprv.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806848/DSC_0246_hst4hd.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806847/DSC_0243_euwzkx.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527080/IMG_1434_hvpk43.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806847/DSC_0298_zj0l1k.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524867/IMG_6099_vzhqki.heic",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524869/IMG_1324_cacn2h.jpg",
    ],
    video: null,
  },
  {
    year: "2024",
    title: "Err Hunt 2.0",
    date: "August 19, 2024",
    description:
      "A debugging competition where participants race to identify and fix errors in provided code snippets.",
    content:
      "Err Hunt 2.0 tested participants' debugging skills across various programming languages and scenarios. From simple syntax errors to complex logical bugs, contestants navigated through increasingly difficult challenges. The event highlighted the importance of systematic debugging approaches and attention to detail in software development. Special prizes were awarded for the most elegant fixes and fastest bug hunters.",
    images: [
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806852/DSC_0141_vmpkxu.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806850/DSC_0175_eplfnx.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527084/IMG_1399_ljkamh.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806847/DSC_0298_zj0l1k.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806838/DSC_0351_q94o9l.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757527077/IMG_1403_up221q.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806837/DSC_0310_qwoffn.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806841/DSC_0309_faidwg.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806835/DSC_0323_gtcb5y.jpg",
    ],
    video: null,
  },
  {
    year: "2024",
    title: "Android Dev Workshop",
    date: "September 9, 2024",
    description:
      "Hands-on workshop introducing students to Android app development fundamentals and best practices.",
    content:
      "This comprehensive workshop walked participants through the entire Android development lifecycle. Starting from basic UI design to implementing complex functionalities, students gained practical experience in building Android applications. The workshop covered important concepts including Activities, Fragments, Material Design, and data persistence. By the end, each participant had created their own functioning Android application.",
    images: [
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806850/DSC_0175_eplfnx.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806842/DSC_0305_xupwh7.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806837/DSC_0310_qwoffn.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806838/DSC_0351_q94o9l.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806841/DSC_0309_faidwg.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806835/DSC_0323_gtcb5y.jpg",
    ],
    video: null,
  },
  {
    year: "2024",
    title: "DevAlchemy",
    date: "September 11, 2024",
    description:
      "A transformative event turning programming concepts into practical solutions through guided project development.",
    content:
      "DevAlchemy focused on bridging the gap between theoretical knowledge and practical application in software development. Participants worked on real-world projects under the guidance of industry professionals. The event emphasized software architecture, clean coding practices, and collaborative development. Teams presented their final projects to a panel of judges, with the best solutions receiving recognition and prizes.",
    images: [
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806852/DSC_0141_vmpkxu.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806841/DSC_0309_faidwg.jpg",
    "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524867/IMG_6099_vzhqki.heic",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524869/IMG_1324_cacn2h.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806835/DSC_0323_gtcb5y.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806838/DSC_0351_q94o9l.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806835/DSC_0330_bfgpoq.jpg",
    ],
    video: null,
  },
  {
    year: "2025",
    title: "Technation",
    date: "February 22, 2025",
    description:
      "A national-level technical symposium bringing together students from across the country.",
    content:
      "Technation 2025 served as a platform for technical exchange and innovation, featuring competitions, workshops, and expert talks. The event attracted participants from universities nationwide, fostering inter-collegiate collaboration and healthy competition. Notable industry speakers shared insights on emerging technologies and career opportunities. Various technical and non-technical events throughout the day catered to diverse interests and skill levels.",
    images: [
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524869/IMG_6100_qnrdms.heic",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524870/IMG_1281_1_wrc7g0.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524867/IMG_6099_vzhqki.heic",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524869/IMG_1324_cacn2h.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524869/IMG_1297_adfyhh.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524867/IMG_1321_hgwzsh.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757524866/IMG_6103_lcqkbi.heic",
    ],
    video: null,
  },
  {
    year: "2025",
    title: "Techstasy",
    date: "April 19, 2025",
    description:
      "The flagship annual techno-cultural fest celebrating innovation and creativity in technology.",
    content:
      "Techstasy 2025 marked the culmination of the academic year's technical activities with a grand celebration of technology and innovation. The event featured cutting-edge project exhibitions, lightning talks by student innovators, and interactive installations. Cultural performances intertwined with technical showcases created a unique atmosphere of creativity and technical excellence. The fest concluded with an awards ceremony recognizing outstanding contributions across various technical domains.",
    images: [
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806852/DSC_0141_vmpkxu.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806848/DSC_0246_hst4hd.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806850/DSC_0175_eplfnx.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806849/DSC_0179_g6zprv.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806847/DSC_0298_zj0l1k.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806847/DSC_0243_euwzkx.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806841/DSC_0309_faidwg.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806842/DSC_0305_xupwh7.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806835/DSC_0330_bfgpoq.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806838/DSC_0351_q94o9l.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806835/DSC_0323_gtcb5y.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1755806837/DSC_0310_qwoffn.jpg",
    ],
    video: null,
  },
  {
    year: "2025",
    title: "botverse",
    date: "April 19, 2025",
    description:
      "The flagship annual techno-cultural fest celebrating innovation and creativity in technology.",
    content:
      "Techstasy 2025 marked the culmination of the academic year's technical activities with a grand celebration of technology and innovation. The event featured cutting-edge project exhibitions, lightning talks by student innovators, and interactive installations. Cultural performances intertwined with technical showcases created a unique atmosphere of creativity and technical excellence. The fest concluded with an awards ceremony recognizing outstanding contributions across various technical domains.",
    images: [
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757523988/IMG_1281_ge7zf7.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757523987/IMG_1274_jxa6af.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757523994/IMG_1267_fsri2y.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757523995/IMG_1240_kl56zn.jpg",
      "https://res.cloudinary.com/dnb9rl5gy/image/upload/v1757523998/IMG_1268_yd6xfx.jpg",
    ],
    video: null,
  },
];

export default timelineData;

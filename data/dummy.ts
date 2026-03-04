import type { BlogPost, Course, Event, TeamMember, Testimonial } from "./types";

export const courses: Course[] = [
  {
    id: 1,
    title: "Basic Astronomy – Live Foundation Course",
    slug: "basic-astronomy-foundation",
    shortDescription:
      "Learn the fundamentals of astronomy, planets, stars, and galaxies through live interactive classes.",
    description:
      "A comprehensive introduction to the universe. We cover everything from the solar system to the edges of the visible universe. Perfect for beginners and students.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    instructorId: 1,
    price: 2500,
    isFree: false,
    originalPrice: 3500,
    category: "Astronomy",
    grade: "Class 6-10",
    mode: "Live",
    level: "Beginner",
    language: "Bangla",
    totalLessons: 12,
    duration: "6 weeks",
    syllabus: [
      {
        title: "Our Solar System",
        lessons: 2,
        duration: "3h",
        topics: [
          "Sun & Planets",
          "Moons & Asteroids",
          "Formation of Solar System",
        ],
      },
      {
        title: "Stars & Stellar Evolution",
        lessons: 4,
        duration: "6h",
        topics: ["Life Cycle of Stars", "Supernovae", "Black Holes"],
      },
      {
        title: "Galaxies & Cosmology",
        lessons: 3,
        duration: "4.5h",
        topics: ["Milky Way", "Types of Galaxies", "Big Bang Theory"],
      },
      {
        title: "Observation Techniques",
        lessons: 3,
        duration: "4.5h",
        topics: [
          "Telescopes",
          "Night Sky Navigation",
          "Astrophotography Basics",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Astronomy Olympiad Preparation Program",
    slug: "olympiad-preparation",
    shortDescription:
      "Specialized training for national and international astronomy olympiads (IOAA).",
    description:
      "Rigorous problem-solving and theoretical training designed for students aiming for Gold in the National and International Astronomy and Astrophysics Olympiads.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    instructorId: 3,
    price: 4500,
    isFree: false,
    originalPrice: 6000,
    category: "Olympiad",
    grade: "Class 8-12",
    mode: "Live",
    level: "Advanced",
    language: "Bangla",
    totalLessons: 24,
    duration: "12 weeks",
    syllabus: [
      {
        title: "Celestial Mechanics",
        lessons: 6,
        duration: "9h",
        topics: ["Kepler's Laws", "Orbital Dynamics", "Coordinate Systems"],
      },
      {
        title: "Astrophysics",
        lessons: 8,
        duration: "12h",
        topics: ["Stellar Physics", "Radiative Transfer", "Thermodynamics"],
      },
      {
        title: "Data Analysis",
        lessons: 5,
        duration: "7.5h",
        topics: ["Graphing", "Error Analysis", "Real Data Processing"],
      },
      {
        title: "Observation",
        lessons: 5,
        duration: "7.5h",
        topics: ["Star Charts", "Telescope Handling", "Night Sky Exams"],
      },
    ],
  },
  {
    id: 3,
    title: "Introduction to Astrophysics",
    slug: "intro-to-astrophysics",
    shortDescription:
      "Understand black holes, stellar evolution, and cosmic phenomena.",
    description:
      "Dive deep into the physics of the universe. Understand the mathematical and physical principles governing celestial bodies.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
    instructorId: 2,
    price: 0,
    isFree: true,
    originalPrice: null,
    category: "Astrophysics",
    grade: "University",
    mode: "Recorded",
    level: "Intermediate",
    language: "English",
    totalLessons: 8,
    duration: "4 weeks",
    syllabus: [
      {
        title: "Gravity & Spacetime",
        lessons: 2,
        duration: "2h",
        topics: ["Newtonian Gravity", "General Relativity Intro"],
      },
      {
        title: "High Energy Astrophysics",
        lessons: 3,
        duration: "3h",
        topics: ["Accretion Disks", "Jets", "Gamma Ray Bursts"],
      },
      {
        title: "Cosmology",
        lessons: 3,
        duration: "3h",
        topics: ["Dark Matter", "Dark Energy", "Expansion of Universe"],
      },
    ],
  },

  {
    id: 4,
    title: "Stargazing 101: A Practical Guide",
    slug: "stargazing-101",
    shortDescription:
      "Master the art of navigating the night sky with binoculars and small telescopes.",
    description:
      "A hands-on course for backyard astronomers. Learn how to identify constellations, track planets, and observe deep-sky objects using affordable equipment.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519810755548-39cd217da494?auto=format&fit=crop&q=80&w=800",
    instructorId: 1,
    price: 1500,
    isFree: false,
    originalPrice: 2000,
    category: "Observation",
    grade: "Class 6-10",
    mode: "Recorded",
    level: "Beginner",
    language: "Bangla",
    totalLessons: 10,
    duration: "4 weeks",
    syllabus: [
      {
        title: "Binocular Basics",
        lessons: 2,
        duration: "2h",
        topics: ["Choosing Binoculars", "Moon Observation", "Star Clusters"],
      },
      {
        title: "Telescope Setup",
        lessons: 3,
        duration: "3h",
        topics: ["Refractors vs Reflectors", "Mounts & Tripods", "Collimation"],
      },
    ],
  },
  {
    id: 5,
    title: "Advanced Cosmology & Dark Matter",
    slug: "advanced-cosmology",
    shortDescription:
      "Explore the mysteries of the early universe, dark matter, and dark energy.",
    description:
      "An advanced theoretical course exploring the Lambda-CDM model, cosmic microwave background, and the fate of the universe.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&q=80&w=800",
    instructorId: 2,
    price: 5000,
    isFree: false,
    originalPrice: 6500,
    category: "Cosmology",
    grade: "University",
    mode: "Live",
    level: "Advanced",
    language: "English",
    totalLessons: 16,
    duration: "10 weeks",
    syllabus: [
      {
        title: "The Early Universe",
        lessons: 4,
        duration: "6h",
        topics: ["Inflation", "Nucleosynthesis", "Recombination"],
      },
      {
        title: "Structure Formation",
        lessons: 4,
        duration: "6h",
        topics: [
          "Dark Matter Halos",
          "Galaxy Clusters",
          "Large Scale Structure",
        ],
      },
    ],
  },
  // {
  //   id: 6,
  //   title: "Kids' Space Explorer Club",
  //   slug: "kids-space-explorer",
  //   shortDescription:
  //     "A fun, interactive journey through the solar system for young astrophiles.",
  //   description:
  //     "Engaging stories, craft activities, and simple science experiments to introduce children to the wonders of space.",
  //   thumbnailUrl:
  //     "https://images.unsplash.com/photo-1454789548728-85d2696cf293?auto=format&fit=crop&q=80&w=800",
  //   instructorId: 3,
  //   price: 2000,
  //   isFree: false,
  //   originalPrice: 3000,
  //   category: "Kids",
  //   grade: "Class 6-10",
  //   mode: "Live",
  //   level: "Beginner",
  //   language: "Bangla",
  //   totalLessons: 8,
  //   duration: "4 weeks",
  //   syllabus: [
  //     {
  //       title: "Rocket Science for Kids",
  //       lessons: 2,
  //       duration: "2h",
  //       topics: ["How Rockets Fly", "Paper Rocket Workshop", "Astronaut Life"],
  //     },
  //     {
  //       title: "Planet Hunting",
  //       lessons: 2,
  //       duration: "2h",
  //       topics: ["Mars Rovers", "Gas Giants", "Alien Life?"],
  //     },
  //   ],
  // },
  {
    id: 7,
    title: "Python for Astronomers",
    slug: "python-for-astronomy",
    shortDescription:
      "Learn to analyze astronomical data using Python, NumPy, and Astropy.",
    description:
      "A practical coding course for physics and astronomy students. Learn to process FITS files, plot light curves, and simulate orbits.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
    instructorId: 2,
    price: 3500,
    isFree: false,
    originalPrice: 5000,
    category: "Data Science",
    grade: "University",
    mode: "Recorded",
    level: "Intermediate",
    language: "English",
    totalLessons: 20,
    duration: "8 weeks",
    syllabus: [
      {
        title: "Python Basics for Science",
        lessons: 4,
        duration: "6h",
        topics: ["NumPy Arrays", "Matplotlib Plotting", "File I/O"],
      },
      {
        title: "Astropy & Data Analysis",
        lessons: 6,
        duration: "9h",
        topics: ["Coordinate Transformations", "FITS Handling", "Photometry"],
      },
    ],
  },
];

export const events: Event[] = [
  {
    id: 1,
    title: "National Astronomy Olympiad 2026",
    date: "2026-06-15T09:00:00",
    location: "Dhaka, Bangladesh",
    description:
      "A nationwide astronomy competition for school and college students. Test your knowledge and qualify for the international team.",
    imageUrl:
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=800",
    type: "Olympiad",
    registrationLink: "#",
  },
  {
    id: 2,
    title: "Live Telescope Observation Night",
    date: "2026-04-12T20:00:00",
    location: "Online (Zoom)",
    description:
      "Live online telescope session observing planets, the moon, and deep sky objects like the Orion Nebula.",
    imageUrl:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800",
    type: "Event",
    registrationLink: "#",
  },
  {
    id: 3,
    title: "Astrophotography Workshop",
    date: "2026-05-20T18:00:00",
    location: "Dhaka Planetarium",
    description:
      "Learn how to capture stunning photos of the night sky using DSLR cameras and smartphone attachments.",
    imageUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800",
    type: "Workshop",
    registrationLink: "#",
  },
  {
    id: 4,
    title: "Astronomy Career Day 2025",
    date: "2025-09-10T10:00:00",
    location: "Rajshahi University",
    description:
      "A past event where students explored career paths in astronomy, astrophysics, and space technology.",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    type: "Seminar",
    registrationLink: "#",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Dr. Mahmudul Hasan",
    role: "Founder & Chief Educator",
    bio: "Astronomy educator and science communicator, leading astronomy education initiatives in Bangladesh for over a decade.",
    photoUrl:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400",
    category: "Leadership",
    socialLinks: { twitter: "#", linkedin: "#" },
  },
  {
    id: 2,
    name: "Dr. Nusrat Jahan",
    role: "Senior Astronomy Instructor",
    bio: "Astrophysics researcher with experience in teaching and mentoring Olympiad students. Specializes in Stellar Evolution.",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    category: "Instructor",
    socialLinks: { linkedin: "#" },
  },
  {
    id: 3,
    name: "AP Olympiad Team",
    role: "Mentors & Trainers",
    bio: "A dedicated team of past Olympiad medalists and experienced mentors guiding students for national and international competitions.",
    photoUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400",
    category: "Instructor",
    socialLinks: { facebook: "#" },
  },
  {
    id: 4,
    name: "Rizwan Karim",
    role: "Curriculum Director",
    bio: "Education specialist shaping our courses to align with global astronomy education standards.",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    category: "Leadership",
    socialLinks: { linkedin: "#" },
  },
  {
    id: 5,
    name: "Prof. Abdul Latif",
    role: "Advisor, Physics Department",
    bio: "Professor of Physics at Dhaka University. Former Chair of National Science Council.",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    category: "Advisor",
    socialLinks: { linkedin: "#" },
  },
  {
    id: 6,
    name: "Dr. Ayesha Sultana",
    role: "Research Advisor",
    bio: "Astrophysicist at Bangladesh Space Research &amp; Remote Sensing Organization (SPARRSO).",
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    category: "Advisor",
    socialLinks: { twitter: "#" },
  },
  {
    id: 7,
    name: "Imran Chowdhury",
    role: "Observational Astronomy Instructor",
    bio: "Expert telescope operator and astrophotographer. Conducts live observation sessions for students.",
    photoUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    category: "Instructor",
    socialLinks: { twitter: "#", linkedin: "#" },
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Arian Rahman",
    role: "Olympiad Gold Medalist",
    content:
      "Astronomy Pathshala's Olympiad prep course was a game changer. The problem-solving techniques helped me secure a Gold Medal.",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Sadia Islam",
    role: "High School Student",
    content:
      "I always loved space, but I didn't know where to start. The Foundation Course made everything so clear and exciting!",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 3,
    name: "Tanvir Ahmed",
    role: "Amateur Astronomer",
    content:
      "The live telescope nights are amazing. Being able to see Saturn's rings from my home screen is an unforgettable experience.",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 4,
    name: "Nusrat Rahman",
    role: "Parent",
    content:
      "My daughter's curiosity about science has skyrocketed since she joined AP. The instructors are patient and truly passionate.",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Why Astronomy Education Matters in the 21st Century",
    slug: "why-astronomy-matters",
    excerpt:
      "Astronomy develops curiosity, critical thinking, and a scientific mindset among students.",
    content:
      "In an era of rapid technological advancement, looking up at the stars might seem like a luxury. But astronomy is more than just stargazing; it's a gateway to science, technology, engineering, and mathematics (STEM).\n\nAstronomy forces us to ask big questions and solve complex problems. It teaches humility and perspective. For students in Bangladesh, engaging with astronomy can open doors to careers in physics, data science, and engineering.",
    authorName: "Astronomy Pathshala",
    publishedAt: "2024-08-15",
    imageUrl:
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=1200",
    category: "Education",
  },
  {
    id: 2,
    title: "How to Prepare for Astronomy Olympiads",
    slug: "olympiad-preparation-guide",
    excerpt:
      "A step-by-step guide for students aiming to excel in astronomy competitions.",
    content:
      "Success in the Astronomy Olympiad requires a mix of theoretical knowledge, mathematical skill, and observational practice. \n\nStart with the basics: Celestial Mechanics and Coordinate Systems. Get comfortable with trigonometry and calculus. Don't neglect the night sky – learn to identify constellations and major stars. Join a community like Astronomy Pathshala to practice with peers and mentors.",
    authorName: "Olympiad Mentors Team",
    publishedAt: "2024-09-01",
    imageUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    category: "Guide",
  },
  {
    id: 3,
    title: "Understanding Black Holes: A Beginner’s Guide",
    slug: "black-holes-beginner-guide",
    excerpt:
      "An easy explanation of one of the most mysterious objects in the universe.",
    content:
      "Black holes are regions of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. \n\nThey are formed when massive stars collapse at the end of their life cycle. Despite being 'black', they are some of the most energetic objects in the universe, powering quasars and influencing the evolution of entire galaxies.",
    authorName: "Dr. Nusrat Jahan",
    publishedAt: "2024-09-10",
    imageUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200",
    category: "Astrophysics",
  },
];

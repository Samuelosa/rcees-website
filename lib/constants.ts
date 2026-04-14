export const site = {
  name: "RCEES",
  fullName: "Regional Centre for Energy and Environmental Sustainability",
  tagline: "A World Bank-funded Africa Centre of Excellence",
  host: "University of Energy and Natural Resources, Sunyani, Ghana",
  description:
    "RCEES is a World Bank-funded Africa Centre of Excellence at the University of Energy and Natural Resources, advancing research and postgraduate education in energy and environmental sustainability across Africa.",
  url: "https://rcees.uenr.edu.gh",
  address: {
    lines: [
      "Regional Centre for Energy and Environmental Sustainability",
      "University of Energy and Natural Resources",
      "Off Sunyani–Fiapre Road",
      "Sunyani, Bono Region, Ghana",
    ],
  },
  phones: ["+233 554 981 410", "+233 50 636 6712"],
  email: "rcees@uenr.edu.gh",
  helpDesk: "https://uenr.edu.gh/help",
  admissionsPortal: "https://admissions.uenr.edu.gh",
};

// Real imagery from rcees.uenr.edu.gh
const R = "https://rcees.uenr.edu.gh/wp-content/uploads";
const RT = "https://rcees.uenr.edu.gh/wp-content/themes/acadia/assets/img";

export const images = {
  // Hero slots — real RCEES event photos
  heroStudents: `${R}/2024/10/RCE_0206-scaled.jpg`,         // workshop / students on site
  heroSolar: `${R}/2025/04/RCE_5418-min-scaled.jpg`,        // ACE@10 event
  heroWind: `${R}/2025/05/RCE_5588_1-min-scaled.jpg`,       // event photo
  heroLab: `${R}/2025/05/RCE_5734-min-scaled.jpg`,          // environmental engineering
  heroAfrica: `${RT}/breadcrumb/breadcrumb-bg-3.jpg`,       // breadcrumb bg
  heroGraduation: `${R}/2024/10/RCE_0206-scaled.jpg`,       // workshop

  // Editorial / about imagery
  aboutTeaser: `${R}/2024/09/about-thumb-1-2.jpg`,          // about page photo
  directorWelcome: `${R}/2025/12/ADAMA.jpeg`,               // portrait
  history: `${R}/2025/04/RCE_5418-min-scaled.jpg`,          // ACE@10 event
  researchLab: `${R}/2025/05/RCE_5734-min-scaled.jpg`,      // env engineering

  // Facility / programme imagery
  facilityA: `${R}/2025/05/RCE_5734-min-scaled.jpg`,
  facilityB: `${R}/2025/05/RCE_5588_1-min-scaled.jpg`,
  facilityC: `${R}/2024/10/RCE_0206-scaled.jpg`,
  facilityD: `${R}/2024/09/about-thumb-1-2.jpg`,

  academicsHero: `${R}/2024/10/RCE_0206-scaled.jpg`,        // workshop
  researchHero: `${R}/2025/05/RCE_5734-min-scaled.jpg`,
  projects: `${R}/2025/04/RCE_5418-min-scaled.jpg`,
  engineer: `${R}/2025/12/ADAMA.jpeg`,

  news1: `${R}/2025/05/RCE_5588_1-min-scaled.jpg`,
  news2: `${R}/2025/04/RCE_5418-min-scaled.jpg`,
  news3: `${R}/2024/10/RCE_0206-scaled.jpg`,

  contact: `${R}/2024/09/about-thumb-1-2.jpg`,
  logo: "/rcees-logo.png",
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about", description: "Vision, mission and values" },
      { label: "The Team", href: "/about/team", description: "Leadership, faculty and boards" },
      { label: "History", href: "/about/history", description: "Milestones since 2019" },
      { label: "Facilities", href: "/about/facilities", description: "Labs and infrastructure" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Overview", href: "/academics" },
      { label: "PhD Programmes", href: "/academics/phd" },
      { label: "MSc Programmes", href: "/academics/msc" },
      { label: "MPhil Programmes", href: "/academics/mphil" },
      { label: "Professional Short Courses", href: "/academics/short-courses" },
      { label: "Admissions", href: "/academics/admissions" },
      { label: "Student Resources", href: "/academics/students" },
    ],
  },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  {
    label: "News & Events",
    href: "/news",
    children: [
      { label: "News", href: "/news" },
      { label: "Events", href: "/news#events" },
      { label: "Success Stories", href: "/news#stories" },
      { label: "Gallery", href: "/news#gallery" },
    ],
  },
  { label: "Partners", href: "/partners" },
  { label: "ACE Impact", href: "/ace-impact" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: "300", suffix: "+", label: "Postgraduates trained" },
  { value: "13", suffix: "+", label: "African partner countries" },
  { value: "8", suffix: "+", label: "Active research projects" },
  { value: "Top 10", suffix: "", label: "Of 46 ACE centres continent-wide" },
];

export const programmeTiers = [
  {
    title: "PhD Programmes",
    href: "/academics/phd",
    blurb:
      "Four-year doctoral training combining a year of structured coursework with original research in sustainable energy, environmental engineering, and energy policy.",
  },
  {
    title: "MSc Programmes",
    href: "/academics/msc",
    blurb:
      "Two-year master's degrees integrating taught modules and supervised research, preparing graduates for leadership in energy and environmental sectors.",
  },
  {
    title: "Professional Short Courses",
    href: "/academics/short-courses",
    blurb:
      "Certified, industry-aligned courses in solar PV, energy efficiency, energy audit, wind power and cookstove technology for working professionals.",
  },
];

export const researchThemes = [
  {
    title: "Energy Transition",
    summary:
      "Pathways from fossil fuels to renewable and cleaner sources, supporting Africa's progress toward net-zero emissions.",
  },
  {
    title: "Energy Storage",
    summary:
      "Materials, systems and policy frameworks for storing electrical energy — a linchpin of the global renewable transition.",
  },
  {
    title: "Energy–Environment Nexus",
    summary:
      "The environmental consequences of energy consumption and their social, economic and ecological effects on African communities.",
  },
  {
    title: "Sustainable Development",
    summary:
      "Energy as a driver of societal development, managed within the ecological limits of the continent's landscapes.",
  },
];

export const phdProgrammes = [
  {
    title: "PhD Sustainable Energy Engineering and Management (SEEM)",
    duration: "3 years",
    structure: "1 year coursework, 2 years research",
    department: "Department of Energy and Petroleum Engineering, School of Engineering",
    summary:
      "Produces graduates with rigorous research and analytical skills in sustainable energy systems, policy design and engineering management.",
  },
  {
    title: "PhD Environmental Engineering and Management (EEMA)",
    duration: "3 years",
    structure: "1 year coursework, 2 years research",
    department: "School of Engineering",
    summary:
      "Advanced doctoral training in environmental systems, pollution control, and integrated resource management for African contexts.",
  },
  {
    title: "PhD Energy Policy and Sustainability",
    duration: "3 years",
    structure: "1 year coursework, 2 years research",
    department: "School of Energy",
    summary:
      "Interdisciplinary doctoral research on energy governance, regulation, and the political economy of the African energy transition.",
  },
  {
    title: "PhD Energy Economics",
    duration: "3 years",
    structure: "1 year coursework, 2 years research",
    department: "School of Energy",
    summary:
      "Quantitative research on energy markets, pricing, investment and welfare implications of the continent's energy choices.",
  },
];

export const mscProgrammes = [
  {
    title: "MSc Sustainable Energy Engineering and Management",
    duration: "2 years",
    structure: "1 year taught, 1 year research",
    summary:
      "Trains the next generation of expertise in energy, power and environment — combining technical depth with management practice.",
  },
  {
    title: "MSc Environmental Engineering and Management",
    duration: "2 years",
    structure: "1 year taught, 1 year research",
    summary:
      "Graduate training in environmental engineering, impact assessment, and management of natural resources under climate pressure.",
  },
  {
    title: "MSc Energy Economics",
    duration: "2 years",
    structure: "1 year taught, 1 year research",
    summary:
      "Rigorous grounding in the economics of energy supply, demand, policy instruments and investment decisions.",
  },
  {
    title: "MSc Energy Policy and Sustainability",
    duration: "2 years",
    structure: "1 year taught, 1 year research",
    summary:
      "Builds capacity in energy governance, regulatory design, and sustainable development planning.",
  },
];

export const mphilProgrammes = [
  {
    title: "MPhil Energy Policy and Sustainability",
    duration: "2 years",
    summary: "Research-led master's for candidates pursuing advanced work in energy governance and sustainability policy.",
  },
  {
    title: "MPhil Energy Economics",
    duration: "2 years",
    summary: "Research master's focused on applied and theoretical energy economics for African markets.",
  },
];

export const shortCourses = [
  { title: "Design & Installation of Stand-alone Solar PV", mode: "Classroom + field" },
  { title: "Energy Efficiency Management", mode: "Classroom + industry visits" },
  { title: "Energy Audit", mode: "Classroom + field" },
  { title: "Renewable Energy Market & Business Development", mode: "Classroom" },
  { title: "Wind Power Technology", mode: "Classroom + field" },
  { title: "Improved Cookstove Technology", mode: "Classroom + field" },
  { title: "Small Hydro", mode: "Classroom + field" },
];

export const projects = [
  {
    title: "ACE Impact Project",
    funder: "World Bank",
    status: "Active",
    summary:
      "The flagship Africa Centres of Excellence for Development Impact programme underwrites RCEES's research, training and regional partnerships.",
  },
  {
    title: "EPIC Africa",
    funder: "International consortium",
    status: "Active",
    summary:
      "Research on the water–energy–food nexus in Sub-Saharan Africa, focused on integrated planning for climate-resilient livelihoods.",
  },
  {
    title: "SUSTAINDam",
    funder: "University of Würzburg partnership",
    status: "Active",
    summary:
      "A joint research programme examining the long-term sustainability of the Akosombo Dam and its downstream ecosystems.",
  },
  {
    title: "ProREG",
    funder: "KNUST, TU Berlin, DAAD",
    status: "Active",
    summary:
      "Professional education in renewable energy, training graduate engineers and technicians to industry-ready standards.",
  },
  {
    title: "ELMO",
    funder: "University of Sierra Leone, Imperial College London",
    status: "Active",
    summary:
      "Engineering education capacity building across West Africa, with curriculum development and staff exchanges.",
  },
  {
    title: "ImPreSSion",
    funder: "Erasmus+ consortium",
    status: "Active",
    summary:
      "Digital literacy and curriculum modernization for engineering faculties in Ghana and partner institutions.",
  },
  {
    title: "STREAMING / Horizon Europe",
    funder: "European Commission",
    status: "Active",
    summary:
      "Participation in Horizon Europe research consortia on renewable integration, storage and smart grids.",
  },
  {
    title: "Green People's Energy",
    funder: "University of Oldenburg, German Development Cooperation",
    status: "Active",
    summary:
      "Off-grid and mini-grid research partnership focused on rural electrification and community energy access.",
  },
];

export const partners = [
  { name: "The World Bank", role: "Lead funder, ACE Impact programme" },
  { name: "University of Energy and Natural Resources (UENR)", role: "Host university" },
  { name: "Kwame Nkrumah University of Science and Technology", role: "Ghanaian research partner" },
  { name: "Technische Universität Berlin", role: "ProREG partner" },
  { name: "University of Oldenburg", role: "Green People's Energy partner" },
  { name: "University of Würzburg", role: "SUSTAINDam partner" },
  { name: "AGI Energy Service Centre", role: "German Development Cooperation" },
  { name: "Climate Technology Centre & Network (CTCN)", role: "Technology transfer partner" },
  { name: "Imperial College London", role: "ELMO partner" },
  { name: "University of Sierra Leone", role: "Regional partner" },
  { name: "Kumasi Institute of Technology, Energy and Environment", role: "Research partner" },
  { name: "Brew-Hammond Energy Centre", role: "Research partner" },
  { name: "Koforidua, Sunyani, Kumasi & Tamale Technical Universities", role: "Professional training partners" },
  { name: "University of Applied Forest Sciences, Rottenburg", role: "Biomass research partner" },
];

export const team = {
  management: [
    {
      name: "Prof. Ing. Eric Ofosu Antwi",
      role: "Centre Leader",
      credentials: "Associate Professor, Civil Engineering",
      bio: "More than two decades of engineering practice and academic leadership. Led the delivery of the Centre's ultramodern building and was recognised by the World Bank for leadership of an ACE Impact centre.",
    },
    {
      name: "Prof. Ing. Samuel Gyamfi",
      role: "Deputy Centre Leader",
      credentials: "Professor, School of Energy",
      bio: "Research and teaching across sustainable energy systems, with decades of contribution to UENR's postgraduate programmes.",
    },
    {
      name: "Dr. Benjamin Batinge",
      role: "Deputy Centre Leader",
      credentials: "PhD, Stellenbosch University; MPhil, University of Bergen",
      bio: "Consultant to UNEP, the Green Climate Fund and the IFC on energy access, climate finance and sustainable development policy.",
    },
    {
      name: "Dr. Felix Amankwah Diawuo",
      role: "Research Leader",
      credentials: "Formerly Lawrence Berkeley National Laboratory",
      bio: "Leads RCEES's research agenda on energy modelling, efficiency and the intersection of energy systems with environmental policy.",
    },
    {
      name: "Eric",
      role: "Centre Administrator",
      credentials: "Junior Assistant Registrar",
      bio: "Coordinates admissions, student affairs, finance and the day-to-day operations of the Centre.",
    },
  ],
};

export const newsItems = [
  {
    date: "2026-03-18",
    title: "RCEES recognised among top ten performing ACE Impact centres",
    excerpt:
      "The World Bank's ACE@10 review places RCEES in the top decile of the 46-strong Africa Centres of Excellence network for research output, student throughput and regional impact.",
    image: images.news1,
  },
  {
    date: "2026-02-02",
    title: "SUSTAINDam field season opens on the Akosombo reservoir",
    excerpt:
      "RCEES and the University of Würzburg have begun the 2026 field campaign, collecting sediment, water-quality and biodiversity data across the upper reservoir.",
    image: images.news2,
  },
  {
    date: "2026-01-14",
    title: "Call for scholarship applications — 2026 PhD and MSc intake",
    excerpt:
      "Fully funded places are available across RCEES's doctoral and master's programmes in sustainable energy engineering, environmental engineering, energy economics and policy.",
    image: images.news3,
  },
];

export const facilities = [
  {
    title: "Solar Energy Systems Laboratory",
    summary:
      "Instrumented rigs for stand-alone and grid-connected PV, hybrid systems and balance-of-system performance testing.",
    image: images.facilityA,
  },
  {
    title: "Biomass Research Laboratory",
    summary:
      "Thermochemical conversion, cookstove performance and biomass-resource characterisation for West African feedstocks.",
    image: images.facilityB,
  },
  {
    title: "Climate and Environmental Data Centre",
    summary:
      "A regional hub for climate, hydrological and environmental datasets supporting doctoral and policy-facing research.",
    image: images.facilityC,
  },
  {
    title: "Postgraduate Research Commons",
    summary:
      "Dedicated study, computing and seminar spaces for doctoral and master's students across the Centre's programmes.",
    image: images.facilityD,
  },
];

export const milestones = [
  { year: "2019", title: "RCEES established at UENR", body: "Selected by the World Bank as an Africa Centre of Excellence for Development Impact." },
  { year: "2020", title: "Postgraduate intake begins", body: "First cohorts of MSc and PhD students enrol across the Centre's programmes." },
  { year: "2021", title: "Ultramodern Centre building groundbreaking", body: "Construction begins on RCEES's dedicated research and teaching facility." },
  { year: "2023", title: "International accreditation", body: "Programme accreditation secured from continental and international quality assurance bodies." },
  { year: "2024", title: "ProREG professional training launched", body: "Industry-aligned renewable energy training rolls out with KNUST and TU Berlin." },
  { year: "2025", title: "ACE@10 top-ten recognition", body: "RCEES placed among the ten highest-performing ACE Impact centres on the continent." },
];

import type { Portfolio } from './types';

/**
 * Starting content, written from Abhishek's resume, LinkedIn profile and personal statement.
 * It is copied into the database the first time the site runs; after that,
 * everything is edited from the admin panel.
 */
export const seedPortfolio: Portfolio = {
  profile: {
    name: 'Abhishek Dass',
    title: 'Software Engineer & Motorsports, Data Science, AI and Business Enthusiast',
    tagline: 'Driven by curiosity, building the future in Motorsports, Data Science, AI and Business.',
    roles: [
      'Flight Software Developer',
      'Motorsport Data & Telemetry Engineer',
      'AI-Native Engineer in the making',
      'Business & Product Thinker',
    ],
    about:
      "I'm a Computer Science & Business Systems graduate from Nagpur who fell for motorsport through data. As Aerodynamics & Data Acquisition Lead for E-Formula AshwaRiders, I built the sensor-to-analytics pipeline for an electric Formula Student car, which contributed to an AIR 8 overall finish at Formula Bharat 2024 against 40+ national teams.\n\nToday I write flight software for the SUTS CubeSat with the Estonian Student Satellite Foundation, I co-authored a peer-reviewed CNN-LSTM anomaly-detection paper (DL-SEC), and I'm sharpening my AI-native engineering skills through Antern's 18-week programme alongside PyTorch and scikit-learn study.\n\nMy goal is a data or energy-systems role in Formula 1: turning noisy, high-stakes telemetry into decisions made at race speed. Longer term, I want to launch my own tech venture. I'm just as interested in the business side: digital marketing, AI in marketing, and building products people actually use.",
    facts: [
      'Based in Nagpur, India',
      'Open to relocation (including the UK)',
      'B.Tech CSBS, CGPA 8.69 / 10',
      'Hindi (native), English (professional)',
    ],
    photo: '/images/abhishek.webp',
    photoAlt: 'Abhishek Dass smiling outdoors in a navy blazer and a black cap',
    resume: '',
    email: 'abhishekdass141516@gmail.com',
    phone: '',
    location: 'Nagpur, Maharashtra, India',
    availability: 'Open to F1, motorsport data & software roles',
    linkedin: 'https://www.linkedin.com/in/abhishek-dass-220387257',
    github: 'https://github.com/abhishekdass1415',
    twitter: '',
    instagram: '',
    seoTitle: 'Abhishek Dass | Software Engineer, Motorsport Data & AI',
    seoDescription:
      'Portfolio of Abhishek Dass: software engineer and motorsport data enthusiast. Real-time telemetry, CNN-LSTM anomaly detection, flight software and AI-native engineering, aiming for Formula 1.',
    footerNote: 'Built with a lot of curiosity and a little bit of downforce.',
  },

  stats: [
    { id: 'stat-air8', value: 'AIR 8', label: 'Overall, Formula Bharat 2024 (40+ teams)', order: 1 },
    { id: 'stat-years', value: '2+ yrs', label: 'Leading telemetry & aero for an EV race car', order: 2 },
    { id: 'stat-records', value: '10K+', label: 'Records processed in ETL pipelines', order: 3 },
    { id: 'stat-paper', value: '1', label: 'Peer-reviewed paper co-authored (DL-SEC)', order: 4 },
  ],

  projects: [
    {
      id: 'telemetry',
      title: 'Real-Time Vehicle Telemetry & Analytics',
      summary:
        'End-to-end sensor-to-dashboard pipeline for an electric Formula Student car, with live anomaly detection against expected performance envelopes.',
      details:
        "Built for E-Formula AshwaRiders, the pipeline instruments speed, thermal and battery sensors, moves data over CAN and wireless links, and presents it live on dashboards that flag deviations from expected ranges during testing and competition.\n\nThe acquisition software uses LabVIEW with the DQMH message-handler framework so each module stays small, testable and maintainable. Data is parsed, stored and analysed after each session so the team can make setup decisions from evidence.",
      category: 'Motorsport',
      image: '',
      video: '',
      demoLink: '',
      codeLink: '',
      tags: ['LabVIEW', 'DQMH', 'Python', 'MQTT', 'PostgreSQL', 'CAN'],
      highlights: [
        '1,000+ sensor records processed per session',
        'Live anomaly dashboards used for setup decisions',
        'Contributed to AIR 8 overall at Formula Bharat 2024',
        'ML-based vehicle-improvement model on live test data',
      ],
      year: '2024',
      featured: true,
      order: 1,
    },
    {
      id: 'dl-sec',
      title: 'DL-SEC: CNN-LSTM Anomaly Detection',
      summary:
        'Co-authored, peer-reviewed deep-learning system that flags anomalies in streaming data, with a reproducible benchmarking framework around it.',
      details:
        'DL-SEC (Deep Learning for Smart Cybersecurity Threat Analytics) combines CNN, LSTM and CNN-LSTM variants behind one consistent inference interface.\n\nThe part I am proudest of is the evaluation harness: a machine-readable metrics pipeline so another researcher can verify every result. The same score-the-signal, flag-the-deviation logic carries straight over to vehicle-performance and race-strategy data.',
      category: 'AI / Data Science',
      image: '',
      video: '',
      demoLink: '',
      codeLink: '',
      tags: ['Python', 'CNN-LSTM', 'Anomaly Detection', 'Benchmarking'],
      highlights: [
        'Peer-reviewed, co-authored research paper',
        'Unified inference interface across CNN, LSTM and CNN-LSTM',
        'Reproducible, machine-readable metrics pipeline',
      ],
      year: '2026',
      featured: false,
      order: 2,
    },
    {
      id: 'suts-cubesat',
      title: 'SUTS CubeSat Flight Software',
      summary:
        'Core Flight Software (cFS) applications for the command module of an international student CubeSat mission launching in 2028.',
      details:
        "Part of the Estonian Student Satellite Foundation's SUTS mission, working asynchronously across time zones with an international team.\n\nFlight software has to be right the first time, so the work centres on fault-tolerant, real-time practices and strict pre-deployment verification.",
      category: 'Aerospace',
      image: '',
      video: '',
      demoLink: '',
      codeLink: '',
      tags: ['C', 'cFS', 'Real-time', 'Verification'],
      highlights: ['Selected for an international flight software team', 'Launch planned for 2028'],
      year: '2026',
      featured: false,
      order: 3,
    },
    {
      id: 'saafai',
      title: 'SaafAI: Data Scraper & Map',
      summary:
        'Production web scraper that builds a structured database at scale, plus an interactive map on top of it and 10,000+ record ETL pipelines.',
      details:
        'Built at PugArch Technology: a scraper that extracts targeted data, normalises it and loads it into a structured database, with a fully working map integrated on top.\n\nAutomated data-quality checks and Python ETL pipelines across PostgreSQL, MySQL and MongoDB cut manual preprocessing effort by 60%.',
      category: 'Software',
      image: '',
      video: '',
      demoLink: '',
      codeLink: '',
      tags: ['Python', 'Web Scraping', 'ETL', 'MongoDB', 'PostgreSQL'],
      highlights: ['10,000+ structured records processed', '60% less manual preprocessing'],
      year: '2025',
      featured: false,
      order: 4,
    },
    {
      id: 'crisisnet',
      title: 'CrisisNet: Disaster Response Platform',
      summary:
        'Real-time full-stack platform with live location tracking and request-routing logic to coordinate emergency response teams.',
      details:
        'A MERN-stack application using Socket.IO for live updates, with request-routing logic that connects people who need help with the nearest available responders.',
      category: 'Software',
      image: '',
      video: '',
      demoLink: '',
      codeLink: '',
      tags: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
      highlights: ['Live location tracking', 'Request-routing for response teams'],
      year: '2025',
      featured: false,
      order: 5,
    },
    {
      id: 'lane-identification',
      title: 'Lane Identification System',
      summary:
        'MATLAB computer-vision mini project that detects road lanes from camera footage, an early step toward autonomous-vehicle perception.',
      details:
        'A semester mini project on lane identification using MATLAB, completed with a teammate under faculty guidance. It sparked my interest in how vehicles perceive and interpret their environment.',
      category: 'Research',
      image: '',
      video: '',
      demoLink: '',
      codeLink: '',
      tags: ['MATLAB', 'Computer Vision', 'Image Processing'],
      highlights: ['Lane detection pipeline in MATLAB'],
      year: '2024',
      featured: false,
      order: 6,
    },
  ],

  experience: [
    {
      id: 'exp-suts',
      role: 'Flight Software Developer',
      company: 'Estonian Student Satellite Foundation (SUTS CubeSat)',
      location: 'Remote',
      type: 'Team / Club',
      start: '2026-07',
      end: '',
      current: true,
      summary: 'Developing flight software for a CubeSat mission launching in 2028.',
      bullets: [
        "Develop Core Flight Software (cFS) applications for the satellite's command module",
        'Work asynchronously with an international, cross-timezone engineering team',
        'Apply fault-tolerant, real-time practices and strict pre-deployment verification',
      ],
      logo: '',
    },
    {
      id: 'exp-hixaa',
      role: 'LabVIEW Engineering Intern',
      company: 'HIXAA Technologies Pvt. Ltd.',
      location: 'Nagpur, India',
      type: 'Internship',
      start: '2026-01',
      end: '2026-07',
      current: false,
      summary: 'LabVIEW applications for a medical-grade audiometer and a metro simulator.',
      bullets: [
        'Built and debugged LabVIEW interfaces for a Pune Maha Metro simulation platform',
        'Tested and configured a medical-grade audiometer before deployment',
        'Wrote setup guides and client-facing documentation for on-site installs',
      ],
      logo: '',
    },
    {
      id: 'exp-pugarch',
      role: 'Junior Software Engineer',
      company: 'PugArch Technology Pvt. Ltd.',
      location: 'Nagpur, India',
      type: 'Full-time',
      start: '2025-07',
      end: '2026-02',
      current: false,
      summary: 'Web scraping, ETL pipelines and full-stack work in Python and the MERN stack.',
      bullets: [
        'Built SaafAI, a production scraper, and a map integrated with its database',
        'Python ETL pipelines on 10,000+ records across PostgreSQL, MySQL and MongoDB',
        'Cut manual preprocessing effort by 60% with automated quality checks',
      ],
      logo: '',
    },
    {
      id: 'exp-infosys',
      role: 'Data Analytics Intern',
      company: 'Infosys',
      location: 'India',
      type: 'Internship',
      start: '2025-08',
      end: '2025-10',
      current: false,
      summary: 'Turned raw business datasets into dashboards and decisions.',
      bullets: [
        'Exploratory and statistical analysis, plus data cleaning, with SQL, Excel and Power BI',
        'Built Power BI dashboards that cut reporting turnaround by 40%',
      ],
      logo: '',
    },
    {
      id: 'exp-ashwariders',
      role: 'Aerodynamics & Data Acquisition Lead',
      company: 'E-Formula AshwaRiders (SAE India Formula Bharat EV)',
      location: 'Nagpur, India',
      type: 'Team / Club',
      start: '2023-05',
      end: '2026-02',
      current: false,
      summary: 'Rose from aerodynamic design engineer to leading telemetry and aero for the team.',
      bullets: [
        'Led data acquisition and aero strategy, contributing to AIR 8 overall at Formula Bharat 2024',
        'Designed real-time sensor-to-analytics pipelines with LabVIEW, DQMH and MQTT',
        'Built live anomaly dashboards used for setup decisions in testing and competition',
        'Began as Jr. Aerodynamic Design Engineer (SolidWorks, Fusion 360, Ansys); also served as Inventory Manager',
      ],
      logo: '',
    },
  ],

  education: [
    {
      id: 'edu-antern',
      school: 'Antern',
      degree: 'AI-Native Engineering Programme (18 weeks)',
      start: '2026-10',
      end: '',
      grade: '',
      details: 'Agent evaluation, ML pipeline deployment, Docker, Kubernetes, CI/CD and production monitoring.',
      logo: '',
    },
    {
      id: 'edu-svpcet',
      school: 'St. Vincent Pallotti College of Engineering & Technology, Nagpur',
      degree: 'B.Tech, Computer Science and Business Systems',
      start: '2022-11',
      end: '2026-06',
      grade: 'CGPA 8.69 / 10',
      details: 'Programming, databases, data processing, software development and business systems.',
      logo: '',
    },
  ],

  skills: [
    { id: 's-py', name: 'Python', category: 'Programming', level: 'Strong', order: 1 },
    { id: 's-c', name: 'C / C++', category: 'Programming', level: 'Working', order: 2 },
    { id: 's-java', name: 'Java', category: 'Programming', level: 'Working', order: 3 },
    { id: 's-js', name: 'JavaScript', category: 'Programming', level: 'Strong', order: 4 },
    { id: 's-sql', name: 'SQL', category: 'Programming', level: 'Strong', order: 5 },

    { id: 's-cnnlstm', name: 'CNN-LSTM & anomaly detection', category: 'Data Science & AI', level: 'Strong', order: 6 },
    { id: 's-ts', name: 'Time-series & streaming analysis', category: 'Data Science & AI', level: 'Strong', order: 7 },
    { id: 's-pandas', name: 'Pandas', category: 'Data Science & AI', level: 'Strong', order: 8 },
    { id: 's-sk', name: 'Scikit-learn', category: 'Data Science & AI', level: 'Learning', order: 9 },
    { id: 's-torch', name: 'PyTorch', category: 'Data Science & AI', level: 'Learning', order: 10 },

    { id: 's-etl', name: 'ETL pipelines', category: 'Data Engineering', level: 'Strong', order: 11 },
    { id: 's-pg', name: 'PostgreSQL / MySQL / MongoDB', category: 'Data Engineering', level: 'Working', order: 12 },
    { id: 's-pbi', name: 'Power BI & dashboards', category: 'Data Engineering', level: 'Strong', order: 13 },
    { id: 's-mqtt', name: 'MQTT & real-time data', category: 'Data Engineering', level: 'Working', order: 14 },

    { id: 's-lv', name: 'LabVIEW & DQMH', category: 'Motorsport & Embedded', level: 'Strong', order: 15 },
    { id: 's-can', name: 'CAN / UART / SPI / I²C', category: 'Motorsport & Embedded', level: 'Working', order: 16 },
    { id: 's-mcu', name: 'Arduino / ESP32 / STM32', category: 'Motorsport & Embedded', level: 'Working', order: 17 },
    { id: 's-cad', name: 'SolidWorks / Fusion 360 / Ansys', category: 'Motorsport & Embedded', level: 'Working', order: 18 },

    { id: 's-react', name: 'React & Next.js', category: 'Web Development', level: 'Working', order: 19 },
    { id: 's-node', name: 'Node.js & Express', category: 'Web Development', level: 'Working', order: 20 },
    { id: 's-spring', name: 'Spring Boot & REST APIs', category: 'Web Development', level: 'Working', order: 21 },

    { id: 's-mkt', name: 'AI in marketing', category: 'Business & Marketing', level: 'Working', order: 22 },
    { id: 's-bi', name: 'Business analytics & reporting', category: 'Business & Marketing', level: 'Working', order: 23 },
    { id: 's-doc', name: 'Technical documentation', category: 'Business & Marketing', level: 'Strong', order: 24 },
  ],

  goals: [
    {
      id: 'g-f1',
      title: 'Join an F1 or motorsport data team',
      type: 'Short-term',
      description:
        'Work in vehicle performance analysis, telemetry, simulation or energy systems, where data decides races.',
      order: 1,
    },
    {
      id: 'g-msc',
      title: 'Deepen data science & AI with a master’s degree',
      type: 'Short-term',
      description:
        'Pursue graduate study in Data Science and AI for Sustainability to pair practical instincts with formal research rigour.',
      order: 2,
    },
    {
      id: 'g-ai',
      title: 'Become an AI-native engineer',
      type: 'Short-term',
      description:
        'Ship production ML systems: evaluation, deployment and monitoring, via Antern and hands-on PyTorch / scikit-learn.',
      order: 3,
    },
    {
      id: 'g-startup',
      title: 'Launch my own tech startup',
      type: 'Long-term',
      description:
        'Combine engineering, data and business thinking to build a product that makes motorsport and mobility smarter.',
      order: 4,
    },
    {
      id: 'g-energy',
      title: 'Shape energy-efficient performance',
      type: 'Long-term',
      description:
        'Contribute to engineering approaches that pair competitive speed with efficient use of energy and resources.',
      order: 5,
    },
  ],

  achievements: [
    { id: 'a-air8', title: 'AIR 8 overall, Formula Bharat 2024', kind: 'Achievement', year: '2024', detail: 'Against 40+ competing national teams', order: 1 },
    { id: 'a-suts', title: 'Selected for SUTS CubeSat flight software team', kind: 'Achievement', year: '2026', detail: 'Estonian Student Satellite Foundation', order: 2 },
    { id: 'a-dlsec', title: 'DL-SEC: CNN-LSTM based anomaly detection', kind: 'Publication', year: '2026', detail: 'Co-authored, peer-reviewed paper', order: 3 },
    { id: 'a-infosys', title: 'Data Analytics Internship Certification', kind: 'Certification', year: '2025', detail: 'Infosys', order: 4 },
    { id: 'a-mern', title: 'MERN Stack Web Development', kind: 'Certification', year: '', detail: 'Edunet', order: 5 },
    { id: 'a-aiml', title: 'AI-ML and Green Technology', kind: 'Certification', year: '', detail: 'Edunet', order: 6 },
    { id: 'a-aimkt', title: 'Artificial Intelligence in Marketing', kind: 'Certification', year: '', detail: '', order: 7 },
  ],

  posts: [
    {
      id: 'f1-telemetry-cornering-speed',
      title: 'Deciphering F1 Telemetry: How Teams Find Tenths in High-Speed Apexes',
      topic: 'Motorsport & F1',
      tags: ['Motorsport', 'F1', 'Telemetry', 'Data Science', 'Python'],
      excerpt:
        'A technical deep dive into CAN bus sensor data, throttle trace comparisons, and aerodynamic downforce profiles from Formula Student to Grand Prix racing.',
      cover: '/images/abhishek.webp',
      published: true,
      createdAt: '2026-03-20T10:00:00.000Z',
      body: `## The Anatomy of an Apex

In high-downforce open-wheel racing, lap time is rarely found on the straights. The true differentiator between a good lap and pole position lies in the transition phases: braking release, mid-corner platform stability, and the instant of throttle pickup.

During my time heading Aerodynamics & Data Acquisition for **E-Formula AshwaRiders**, our primary challenge at Formula Bharat was correlating our CFD simulations with trackside strain gauge and potentiometer readouts.

> "A driver might feel understeer, but the telemetry reveals whether it is front tire thermal degradation or aero balance shift under pitch."

### Key Telemetry Traces Every Motorsport Engineer Analyzes:

- **Brake Pressure vs. Longitudinal G**: Evaluating trail-braking efficiency and slip angle induction.
- **Steering Angle vs. Yaw Rate**: Detecting understeer gradient and rear differential lock performance.
- **Ride Height Sensors (Laser / Potentiometers)**: Measuring aerodynamic pitch sensitivity across high and low rake configurations.

\`\`\`python
# Sample Python snippet for calculating corner exit throttle progression rate
import numpy as np

def calculate_throttle_aggression(time_s, throttle_pct):
    d_throttle = np.diff(throttle_pct) / np.diff(time_s)
    return np.max(d_throttle), np.mean(d_throttle[d_throttle > 0])
\`\`\`

## Looking Ahead: AI in Real-Time Race Strategy

Modern Formula 1 teams like Williams and Mercedes run thousands of Monte Carlo simulations per lap to predict tire deg curves, safety car windows, and undercut viability. As I continue developing my AI-native toolset, bringing neural network surrogate models to high-frequency sensor streams is where motorsport engineering is heading next.`,
    },
  ],
};

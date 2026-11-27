import { CAREER_FAMILIES, DISC_TRAITS } from './discScoring.service.js';

const BLEND_TITLES = {
  DI: 'DI Style: The Visionary Catalyst',
  DS: 'DS Style: The Grounded Executor',
  DC: 'DC Style: The Decisive Architect',
  ID: 'ID Style: The Persuasive Energizer',
  IS: 'IS Style: The Empathetic Connector',
  IC: 'IC Style: The Creative Communicator',
  SD: 'SD Style: The Reliable Anchor',
  SI: 'SI Style: The Collaborative Harmonizer',
  SC: 'SC Style: The Steady Craftsperson',
  CD: 'CD Style: The Analytical Strategist',
  CI: 'CI Style: The Insightful Advisor',
  CS: 'CS Style: The Methodical Specialist',
};

const TRAIT_META = {
  D: {
    name: 'Dominance',
    tendency: 'results-oriented decision-making, direct communication, and taking ownership under pressure',
    strengths: [
      'Drives projects forward with decisive action and clear accountability',
      'Thrives when solving high-stakes problems and removing bottlenecks',
    ],
    growthArea: 'Pause to gather input from quieter stakeholders before finalizing major decisions',
  },
  I: {
    name: 'Influence',
    tendency: 'energetic collaboration, relationship building, and rallying people around shared ideas',
    strengths: [
      'Builds rapport quickly and motivates teams through optimistic communication',
      'Translates complex ideas into compelling stories for diverse audiences',
    ],
    growthArea: 'Pair big-picture enthusiasm with structured follow-through and written milestones',
  },
  S: {
    name: 'Steadiness',
    tendency: 'calm consistency, dependable follow-through, and creating supportive team environments',
    strengths: [
      'Maintains composure during uncertainty and sustains reliable day-to-day execution',
      'Listens attentively and fosters long-term trust with colleagues and clients',
    ],
    growthArea: 'Voice priorities and boundaries early when competing requests pile up',
  },
  C: {
    name: 'Conscientiousness',
    tendency: 'analytical rigor, structured planning, and holding work to high quality standards',
    strengths: [
      'Spots subtle edge cases, patterns, and risks before they become costly mistakes',
      'Designs clean, repeatable processes backed by careful research and evidence',
    ],
    growthArea: 'Avoid over-polishing low-impact details when a timely first iteration is enough',
  },
};

const FAMILY_PROFILES = {
  'Management & Business': { D: 85, I: 72, S: 52, C: 70 },
  'Computer, Engineering & Science': { D: 62, I: 42, S: 58, C: 92 },
  'Community, Social Service & Legal': { D: 56, I: 74, S: 82, C: 74 },
  'Education, Arts & Media': { D: 50, I: 88, S: 72, C: 58 },
  Healthcare: { D: 54, I: 64, S: 88, C: 82 },
  'Sales & Office Support': { D: 72, I: 86, S: 62, C: 55 },
  'Personal & Protective Services': { D: 78, I: 60, S: 76, C: 64 },
  'Trades, Production & Transport': { D: 70, I: 40, S: 78, C: 76 },
};

const EDUCATION_TIER_MAP = {
  'No Formal Education': 0,
  'High School / GED': 1,
  'Vocational / Technical Diploma': 2,
  'Associate Degree': 2,
  "Bachelor's Degree": 3,
  "Master's Degree": 4,
  'Doctorate / PhD': 4,
};

const getEducationTier = (educationLevel) => {
  if (!educationLevel) return 3; // Legacy assessments without a profile snapshot
  return EDUCATION_TIER_MAP[educationLevel] ?? 1;
};

// Tiered, qualification-aware job catalog:
// Guarantees >= 12 office roles and >= 8 non-office roles at EVERY education/experience tier (including Tier 0, 0 yrs exp).
const FALLBACK_JOB_CATALOG = [
  // ================= TIER 0: NO FORMAL EDUCATION / ENTRY ACCESSIBLE (12 Office + 8 Non-Office) =================
  {
    title: 'Data Entry & Records Clerk',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'office', 'admin', 'clerical', 'business'],
    description:
      'Maintains digital spreadsheets, customer records, and daily logs with accuracy and steady focus. Accessible without a college degree and rewards reliability and attention to detail.',
    keySkills: ['Accurate typing', 'Spreadsheet organization', 'Attention to detail'],
    jobDiscProfile: { D: 42, I: 40, S: 84, C: 90 },
    firstStep:
      'Practice free typing and spreadsheet basics online for 20 minutes a day and build a clean sample inventory sheet.',
  },
  {
    title: 'Customer Support Representative',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'customer', 'support', 'sales', 'communication'],
    description:
      'Helps customers solve everyday questions by phone, chat, or email with warmth and patience. Offers on-the-job training and clear pathways into team lead roles.',
    keySkills: ['Active listening', 'Clear communication', 'Problem resolution'],
    jobDiscProfile: { D: 52, I: 84, S: 86, C: 58 },
    firstStep:
      'Prepare two brief examples of times you helped someone solve a frustrating problem calmly and clearly.',
  },
  {
    title: 'Front Desk & Receptionist',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'hospitality', 'office', 'admin'],
    description:
      'Welcomes visitors, answers incoming calls, and keeps daily schedules organized at offices, clinics, or hotels. Great entry-level office role for friendly, organized communicators.',
    keySkills: ['Visitor hospitality', 'Call routing', 'Calendar coordination'],
    jobDiscProfile: { D: 44, I: 86, S: 84, C: 64 },
    firstStep:
      'Create a concise one-page resume highlighting punctuality, friendly communication, and basic computer familiarity.',
  },
  {
    title: 'Order Processing & Dispatch Clerk',
    family: 'Management & Business',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'logistics', 'supply', 'business', 'operations'],
    description:
      'Tracks incoming customer orders, updates shipment logs, and coordinates pickup timing with drivers and warehouses. Suits dependable, action-oriented organizers.',
    keySkills: ['Order tracking', 'Schedule coordination', 'Clear phone updates'],
    jobDiscProfile: { D: 72, I: 56, S: 76, C: 78 },
    firstStep:
      'Visit local distribution or courier company career boards and look for entry-level dispatch or order clerk openings.',
  },
  {
    title: 'Inventory & Stock Control Clerk',
    family: 'Management & Business',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'retail', 'supply', 'operations', 'business'],
    description:
      'Audits stock counts, logs incoming deliveries, and flags low inventory before shortages happen. Rewards methodical record-keeping without requiring a university degree.',
    keySkills: ['Inventory counting', 'Record accuracy', 'Basic spreadsheet tracking'],
    jobDiscProfile: { D: 56, I: 42, S: 80, C: 88 },
    firstStep:
      'Learn basic barcode scanning and stock-sheet formulas through a short free tutorial to boost entry-level readiness.',
  },
  {
    title: 'Call Center Service & Sales Agent',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'sales', 'marketing', 'communication'],
    description:
      'Connects with customers over phone or chat to answer inquiries and recommend suitable services. Provides structured scripts, paid training, and quick performance feedback.',
    keySkills: ['Persuasive speaking', 'Resilience', 'CRM note-taking'],
    jobDiscProfile: { D: 76, I: 88, S: 56, C: 50 },
    firstStep:
      'Record yourself answering three common customer questions aloud to refine a confident, upbeat phone tone.',
  },
  {
    title: 'Clinic Scheduling & Appointment Clerk',
    family: 'Healthcare',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'health', 'medical', 'office', 'care'],
    description:
      'Books patient appointments, confirms intake details, and supports front-office clinic flow. Offers a welcoming entry point into healthcare with on-the-job software training.',
    keySkills: ['Empathetic phone etiquette', 'Appointment scheduling', 'Confidentiality'],
    jobDiscProfile: { D: 46, I: 72, S: 88, C: 76 },
    firstStep:
      'Look up entry-level patient access or clinic receptionist roles at local dental, vision, or community clinics.',
  },
  {
    title: 'E-Commerce & Online Order Assistant',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'ecommerce', 'retail', 'digital', 'business'],
    description:
      'Updates online product listings, processes returns, and answers buyer messages for small shops or online stores. Accessible entry role for digital-friendly self-starters.',
    keySkills: ['Product listing updates', 'Buyer support', 'Order verification'],
    jobDiscProfile: { D: 60, I: 70, S: 72, C: 76 },
    firstStep:
      'Explore a free beginner guide on Shopify or marketplace seller dashboards to see how orders and listings are managed.',
  },
  {
    title: 'Junior Community & Social Media Helper',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'media', 'arts', 'marketing', 'social', 'design'],
    description:
      'Assists local businesses or creators with posting schedules, replying to comments, and organizing basic graphics. Great creative starter role built on practical skills rather than degrees.',
    keySkills: ['Visual layout basics', 'Community replies', 'Content scheduling'],
    jobDiscProfile: { D: 56, I: 90, S: 64, C: 54 },
    firstStep:
      'Design three sample promotional posts for a favorite local café or shop using a free tool like Canva.',
  },
  {
    title: 'Library & Archive Support Clerk',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'education', 'arts', 'library', 'history'],
    description:
      'Checks out materials, shelves collections accurately, and helps community visitors find resources. Calm, structured workplace ideal for patient and detail-minded people.',
    keySkills: ['Catalog organization', 'Helpful visitor support', 'Consistent routine'],
    jobDiscProfile: { D: 36, I: 58, S: 90, C: 84 },
    firstStep:
      'Ask your local public library about part-time page, clerk, or volunteer desk opportunities.',
  },
  {
    title: 'Mailroom & Office Support Clerk',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'office', 'admin', 'logistics'],
    description:
      'Sorts incoming packages, prepares outgoing mail, and keeps office supplies stocked and organized. Dependable entry point inside larger companies with room to grow.',
    keySkills: ['Sorting & filing', 'Time management', 'Dependable follow-through'],
    jobDiscProfile: { D: 50, I: 50, S: 88, C: 80 },
    firstStep:
      'Apply for office services or mailroom clerk openings at local hospitals, schools, or corporate centers.',
  },
  {
    title: 'Community Intake & Front-Office Aide',
    family: 'Community, Social Service & Legal',
    isOfficeRole: true,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'social', 'community', 'nonprofit', 'public'],
    description:
      'Greets community members at nonprofits or public centers, helps them complete basic forms, and directs them to the right staff. Rewards empathy and steady organization.',
    keySkills: ['Warm intake support', 'Form accuracy', 'Resource routing'],
    jobDiscProfile: { D: 48, I: 76, S: 90, C: 66 },
    firstStep:
      'Volunteer for one shift at a neighborhood resource center or food pantry to learn intake workflows firsthand.',
  },
  // Tier 0 Non-Office (8)
  {
    title: 'Warehouse & Fulfillment Associate',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'logistics', 'warehouse', 'trades', 'operations'],
    description:
      'Picks, packs, labels, and prepares shipments safely in active fulfillment hubs. Offers immediate entry with clear daily targets and pathways to forklift or shift-lead roles.',
    keySkills: ['Order picking accuracy', 'Safety awareness', 'Consistent pace'],
    jobDiscProfile: { D: 68, I: 42, S: 80, C: 74 },
    firstStep:
      'Check local fulfillment hubs or distribution centers offering paid on-the-job training and equipment certification.',
  },
  {
    title: 'Delivery & Local Courier Driver',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'transport', 'driving', 'logistics'],
    description:
      'Delivers parcels, goods, or supplies along local routes while maintaining punctual drop-offs and friendly customer handoffs. Ideal for independent, action-oriented workers.',
    keySkills: ['Route planning', 'Time discipline', 'Safe driving habits'],
    jobDiscProfile: { D: 78, I: 58, S: 72, C: 66 },
    firstStep:
      'Review local courier or fleet delivery requirements (clean driving record and basic route app fluency).',
  },
  {
    title: 'Retail Sales Floor Associate',
    family: 'Sales & Office Support',
    isOfficeRole: false,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'retail', 'sales', 'customer'],
    description:
      'Assists shoppers in-store, demonstrates products, restocks displays, and handles checkout smoothly. Great active role for energetic communicators who enjoy helping people.',
    keySkills: ['Friendly product guidance', 'Point-of-sale handling', 'Teamwork'],
    jobDiscProfile: { D: 64, I: 88, S: 70, C: 48 },
    firstStep:
      'Walk into three local stores you enjoy shopping at and ask managers when they hire floor associates.',
  },
  {
    title: 'Hospitality & Guest Services Attendant',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'hospitality', 'hotel', 'food', 'events'],
    description:
      'Creates welcoming experiences for hotel, café, or venue guests through attentive floor service and smooth teamwork. No degree needed—attitude and reliability matter most.',
    keySkills: ['Guest hospitality', 'Fast-paced teamwork', 'Calm problem-solving'],
    jobDiscProfile: { D: 58, I: 86, S: 80, C: 52 },
    firstStep:
      'Highlight reliability, weekend flexibility, and positive people skills when applying to local hotels or cafés.',
  },
  {
    title: 'Building Maintenance & Grounds Helper',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'trades', 'maintenance', 'repair', 'construction'],
    description:
      'Assists with basic facility upkeep, tool handling, painting, and outdoor grounds care. Solid hands-on starting point that builds practical trade skills on the job.',
    keySkills: ['Basic tool handling', 'Preventive upkeep', 'Safety checklists'],
    jobDiscProfile: { D: 66, I: 40, S: 82, C: 76 },
    firstStep:
      'Look for facilities helper roles at schools, apartment complexes, or parks departments that train on site.',
  },
  {
    title: 'Home Care & Personal Support Aide',
    family: 'Healthcare',
    isOfficeRole: false,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'health', 'care', 'nursing', 'social'],
    description:
      'Supports older adults or clients with daily routines, companionship, and safe home organization. Deeply rewarding hands-on work with short agency training programs.',
    keySkills: ['Compassionate care', 'Patience & dependability', 'Safety observation'],
    jobDiscProfile: { D: 44, I: 70, S: 94, C: 66 },
    firstStep:
      'Contact a licensed local home-care agency to ask about their paid entry-level caregiver orientation.',
  },
  {
    title: 'Production & Assembly Line Operator',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'manufacturing', 'production', 'trades', 'mechanical'],
    description:
      'Operates assembly stations, checks product quality, and keeps production lines running safely and steadily. Rewards focus, precision, and dependable shift work.',
    keySkills: ['Quality inspection', 'Machine safety', 'Repeatable precision'],
    jobDiscProfile: { D: 60, I: 36, S: 84, C: 86 },
    firstStep:
      'Search for entry-level manufacturing or packaging operator roles that include paid safety and equipment training.',
  },
  {
    title: 'Event Setup & Venue Crew Member',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    minEducationTier: 0,
    minExperience: 0,
    fieldTags: ['general', 'events', 'hospitality', 'sports', 'media'],
    description:
      'Prepares stages, seating, signage, and guest flow for concerts, conferences, and community gatherings. Active, team-driven work for energetic problem-solvers.',
    keySkills: ['Team coordination', 'Quick setup execution', 'Guest awareness'],
    jobDiscProfile: { D: 74, I: 78, S: 68, C: 54 },
    firstStep:
      'Sign up with a local stadium, convention center, or event staffing company for weekend crew shifts.',
  },

  // ================= TIER 1: HIGH SCHOOL / GED (6 Office + 5 Non-Office) =================
  {
    title: 'Junior IT Helpdesk Trainee',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['computer', 'it', 'tech', 'software', 'electronics', 'general'],
    description:
      'Troubleshoots everyday computer, printer, and account login issues for staff or customers. Strong entry bridge into technology using practical troubleshooting and short certifications.',
    keySkills: ['Basic PC troubleshooting', 'Ticket logging', 'Patient user guidance'],
    jobDiscProfile: { D: 54, I: 60, S: 76, C: 86 },
    firstStep:
      'Start a free IT support basics course (such as CompTIA ITF+ or Google IT Support intro) and practice documenting fixes.',
  },
  {
    title: 'Sales Development Representative (Entry-Level)',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['sales', 'business', 'marketing', 'communication', 'general'],
    description:
      'Reaches out to prospective customers, qualifies their needs, and books introductory calls for account teams. Rewards goal drive, energy, and coachability over formal degrees.',
    keySkills: ['Outbound outreach', 'Discovery questioning', 'CRM follow-up'],
    jobDiscProfile: { D: 84, I: 90, S: 48, C: 52 },
    firstStep:
      'Write a 3-sentence outreach message and practice a 2-minute mock discovery call with a friend.',
  },
  {
    title: 'Operations & Administrative Coordinator',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['admin', 'business', 'management', 'office', 'general'],
    description:
      'Keeps schedules, vendor invoices, supplies, and team updates running smoothly behind the scenes. Ideal for organized, steady teammates who bring calm order to busy offices.',
    keySkills: ['Calendar & logistics coordination', 'Record keeping', 'Cross-team communication'],
    jobDiscProfile: { D: 52, I: 64, S: 86, C: 82 },
    firstStep:
      'Build a clean shared task-and-deadline tracker in a spreadsheet tool to demonstrate your organizational workflow.',
  },
  {
    title: 'Junior Bookkeeping & Billing Clerk',
    family: 'Management & Business',
    isOfficeRole: true,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['accounting', 'finance', 'math', 'business', 'economics'],
    description:
      'Records daily invoices, reconciles receipts, and helps small businesses keep accounts accurate and up to date. Great structured office path for detail-oriented problem-solvers.',
    keySkills: ['Invoice reconciliation', 'Spreadsheet accuracy', 'Basic bookkeeping'],
    jobDiscProfile: { D: 48, I: 40, S: 80, C: 94 },
    firstStep:
      'Try a free introductory bookkeeping module or QuickBooks tutorial to learn basic debits, credits, and invoicing.',
  },
  {
    title: 'Junior Content & Copywriting Assistant',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['writing', 'english', 'media', 'arts', 'marketing', 'journalism'],
    description:
      'Drafts product descriptions, newsletter blurbs, and social captions under an editor’s guidance. Accessible entry path for expressive communicators with a small writing portfolio.',
    keySkills: ['Clear writing', 'Proofreading', 'Audience tone matching'],
    jobDiscProfile: { D: 56, I: 86, S: 64, C: 70 },
    firstStep:
      'Write three short sample pieces (a product page, a welcome email, and a blog intro) to share as a starter portfolio.',
  },
  {
    title: 'Medical Office Front-Desk Coordinator',
    family: 'Healthcare',
    isOfficeRole: true,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['health', 'medical', 'biology', 'office', 'admin'],
    description:
      'Verifies insurance details, manages patient check-in, and coordinates clinic records accurately. Pairs compassionate people skills with structured office workflows.',
    keySkills: ['Patient check-in', 'Insurance verification basics', 'Privacy compliance'],
    jobDiscProfile: { D: 50, I: 70, S: 88, C: 82 },
    firstStep:
      'Learn common medical front-office terms and look for patient coordinator openings at local outpatient clinics.',
  },
  // Tier 1 Non-Office (5)
  {
    title: 'Apprentice Electrician / HVAC Helper',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['trades', 'electrical', 'mechanical', 'engineering', 'general'],
    description:
      'Works alongside licensed technicians installing, wiring, and servicing building systems while earning paid apprenticeship hours. High-demand skilled trade path without a college degree.',
    keySkills: ['Tool & safety discipline', 'Hands-on troubleshooting', 'Blueprint basics'],
    jobDiscProfile: { D: 72, I: 46, S: 74, C: 86 },
    firstStep:
      'Contact a local trade union hall or licensed electrical/HVAC contractor to ask about paid apprentice openings.',
  },
  {
    title: 'Security & Site Safety Officer',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['security', 'safety', 'criminal', 'law', 'general'],
    description:
      'Patrols facilities, monitors access points, logs incidents, and responds calmly to safety protocols. Fits observant, decisive individuals who value clear rules and dependability.',
    keySkills: ['Situational awareness', 'Incident reporting', 'Calm de-escalation'],
    jobDiscProfile: { D: 80, I: 52, S: 76, C: 80 },
    firstStep:
      'Check your local licensing requirements for entry-level unarmed security certification and first-aid basics.',
  },
  {
    title: 'Pharmacy Technician Trainee',
    family: 'Healthcare',
    isOfficeRole: false,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['pharmacy', 'health', 'medical', 'chemistry', 'biology'],
    description:
      'Assists licensed pharmacists with prescription intake, inventory labeling, and customer pickup while training toward certification. Blends careful accuracy with helpful service.',
    keySkills: ['Detail verification', 'Inventory labeling', 'Patient service'],
    jobDiscProfile: { D: 48, I: 62, S: 86, C: 90 },
    firstStep:
      'Look for retail pharmacy technician-in-training programs that sponsor certification study while you work.',
  },
  {
    title: 'Community Outreach Volunteer Coordinator',
    family: 'Community, Social Service & Legal',
    isOfficeRole: false,
    minEducationTier: 1,
    minExperience: 0,
    fieldTags: ['community', 'social', 'nonprofit', 'education', 'communication'],
    description:
      'Organizes neighborhood drives, welcomes volunteers on site, and connects residents with local support events. Great hands-on role for warm, reliable connectors.',
    keySkills: ['Volunteer onboarding', 'Event logistics', 'Empathetic outreach'],
    jobDiscProfile: { D: 58, I: 86, S: 84, C: 58 },
    firstStep:
      'Lead a small shift or sign-in table at a local community nonprofit event to build real coordination experience.',
  },
  {
    title: 'Shift Team Lead — Retail & Hospitality',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    minEducationTier: 1,
    minExperience: 1,
    fieldTags: ['retail', 'hospitality', 'management', 'business', 'general'],
    description:
      'Guides floor teammates during busy shifts, resolves guest escalations, and keeps daily targets on track. Ideal first leadership step for decisive, people-savvy workers.',
    keySkills: ['Shift coaching', 'Service recovery', 'Opening/closing checklists'],
    jobDiscProfile: { D: 82, I: 84, S: 66, C: 62 },
    firstStep:
      'Volunteer to train new hires or own the opening/closing checklist at your current workplace to demonstrate leadership.',
  },

  // ================= TIER 2: VOCATIONAL / TECHNICAL DIPLOMA & ASSOCIATE DEGREE (6 Office + 5 Non-Office) =================
  {
    title: 'IT Support & Network Technician',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['computer', 'it', 'network', 'tech', 'cyber', 'engineering'],
    description:
      'Configures workstations, resolves network tickets, and maintains reliable hardware and software systems. Strong technical career path built on diplomas or associate training.',
    keySkills: ['Network troubleshooting', 'System configuration', 'Documentation'],
    jobDiscProfile: { D: 60, I: 50, S: 68, C: 92 },
    firstStep:
      'Set up a small home lab virtual machine and document step-by-step fixes for three common networking issues.',
  },
  {
    title: 'Junior Web & Front-End Developer',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['computer', 'software', 'web', 'it', 'design', 'coding'],
    description:
      'Builds responsive web interfaces and interactive components using HTML, CSS, and JavaScript. Great fit for analytical builders with vocational training or a portfolio of projects.',
    keySkills: ['HTML/CSS/JavaScript', 'Responsive UI debugging', 'Version control (Git)'],
    jobDiscProfile: { D: 62, I: 54, S: 64, C: 90 },
    firstStep:
      'Publish two polished responsive web pages on GitHub with clean READMEs explaining your layout and code choices.',
  },
  {
    title: 'Paralegal & Legal Support Assistant',
    family: 'Community, Social Service & Legal',
    isOfficeRole: true,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['law', 'legal', 'paralegal', 'criminal', 'political', 'history'],
    description:
      'Prepares legal filings, organizes case files, and summarizes research for attorneys and legal departments. Rewards structured reading, fairness, and thorough documentation.',
    keySkills: ['Case file organization', 'Legal research basics', 'Proofreading precision'],
    jobDiscProfile: { D: 56, I: 48, S: 72, C: 94 },
    firstStep:
      'Review local paralegal certificate expectations and practice summarizing a public court opinion in one clean page.',
  },
  {
    title: 'Accounting & Payroll Technician',
    family: 'Management & Business',
    isOfficeRole: true,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['accounting', 'finance', 'business', 'commerce', 'math'],
    description:
      'Processes payroll cycles, manages accounts payable/receivable, and prepares monthly financial reconciliations. Dependable, high-precision role for diploma or associate graduates.',
    keySkills: ['Payroll processing', 'General ledger reconciliation', 'Compliance accuracy'],
    jobDiscProfile: { D: 50, I: 42, S: 80, C: 94 },
    firstStep:
      'Build a sample monthly reconciliation workbook with error checks and review local payroll compliance basics.',
  },
  {
    title: 'Digital Marketing & Media Coordinator',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['marketing', 'media', 'design', 'arts', 'business', 'communication'],
    description:
      'Coordinates campaign calendars, email newsletters, and social analytics for growing brands. Combines creative communication with measurable audience insights.',
    keySkills: ['Campaign scheduling', 'Copy & visual editing', 'Analytics reporting'],
    jobDiscProfile: { D: 64, I: 90, S: 60, C: 66 },
    firstStep:
      'Plan a mock 2-week launch campaign for a real product with three posts, an email draft, and target metrics.',
  },
  {
    title: 'Health Information & Medical Coding Technician',
    family: 'Healthcare',
    isOfficeRole: true,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['health', 'medical', 'informatics', 'biology', 'nursing'],
    description:
      'Reviews clinical documentation and assigns accurate diagnostic and billing codes to support healthcare operations. Ideal quiet, structured role for analytical helpers.',
    keySkills: ['Medical terminology', 'Coding accuracy', 'Health data privacy'],
    jobDiscProfile: { D: 48, I: 42, S: 82, C: 94 },
    firstStep:
      'Explore accredited medical coding or health information technician credentials such as CPC or RHIT pathways.',
  },
  // Tier 2 Non-Office (5)
  {
    title: 'Field Service & Automation Technician',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['engineering', 'electrical', 'mechanical', 'trades', 'automation', 'tech'],
    description:
      'Installs, calibrates, and troubleshoots mechanical or electrical equipment on site at client facilities. Rewards methodical hands-on diagnostics and independent reliability.',
    keySkills: ['Electrical & mechanical diagnostics', 'Preventive maintenance', 'Client site communication'],
    jobDiscProfile: { D: 68, I: 46, S: 72, C: 88 },
    firstStep:
      'Review manufacturer certification or technical diploma modules in PLC diagnostics, HVAC, or industrial maintenance.',
  },
  {
    title: 'Physical Therapy Assistant',
    family: 'Healthcare',
    isOfficeRole: false,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['health', 'therapy', 'kinesiology', 'sports', 'biology', 'medical'],
    description:
      'Works directly with patients on mobility exercises, recovery milestones, and encouraging daily progress. Great fit for supportive, upbeat people who enjoy active hands-on care.',
    keySkills: ['Hands-on coaching', 'Progress tracking', 'Empathetic motivation'],
    jobDiscProfile: { D: 50, I: 78, S: 90, C: 68 },
    firstStep:
      'Arrange a short clinic observation session with a licensed physical therapy team to experience daily patient sessions.',
  },
  {
    title: 'Emergency Medical & Safety Technician',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    minEducationTier: 2,
    minExperience: 0,
    fieldTags: ['health', 'emergency', 'medical', 'safety', 'fire', 'public'],
    description:
      'Delivers rapid first-response care, safety checks, and calm field triage under pressure. Suits steady, decisive responders who follow clinical protocols accurately.',
    keySkills: ['Emergency protocol execution', 'Calm crisis teamwork', 'Patient assessment'],
    jobDiscProfile: { D: 84, I: 58, S: 76, C: 82 },
    firstStep:
      'Check accredited EMT-Basic or workplace safety certification programs offered by your local community college.',
  },
  {
    title: 'Logistics & Fleet Operations Coordinator',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    minEducationTier: 2,
    minExperience: 1,
    fieldTags: ['logistics', 'supply', 'transport', 'business', 'operations'],
    description:
      'Directs warehouse dispatch, route schedules, and timely inventory movement across regional hubs. Combines steady operational discipline with real-time problem-solving.',
    keySkills: ['Dispatch & routing', 'Inventory accuracy', 'Team coordination'],
    jobDiscProfile: { D: 76, I: 56, S: 78, C: 78 },
    firstStep:
      'Tour a regional distribution hub or review supply-chain dispatch metrics like on-time delivery and fill rate.',
  },
  {
    title: 'Hospitality & Event Operations Supervisor',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    minEducationTier: 2,
    minExperience: 1,
    fieldTags: ['hospitality', 'events', 'tourism', 'management', 'business'],
    description:
      'Directs live guest experiences, venue logistics, and on-the-floor staff coordination during busy events. Ideal for upbeat problem-solvers who thrive in active, people-centered spaces.',
    keySkills: ['Live logistics troubleshooting', 'Team leadership', 'Guest service excellence'],
    jobDiscProfile: { D: 78, I: 88, S: 68, C: 56 },
    firstStep:
      'Shadow or assist a venue coordinator during a live event to learn run-of-show timing and vendor handoffs.',
  },

  // ================= TIER 3: BACHELOR'S DEGREE (10 Office + 4 Non-Office) =================
  {
    title: 'Full-Stack Software Engineer',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 0,
    fieldTags: ['computer', 'software', 'cs', 'it', 'engineering', 'math', 'data'],
    description:
      'Designs, builds, and maintains end-to-end web applications from database schemas to user interfaces. Rewards systematic debugging, clean architecture, and collaborative code reviews.',
    keySkills: ['Application architecture', 'Automated testing', 'Iterative problem-solving'],
    jobDiscProfile: { D: 66, I: 48, S: 60, C: 92 },
    firstStep:
      'Build and deploy a focused end-to-end CRUD project with tests and a concise architecture README.',
  },
  {
    title: 'Systems & Data Analyst',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 0,
    fieldTags: ['data', 'computer', 'math', 'statistics', 'economics', 'finance', 'business', 'engineering'],
    description:
      'Transforms operational and product datasets into reliable dashboards, insights, and system specifications. Ideal for people who enjoy precision, logic, and evidence-backed decisions.',
    keySkills: ['SQL & data modeling', 'Root-cause analysis', 'Clear documentation'],
    jobDiscProfile: { D: 58, I: 44, S: 64, C: 94 },
    firstStep:
      'Analyze a public dataset in SQL or Python and publish a 1-page summary of three actionable patterns.',
  },
  {
    title: 'UX Researcher & Product Designer',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 0,
    fieldTags: ['design', 'psychology', 'hci', 'arts', 'media', 'computer', 'communication'],
    description:
      'Conducts user interviews and synthesizes behavioral insights into intuitive digital interfaces. Blends empathetic listening with structured testing and visual communication.',
    keySkills: ['User interviewing', 'Wireframing & prototyping', 'Insight synthesis'],
    jobDiscProfile: { D: 52, I: 80, S: 74, C: 74 },
    firstStep:
      'Pick an everyday app flow, interview three users about friction points, and prototype a cleaner redesign.',
  },
  {
    title: 'Business & Operations Analyst',
    family: 'Management & Business',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 0,
    fieldTags: ['business', 'management', 'economics', 'finance', 'commerce', 'industrial'],
    description:
      'Evaluates workflows, KPIs, and operational bottlenecks to recommend practical process improvements. Bridges quantitative analysis with cross-functional business communication.',
    keySkills: ['Process mapping', 'KPI reporting', 'Stakeholder presentations'],
    jobDiscProfile: { D: 72, I: 64, S: 62, C: 86 },
    firstStep:
      'Document a recurring process bottleneck and write a 1-page proposal showing before-and-after efficiency gains.',
  },
  {
    title: 'Instructional Designer',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 0,
    fieldTags: ['education', 'teaching', 'psychology', 'english', 'media', 'communication'],
    description:
      'Designs engaging training curricula, workshops, and e-learning experiences for organizations or schools. Combines clear instructional structure with learner-centered empathy.',
    keySkills: ['Curriculum design', 'Clear technical writing', 'Learning assessment'],
    jobDiscProfile: { D: 48, I: 74, S: 80, C: 78 },
    firstStep:
      'Create a 15-minute mini-lesson outline on a topic in your field with clear learning objectives and a practice check.',
  },
  {
    title: 'Customer Success Manager',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 1,
    fieldTags: ['business', 'marketing', 'communication', 'management', 'psychology', 'general'],
    description:
      'Guides clients from onboarding through long-term adoption, ensuring they achieve measurable outcomes. Pairs warm relationship building with proactive account planning.',
    keySkills: ['Consultative listening', 'Account planning', 'Conflict de-escalation'],
    jobDiscProfile: { D: 66, I: 88, S: 76, C: 60 },
    firstStep:
      'Draft a 30-60-90 day customer onboarding template tailored to a software or service product you admire.',
  },
  {
    title: 'B2B Account Executive',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 1,
    fieldTags: ['business', 'sales', 'marketing', 'economics', 'communication', 'management'],
    description:
      'Leads business discovery conversations, demos tailored solutions, and negotiates client agreements. Energizing for goal-driven communicators who enjoy visible targets.',
    keySkills: ['Discovery questioning', 'Negotiation', 'Pipeline management'],
    jobDiscProfile: { D: 86, I: 90, S: 46, C: 54 },
    firstStep:
      'Practice a 5-minute discovery script focused on uncovering a buyer’s root operational bottleneck before pitching.',
  },
  {
    title: 'Compliance & Legal Operations Specialist',
    family: 'Community, Social Service & Legal',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 1,
    fieldTags: ['law', 'legal', 'political', 'business', 'finance', 'accounting', 'public'],
    description:
      'Reviews policies, contracts, and regulatory workflows to keep organizations ethical and audit-ready. Suits methodical thinkers who value clarity, fairness, and accuracy.',
    keySkills: ['Policy interpretation', 'Risk documentation', 'Detail verification'],
    jobDiscProfile: { D: 56, I: 46, S: 70, C: 92 },
    firstStep:
      'Read an industry compliance framework overview and summarize its core controls in plain business language.',
  },
  {
    title: 'Content & Brand Strategist',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 1,
    fieldTags: ['marketing', 'media', 'journalism', 'english', 'arts', 'communication', 'business'],
    description:
      'Shapes editorial calendars, messaging frameworks, and multi-channel campaigns that resonate with audiences. Suits expressive planners who blend creativity with audience feedback.',
    keySkills: ['Editorial strategy', 'Audience research', 'Persuasive copywriting'],
    jobDiscProfile: { D: 64, I: 90, S: 58, C: 64 },
    firstStep:
      'Audit three brands you respect and write a short breakdown of their voice, target audience, and content pillars.',
  },
  {
    title: 'Product Operations Manager',
    family: 'Management & Business',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 2,
    fieldTags: ['business', 'management', 'computer', 'engineering', 'product', 'operations'],
    description:
      'Coordinates cross-functional launches, metrics, and workflows so product and business teams ship smoothly. Balances decisive prioritization with repeatable operational rigor.',
    keySkills: ['Cross-functional planning', 'Process optimization', 'Stakeholder alignment'],
    jobDiscProfile: { D: 84, I: 68, S: 56, C: 80 },
    firstStep:
      'Map a multi-team launch workflow and design a concise readiness checklist to prevent handoff gaps.',
  },
  // Tier 3 Non-Office (4)
  {
    title: 'Registered Nurse / Clinical Care Coordinator',
    family: 'Healthcare',
    isOfficeRole: false,
    minEducationTier: 3,
    minExperience: 0,
    fieldTags: ['nursing', 'health', 'medical', 'clinical', 'biology', 'medicine'],
    requiresFieldMatch: true,
    description:
      'Delivers hands-on patient care while collaborating closely with physicians, families, and allied health staff. Combines steady compassion with crisp clinical accuracy.',
    keySkills: ['Patient advocacy', 'Clinical observation', 'Calm teamwork under pressure'],
    jobDiscProfile: { D: 60, I: 66, S: 90, C: 84 },
    firstStep:
      'Connect with a practicing nurse or clinical coordinator in your specialty area to compare inpatient vs. outpatient tracks.',
  },
  {
    title: 'Community Outreach & Case Specialist',
    family: 'Community, Social Service & Legal',
    isOfficeRole: false,
    minEducationTier: 3,
    minExperience: 0,
    fieldTags: ['social', 'psychology', 'sociology', 'public', 'community', 'education', 'counseling'],
    description:
      'Connects residents and families in the field with housing, education, and local support programs. Rewards patient relationship-building and structured case navigation.',
    keySkills: ['Active listening', 'Community resource navigation', 'Case documentation'],
    jobDiscProfile: { D: 54, I: 80, S: 88, C: 64 },
    firstStep:
      'Shadow a local case manager or community clinic social worker to observe intake and follow-up practices.',
  },
  {
    title: 'Field Application Engineer',
    family: 'Computer, Engineering & Science',
    isOfficeRole: false,
    minEducationTier: 3,
    minExperience: 1,
    fieldTags: ['engineering', 'computer', 'electrical', 'mechanical', 'physics', 'tech'],
    description:
      'Visits client sites to deploy technical systems, run live product demos, and troubleshoot hardware or software integrations. Great blend of engineering rigor and client energy.',
    keySkills: ['Technical demos', 'On-site troubleshooting', 'Client engineering translation'],
    jobDiscProfile: { D: 74, I: 76, S: 58, C: 86 },
    firstStep:
      'Prepare a 5-minute walkthrough explaining a technical system you built in clear, customer-friendly language.',
  },
  {
    title: 'Construction Site Project Supervisor',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    minEducationTier: 2,
    minExperience: 2,
    fieldTags: ['construction', 'civil', 'architecture', 'engineering', 'trades', 'management'],
    description:
      'Oversees crews, schedules, materials, and safety compliance across active job sites. Suits action-oriented leaders who enjoy tangible progress and direct coordination.',
    keySkills: ['Crew scheduling', 'Site safety enforcement', 'Blueprint interpretation'],
    jobDiscProfile: { D: 90, I: 62, S: 64, C: 74 },
    firstStep:
      'Review OSHA site-safety supervisor credentials and map out how your site experience transfers into project supervision.',
  },

  // ================= TIER 4 / SENIOR & ADVANCED DEGREE ROLES (6 Office + 2 Non-Office) =================
  {
    title: 'Management Consultant',
    family: 'Management & Business',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 2,
    fieldTags: ['business', 'mba', 'management', 'economics', 'finance', 'strategy', 'engineering'],
    description:
      'Diagnoses organizational challenges and crafts actionable strategic roadmaps for leadership teams. Combines structured quantitative analysis with persuasive client presentation.',
    keySkills: ['Strategic analysis', 'Executive storytelling', 'Problem structuring'],
    jobDiscProfile: { D: 88, I: 76, S: 44, C: 84 },
    firstStep:
      'Practice structuring a real industry case study into a concise executive memo with quantified trade-offs.',
  },
  {
    title: 'Senior Product Manager',
    family: 'Management & Business',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 4,
    fieldTags: ['business', 'product', 'computer', 'engineering', 'mba', 'design', 'management'],
    description:
      'Owns multi-quarter product vision, roadmap trade-offs, and cross-functional execution across engineering, design, and go-to-market teams.',
    keySkills: ['Product strategy', 'Executive alignment', 'Outcome prioritization'],
    jobDiscProfile: { D: 88, I: 78, S: 52, C: 78 },
    firstStep:
      'Write a concise product strategy brief defining target users, key metrics, and a prioritized 2-quarter roadmap.',
  },
  {
    title: 'Data Scientist & Applied ML Researcher',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    minEducationTier: 4,
    minExperience: 1,
    fieldTags: ['data', 'computer', 'statistics', 'math', 'ai', 'machine', 'physics', 'engineering'],
    description:
      'Designs statistical models, machine learning pipelines, and experimental evaluations to solve complex analytical problems. Ideal for graduate-level quantitative thinkers.',
    keySkills: ['Statistical modeling', 'Experiment design', 'Production ML pipelines'],
    jobDiscProfile: { D: 62, I: 46, S: 58, C: 96 },
    firstStep:
      'Publish a reproducible modeling notebook with clear baseline comparisons, error analysis, and business impact notes.',
  },
  {
    title: 'Health Informatics Lead',
    family: 'Healthcare',
    isOfficeRole: true,
    minEducationTier: 4,
    minExperience: 2,
    fieldTags: ['health', 'medical', 'informatics', 'nursing', 'public', 'biomedical'],
    requiresFieldMatch: true,
    description:
      'Architects clinical data systems and reporting workflows so healthcare teams deliver safer, more coordinated care. Connects advanced analysis with mission-driven impact.',
    keySkills: ['Clinical workflow architecture', 'Health data governance', 'Cross-disciplinary leadership'],
    jobDiscProfile: { D: 64, I: 58, S: 76, C: 90 },
    firstStep:
      'Map one high-friction clinical reporting workflow and outline a governance-compliant improvement plan.',
  },
  {
    title: 'Principal Systems Architect',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    minEducationTier: 3,
    minExperience: 5,
    fieldTags: ['computer', 'software', 'engineering', 'systems', 'it', 'cs'],
    description:
      'Sets long-term technical architecture, scalability standards, and reliability practices across engineering teams. Built for experienced engineers who combine depth with decisive clarity.',
    keySkills: ['Distributed architecture', 'Technical governance', 'Trade-off mentorship'],
    jobDiscProfile: { D: 78, I: 52, S: 56, C: 96 },
    firstStep:
      'Author an Architecture Decision Record (ADR) comparing two major system designs with clear reliability trade-offs.',
  },
  {
    title: 'Policy & Research Strategist',
    family: 'Community, Social Service & Legal',
    isOfficeRole: true,
    minEducationTier: 4,
    minExperience: 1,
    fieldTags: ['policy', 'public', 'law', 'economics', 'political', 'sociology', 'education', 'research'],
    description:
      'Conducts rigorous policy analysis, drafts evidence-based briefs, and advises public or nonprofit leaders on program design. Ideal for graduate-trained analytical communicators.',
    keySkills: ['Policy evaluation', 'Quantitative/qualitative synthesis', 'Briefing leadership'],
    jobDiscProfile: { D: 64, I: 66, S: 68, C: 92 },
    firstStep:
      'Draft a 2-page policy brief analyzing a current regional initiative with evidence-backed recommendations.',
  },
  // Tier 4 / Senior Non-Office (2)
  {
    title: 'Clinical Research & Field Operations Lead',
    family: 'Healthcare',
    isOfficeRole: false,
    minEducationTier: 4,
    minExperience: 2,
    fieldTags: ['health', 'medical', 'clinical', 'biology', 'pharmacy', 'nursing', 'biomedical'],
    requiresFieldMatch: true,
    description:
      'Oversees multi-site clinical study execution, site audits, and investigator coordination in the field. Combines scientific rigor with steady, hands-on operational leadership.',
    keySkills: ['Clinical trial compliance', 'Site audit leadership', 'Cross-site coordination'],
    jobDiscProfile: { D: 70, I: 64, S: 80, C: 92 },
    firstStep:
      'Review Good Clinical Practice (GCP) leadership guidelines and connect with clinical operations leads in your region.',
  },
  {
    title: 'Senior Emergency Management & Safety Officer',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    minEducationTier: 3,
    minExperience: 3,
    fieldTags: ['safety', 'emergency', 'public', 'management', 'criminal', 'engineering', 'environmental'],
    description:
      'Directs regional safety audits, crisis readiness drills, and multi-agency field response protocols. Fits composed, decisive leaders with proven operational judgment.',
    keySkills: ['Incident command leadership', 'Risk compliance audits', 'Crisis communication'],
    jobDiscProfile: { D: 88, I: 60, S: 72, C: 82 },
    firstStep:
      'Review advanced incident-command credentials (such as ICS-300/400 or CSP) aligned with your operational background.',
  },
];

const computeFieldMatchBonus = (fieldOfStudy, job) => {
  const fieldLower = String(fieldOfStudy || '').toLowerCase();
  const tags = job.fieldTags || [];
  if (!fieldLower || fieldLower === 'none' || fieldLower === 'general' || fieldLower === 'not applicable') {
    return tags.includes('general') ? 2 : 0;
  }

  const tokens = fieldLower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const hasDirectHit = tags.some(
    (tag) => tag !== 'general' && (fieldLower.includes(tag) || tokens.some((tok) => tag.includes(tok) || tok.includes(tag)))
  );

  if (hasDirectHit) return 8;
  return 0;
};

const selectQualifiedJobs = (scores, careerProfile) => {
  const userEduTier = getEducationTier(careerProfile?.educationLevel);
  const userExp =
    typeof careerProfile?.yearsOfExperience === 'number' && Number.isFinite(careerProfile.yearsOfExperience)
      ? Math.max(0, careerProfile.yearsOfExperience)
      : 2;
  const fieldOfStudy = careerProfile?.fieldOfStudy || '';

  const maxAllowedExp = userExp === 0 ? 0 : userExp + 1;

  const isQualified = (job) => {
    if ((job.minEducationTier ?? 0) > userEduTier) return false;
    if ((job.minExperience ?? 0) > maxAllowedExp) return false;
    if (job.requiresFieldMatch && careerProfile && computeFieldMatchBonus(fieldOfStudy, job) === 0) {
      return false;
    }
    return true;
  };

  const scoreJob = (job) => {
    const baseDisc = computeSimilarityScore(scores, job.jobDiscProfile);
    const fieldBonus = computeFieldMatchBonus(fieldOfStudy, job);

    // Reward jobs that match the user's education & experience tier so degree-holders/experienced users
    // see appropriately leveled roles ahead of entry-level Tier 0 clerical jobs, while Tier 0/1 users
    // exclusively see realistic, attainable roles.
    const eduDiff = Math.max(0, userEduTier - (job.minEducationTier ?? 0));
    const tierBonus = userEduTier >= 2 ? Math.max(-8, 5 - eduDiff * 3) : 0;
    const expBonus = userExp >= 2 && (job.minExperience ?? 0) >= 1 ? 3 : 0;

    const matchPercentage = Math.min(98, Math.max(55, Math.round(baseDisc + fieldBonus + tierBonus + expBonus)));
    return {
      title: job.title,
      family: job.family,
      isOfficeRole: job.isOfficeRole,
      matchPercentage,
      description: job.description,
      keySkills: job.keySkills,
      jobDiscProfile: job.jobDiscProfile,
      firstStep: job.firstStep,
    };
  };

  const qualified = FALLBACK_JOB_CATALOG.filter(isQualified).map(scoreJob);
  const officeJobs = qualified
    .filter((j) => j.isOfficeRole)
    .sort((a, b) => b.matchPercentage - a.matchPercentage || a.title.localeCompare(b.title))
    .slice(0, 12);
  const nonOfficeJobs = qualified
    .filter((j) => !j.isOfficeRole)
    .sort((a, b) => b.matchPercentage - a.matchPercentage || a.title.localeCompare(b.title))
    .slice(0, 8);

  return [...officeJobs, ...nonOfficeJobs].sort(
    (a, b) => b.matchPercentage - a.matchPercentage || a.title.localeCompare(b.title)
  );
};

const computeSimilarityScore = (userScores, targetScores) => {
  const distance = Math.sqrt(
    DISC_TRAITS.reduce((sum, trait) => {
      const diff = (userScores[trait] ?? 50) - (targetScores[trait] ?? 50);
      return sum + diff * diff;
    }, 0)
  );
  // Max theoretical distance across 4 dims (0..100) is 200; typical range is 10..110
  const normalized = Math.max(0, 1 - distance / 135);
  return Math.round(55 + normalized * 41); // 55..96
};

const normalizeProbabilitiesTo100 = (entries) => {
  const weights = entries.map((item) => Math.max(1, item.rawWeight));
  const total = weights.reduce((sum, w) => sum + w, 0);

  const exact = weights.map((w) => (w / total) * 100);
  const floors = exact.map((val) => Math.max(1, Math.floor(val)));
  let remainder = 100 - floors.reduce((sum, n) => sum + n, 0);

  const indicesByFraction = exact
    .map((val, idx) => ({ idx, frac: val - Math.floor(val) }))
    .sort((a, b) => b.frac - a.frac);

  let pointer = 0;
  while (remainder > 0) {
    floors[indicesByFraction[pointer % indicesByFraction.length].idx] += 1;
    remainder -= 1;
    pointer += 1;
  }

  while (remainder < 0) {
    const largestIdx = floors.indexOf(Math.max(...floors));
    floors[largestIdx] -= 1;
    remainder += 1;
  }

  return entries.map((entry, idx) => ({
    name: entry.name,
    matchProbability: floors[idx],
  }));
};

const getPrimarySecondary = (scores) => {
  const ranked = DISC_TRAITS.map((trait, order) => ({
    trait,
    score: scores?.[trait] ?? 50,
    order,
  })).sort((a, b) => b.score - a.score || a.order - b.order);

  return {
    primary: ranked[0].trait,
    secondary: ranked[1].trait,
  };
};

export const generateDemoCareerReport = (scores, blendLabel, careerProfile = null) => {
  const { primary, secondary } = getPrimarySecondary(scores);
  const blendKey = `${primary}${secondary}`;
  const primaryMeta = TRAIT_META[primary];
  const secondaryMeta = TRAIT_META[secondary];

  const styleTitle =
    BLEND_TITLES[blendKey] || `${blendKey} Style: Balanced ${primaryMeta.name} Contributor`;

  const profileNote = careerProfile
    ? ` Calibrated for your background (${careerProfile.educationLevel}${
        careerProfile.fieldOfStudy ? ` in ${careerProfile.fieldOfStudy}` : ''
      }, ${careerProfile.yearsOfExperience} ${
        careerProfile.yearsOfExperience === 1 ? 'year' : 'years'
      } of experience), every role below focuses on realistic, attainable paths.`
    : '';

  const summary =
    `Your ${blendLabel} highlights a preference for ${primaryMeta.tendency}, supported by ${secondaryMeta.tendency}.` +
    `${profileNote} ` +
    `Please note that DISC is intended for personal self-reflection and career exploration only—not as a scientific diagnostic or a hiring/selection tool.`;

  const strengths = [
    primaryMeta.strengths[0],
    secondaryMeta.strengths[0],
    primaryMeta.strengths[1],
  ];

  const growthAreas = [
    primaryMeta.growthArea,
    secondaryMeta.growthArea,
    'Adapt your communication pace when partnering with colleagues whose primary DISC tendencies differ from yours',
  ];

  const recommendedJobs = selectQualifiedJobs(scores, careerProfile);

  // Blend DISC family affinity with the user's qualified role alignment so career family fit is realistic
  const familyJobBoost = new Map();
  for (const job of recommendedJobs) {
    const prev = familyJobBoost.get(job.family) || { sum: 0, count: 0 };
    familyJobBoost.set(job.family, {
      sum: prev.sum + job.matchPercentage,
      count: prev.count + 1,
    });
  }

  const rawFamilyScores = CAREER_FAMILIES.map((name) => {
    const sim = computeSimilarityScore(scores, FAMILY_PROFILES[name]);
    const stats = familyJobBoost.get(name);
    const qualifiedWeight = stats ? (stats.sum / stats.count - 45) * (1 + stats.count * 0.25) : 4;
    const rawWeight = Math.pow(Math.max(1, sim - 45), 1.3) + Math.max(1, qualifiedWeight);
    return { name, rawWeight };
  });

  const careerFamilies = normalizeProbabilitiesTo100(rawFamilyScores).sort(
    (a, b) => b.matchProbability - a.matchProbability
  );

  return {
    styleTitle,
    summary,
    strengths,
    growthAreas,
    careerFamilies,
    recommendedJobs,
  };
};

const STOP_WORDS = new Set([
  'about',
  'after',
  'again',
  'being',
  'become',
  'becoming',
  'best',
  'blend',
  'career',
  'careers',
  'could',
  'disc',
  'does',
  'from',
  'good',
  'have',
  'help',
  'into',
  'jobs',
  'like',
  'match',
  'matches',
  'more',
  'most',
  'next',
  'profile',
  'really',
  'role',
  'roles',
  'score',
  'scores',
  'should',
  'some',
  'tell',
  'that',
  'their',
  'them',
  'these',
  'they',
  'this',
  'what',
  'when',
  'where',
  'which',
  'with',
  'work',
  'working',
  'would',
  'your',
]);

const extractSignificantWords = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

const getReportContext = (scores, assessment) => {
  const blendLabel = assessment?.blendLabel || (() => {
    const { primary, secondary } = getPrimarySecondary(scores);
    return `${primary} / ${secondary} Blend`;
  })();
  const fallbackReport = generateDemoCareerReport(
    scores,
    blendLabel,
    assessment?.careerProfile || null
  );
  const aiReport = assessment?.aiReport || {};

  const jobs =
    Array.isArray(aiReport.recommendedJobs) && aiReport.recommendedJobs.length > 0
      ? aiReport.recommendedJobs
      : fallbackReport.recommendedJobs;
  const families =
    Array.isArray(aiReport.careerFamilies) && aiReport.careerFamilies.length > 0
      ? aiReport.careerFamilies
      : fallbackReport.careerFamilies;
  const strengths =
    Array.isArray(aiReport.strengths) && aiReport.strengths.length > 0
      ? aiReport.strengths
      : fallbackReport.strengths;
  const growthAreas =
    Array.isArray(aiReport.growthAreas) && aiReport.growthAreas.length > 0
      ? aiReport.growthAreas
      : fallbackReport.growthAreas;
  const styleTitle = aiReport.styleTitle || fallbackReport.styleTitle;

  return { blendLabel, styleTitle, jobs, families, strengths, growthAreas };
};

const GENERIC_ROLE_WORDS = new Set([
  'office',
  'field',
  'hands',
  'non',
  'workplace',
  'manager',
  'lead',
  'specialist',
  'coordinator',
  'assistant',
  'officer',
  'supervisor',
  'executive',
  'director',
  'service',
  'operations',
  'project',
  'site',
  'support',
  'case',
  'care',
  'team',
  'communication',
  'planning',
  'analysis',
]);

const wordsMatchExactOrPlural = (a, b) =>
  a === b || `${a}s` === b || a === `${b}s` || `${a}es` === b || a === `${b}es`;

const findMentionedJobs = (query, jobs) => {
  const lower = String(query || '').toLowerCase();
  const queryWords = extractSignificantWords(lower);

  const scored = jobs
    .map((job) => {
      const titleLower = String(job.title || '').toLowerCase();
      if (titleLower && lower.includes(titleLower)) {
        return { job, weight: 100 };
      }

      const titleWords = extractSignificantWords(titleLower);
      const specificTitleMatches = queryWords.filter(
        (word) =>
          !GENERIC_ROLE_WORDS.has(word) &&
          titleWords.some((tw) => !GENERIC_ROLE_WORDS.has(tw) && wordsMatchExactOrPlural(tw, word))
      );
      const allTitleMatches = queryWords.filter((word) =>
        titleWords.some((tw) => wordsMatchExactOrPlural(tw, word))
      );

      let weight = 0;
      if (allTitleMatches.length >= 2 && specificTitleMatches.length >= 1) {
        weight = allTitleMatches.length * 10 + specificTitleMatches.length * 5;
      } else if (specificTitleMatches.length >= 1 && specificTitleMatches.some((w) => w.length >= 5)) {
        weight = 6;
      }

      return { job, weight };
    })
    .filter((entry) => entry.weight >= 6)
    .sort((a, b) => b.weight - a.weight || (b.job.matchPercentage ?? 0) - (a.job.matchPercentage ?? 0));

  return scored.map((entry) => entry.job);
};

const formatJobBullets = (jobs) =>
  jobs
    .map(
      (job) =>
        `• ${job.title} (${job.matchPercentage}% match — ${job.family}): ${job.description} First step: ${job.firstStep}`
    )
    .join('\n');

export const generateDemoChatReply = (history, scores, userMessage, assessment = null) => {
  const { primary, secondary } = getPrimarySecondary(scores);
  const primaryMeta = TRAIT_META[primary];
  const secondaryMeta = TRAIT_META[secondary];
  const rawMessage = String(userMessage || '').trim();
  const lower = rawMessage.toLowerCase();
  const ctx = getReportContext(scores, assessment);

  // 1. Ethical & Guardrail boundaries
  if (/\b(hire|hiring|screen candidates|fire|firing|diagnos\w*|clinical|medical advice|therap\w*|mental illness)\b/.test(lower)) {
    return (
      `Just a quick boundary: DISC is designed strictly for personal self-reflection and career exploration, never for hiring decisions, candidate screening, or clinical assessment.\n\n` +
      `If you'd like, we can explore how your own ${primary}/${secondary} tendencies (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}) translate into workplace strengths, role fit, or communication habits.`
    );
  }

  if (/\b(salar\w*|pay|wage\w*|compensation|how much|statistic\w*|percent of jobs|market rate|income|earning\w*)\b/.test(lower)) {
    return (
      `I don't invent salary figures or labor market statistics. For accurate pay benchmarks, check official sources like the U.S. Bureau of Labor Statistics (BLS) or local industry surveys.\n\n` +
      `What we can explore right here is which roles fit your ${ctx.styleTitle} profile best—such as ${ctx.jobs[0]?.title} (${ctx.jobs[0]?.matchPercentage}% match) or ${ctx.jobs[1]?.title} (${ctx.jobs[1]?.matchPercentage}% match)—and the key skills to build next.`
    );
  }

  // 2. Specific role(s) mentioned from the user's report (e.g., "Tell me more about becoming a ...")
  const matchedRoles = findMentionedJobs(lower, ctx.jobs);
  if (matchedRoles.length > 0) {
    if (/\b(compare|versus|vs\.?|difference|between)\b/.test(lower) && matchedRoles.length >= 2) {
      const [first, second] = matchedRoles;
      return (
        `Here's how those two roles compare for your ${ctx.blendLabel} (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}):\n\n` +
        `• ${first.title} (${first.matchPercentage}% match · ${first.isOfficeRole ? 'Office' : 'Field / Hands-On'}): ${first.description} Key skills: ${(first.keySkills || []).join(', ')}.\n` +
        `• ${second.title} (${second.matchPercentage}% match · ${second.isOfficeRole ? 'Office' : 'Field / Hands-On'}): ${second.description} Key skills: ${(second.keySkills || []).join(', ')}.\n\n` +
        `Try starting with ${first.title}'s first step ("${first.firstStep}") or ask how to tailor your resume toward either path.`
      );
    }

    const role = matchedRoles[0];
    const roleProfile = role.jobDiscProfile || {};
    return (
      `${role.title} is a ${role.matchPercentage}% match for your ${ctx.styleTitle} profile (${role.isOfficeRole ? 'Office role' : 'Field / Hands-On role'} in ${role.family}).\n\n` +
      `• Why it fits: ${role.description}\n` +
      `• DISC alignment: Your scores (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}) vs. role profile (D:${roleProfile.D ?? '-'}, I:${roleProfile.I ?? '-'}, S:${roleProfile.S ?? '-'}, C:${roleProfile.C ?? '-'}).\n` +
      `• Core skills to build: ${(role.keySkills || []).join(', ')}.\n` +
      `• Concrete first step: ${role.firstStep}`
    );
  }

  // 3. Hands-on / non-office / field roles
  if (/\b(hands[\s-]?on|non[\s-]?office|field|outdoor\w*|trade\w*|physical|active|on[\s-]?site)\b/.test(lower)) {
    const fieldJobs = ctx.jobs.filter((j) => !j.isOfficeRole).slice(0, 4);
    return (
      `Here are the top hands-on / non-office roles matched to your ${ctx.blendLabel} (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}):\n\n` +
      `${formatJobBullets(fieldJobs)}\n\n` +
      `Want to dive deeper into any one of these roles or compare two of them?`
    );
  }

  // 4. Office / desk / corporate / remote roles
  if (/\b(office|desk|corporate|remote|hybrid|analytical|business)\b/.test(lower)) {
    const officeJobs = ctx.jobs.filter((j) => j.isOfficeRole).slice(0, 4);
    return (
      `Here are the top office roles aligned with your ${ctx.styleTitle} profile (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}):\n\n` +
      `${formatJobBullets(officeJobs)}\n\n` +
      `Ask me about any specific title above for a tailored skill plan or interview prep angle.`
    );
  }

  // 5. Interview / resume / portfolio / STAR prep
  if (/\b(interview\w*|resume\w*|cv|portfolio|cover letter|star|application\w*|pitch)\b/.test(lower)) {
    const topRole = ctx.jobs[0];
    return (
      `To stand out in interviews or resumes with your ${ctx.styleTitle} blend:\n\n` +
      `• Lead with your top strength: "${ctx.strengths[0]}" — frame a STAR story (Situation, Task, Action, Result) showing measurable impact.\n` +
      `• Show self-awareness on growth: share how you actively practice "${ctx.growthAreas[0]}".\n` +
      `• Target skills for your #1 match (${topRole?.title}): highlight ${(topRole?.keySkills || []).join(', ')}.\n\n` +
      `Which role are you interviewing for so we can shape a specific STAR story?`
    );
  }

  // 6. Communication / teamwork / conflict / manager
  if (/\b(communicat\w*|conflict\w*|manager\w*|boss|team\w*|coworker\w*|colleague\w*|collaborat\w*|feedback|meeting\w*)\b/.test(lower)) {
    return (
      `For workplace communication with your ${ctx.blendLabel} (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}):\n\n` +
      `• Your natural edge: ${primaryMeta.tendency}, reinforced by ${secondaryMeta.tendency}.\n` +
      `• Watch-out to practice: ${ctx.growthAreas[0]}.\n` +
      `• Quick habit: When partnering with opposite styles, ask up front whether they prefer a quick bottom-line summary (high D), collaborative brainstorming (high I), steady step-by-step context (high S), or supporting data (high C).\n\n` +
      `Is there a specific teammate or manager situation you're navigating right now?`
    );
  }

  // 7. Strengths
  if (/\b(strength\w*|good at|best at|superpower\w*|talent\w*|advantage\w*)\b/.test(lower)) {
    return (
      `Your top workplace strengths as ${ctx.styleTitle} (${ctx.blendLabel}) are:\n\n` +
      `${ctx.strengths.map((s) => `• ${s}`).join('\n')}\n\n` +
      `You'll get the highest return from these strengths in ${ctx.families[0]?.name} (${ctx.families[0]?.matchProbability}%) and ${ctx.families[1]?.name} (${ctx.families[1]?.matchProbability}%).`
    );
  }

  // 8. Weaknesses / growth areas / blind spots
  if (/\b(weakness\w*|growth|blind spot\w*|improv\w*|struggl\w*|challeng\w*|practis\w*|practic\w*|flaw\w*)\b/.test(lower)) {
    return (
      `For your ${ctx.blendLabel}, here are the highest-leverage growth areas worth practicing:\n\n` +
      `${ctx.growthAreas.map((g) => `• ${g}`).join('\n')}\n\n` +
      `Pick just one of these to test in your meetings or projects this week—small, repeatable adjustments build lasting range without fighting your natural style.`
    );
  }

  // 9. Skills / learning / career switch / roadmap / first step
  if (/\b(skill\w*|learn\w*|course\w*|certif\w*|switch\w*|transition\w*|start\w*|first step|roadmap|plan\w*|next step\w*)\b/.test(lower)) {
    const topTwo = ctx.jobs.slice(0, 2);
    const skillSet = [...new Set(topTwo.flatMap((j) => j.keySkills || []))].slice(0, 5);
    return (
      `A practical 2-week action plan for your ${ctx.styleTitle} profile:\n\n` +
      `• High-leverage skills to build: ${skillSet.join(', ')}.\n` +
      `• Option 1 (${topTwo[0]?.title} — ${topTwo[0]?.matchPercentage}% match): ${topTwo[0]?.firstStep}\n` +
      `• Option 2 (${topTwo[1]?.title} — ${topTwo[1]?.matchPercentage}% match): ${topTwo[1]?.firstStep}\n\n` +
      `Tell me which direction excites you more and I can help break down a focused study or portfolio step.`
    );
  }

  // 10. Leadership / management / promotion
  if (/\b(lead\w*|manag\w*|promot\w*|executive\w*|director\w*|mentor\w*)\b/.test(lower)) {
    return (
      `Your ${ctx.blendLabel} brings a distinctive leadership style anchored in ${primaryMeta.name} (${scores[primary]}) and ${secondaryMeta.name} (${scores[secondary]}):\n\n` +
      `• How you lead best: lean on ${primaryMeta.tendency} while balancing with ${secondaryMeta.tendency}.\n` +
      `• Key leadership habit to practice: ${ctx.growthAreas[0]}.\n` +
      `• Strong leadership-leaning match in your report: ${ctx.jobs.find((j) => /manager|lead|supervisor|director|consultant/i.test(j.title))?.title || ctx.jobs[0]?.title}.\n\n` +
      `Are you aiming for people management, technical/project leadership, or an independent specialist track?`
    );
  }

  // 11. Career families / top roles / general career recommendations
  if (/\b(famil\w*|industr\w*|career\w*|job\w*|role\w*|recommend\w*|suggest\w*|fit\w*|suit\w*|path\w*|option\w*|best)\b/.test(lower)) {
    const topFamilies = ctx.families.slice(0, 3);
    const topJobs = ctx.jobs.slice(0, 3);
    return (
      `Based on your ${ctx.styleTitle} profile (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}), your strongest career families are:\n\n` +
      `${topFamilies.map((f, i) => `${i + 1}. ${f.name} — ${f.matchProbability}% fit`).join('\n')}\n\n` +
      `Your top 3 matched roles right now:\n` +
      `${topJobs.map((j) => `• ${j.title} (${j.matchPercentage}% match · ${j.isOfficeRole ? 'Office' : 'Field'})`).join('\n')}\n\n` +
      `Ask me about any of these roles, or ask specifically for office vs. hands-on recommendations.`
    );
  }

  // 12. DISC scores / blend / personality explanation
  if (/\b(dominan\w*|influen\w*|steadi\w*|conscientious\w*|disc|score\w*|blend\w*|profile\w*|trait\w*|mean\w*|explain\w*|summar\w*)\b/.test(lower)) {
    return (
      `Here is a breakdown of your ${ctx.styleTitle} (${ctx.blendLabel}):\n\n` +
      `• Dominance (D): ${scores.D}/100 · Influence (I): ${scores.I}/100 · Steadiness (S): ${scores.S}/100 · Conscientiousness (C): ${scores.C}/100.\n` +
      `• Your primary driver is ${primaryMeta.name} (${primaryMeta.tendency}), supported by ${secondaryMeta.name} (${secondaryMeta.tendency}).\n` +
      `• Remember: DISC is a flexible self-reflection mirror, not a fixed label—you can stretch into any dimension when a role calls for it.`
    );
  }

  // 13. Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you)\b/.test(lower)) {
    return (
      `Hi! I'm your DISC Career Coach, tuned to your ${ctx.styleTitle} profile (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}).\n\n` +
      `Try asking me about:\n` +
      `• Specific roles in your report (e.g., "Tell me more about ${ctx.jobs[0]?.title}")\n` +
      `• Office vs. hands-on role matches\n` +
      `• Your top strengths, growth areas, or STAR interview examples`
    );
  }

  // 14. Smart non-repetitive fallback acknowledging the user's actual query
  const lastModelReply = Array.isArray(history)
    ? [...history].reverse().find((m) => m.role === 'model')?.content || ''
    : '';
  const topJob = ctx.jobs[0];
  const secondJob = ctx.jobs[1];

  const primaryFallback =
    `Regarding "${rawMessage.slice(0, 90)}${rawMessage.length > 90 ? '…' : ''}": in Demo Mode I can give the most detailed guidance when you ask about your DISC traits, specific roles from your report (like ${topJob?.title} or ${secondJob?.title}), office vs. hands-on fits, skills to learn, interview prep, or workplace communication.\n\n` +
    `For your ${ctx.blendLabel} (${ctx.styleTitle}), your top family is ${ctx.families[0]?.name} (${ctx.families[0]?.matchProbability}%). Which of those areas would you like to explore next?`;

  if (lastModelReply && lastModelReply.includes('in Demo Mode I can give')) {
    return (
      `I want to make sure I'm answering your question ("${rawMessage.slice(0, 80)}${rawMessage.length > 80 ? '…' : ''}") usefully! Right now the coach is running in offline Demo Mode (no Gemini API key configured on the server), so open-ended freeform questions are limited to structured career topics.\n\n` +
      `You can ask directly about any of your 20 matched jobs—such as "${topJob?.title}" or "${ctx.jobs.find((j) => !j.isOfficeRole)?.title || secondJob?.title}"—or ask about strengths, growth areas, leadership, communication, or interview prep.`
    );
  }

  return primaryFallback;
};

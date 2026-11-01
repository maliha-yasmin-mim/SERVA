import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import FreeItem from '../models/FreeItem.js';
import ProofRecord from '../models/ProofRecord.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import { STATUS } from '../config/constants.js';

export const seedDevelopmentDataIfEmpty = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('[Seed] Database already has data. Skipping automatic seed.');
    return;
  }

  console.log('[Seed] Seeding realistic development data for Bangladesh...');

  // 1. Users
  const admin = await User.create({
    name: 'SERVA Platform Administrator',
    email: 'admin@serva.com.bd',
    password: 'password123',
    role: 'admin',
    phone: '+880 1711 000001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    bio: 'Platform Compliance and Verification Operations at SERVA Bangladesh.',
    location: 'Dhaka - Gulshan',
    verificationStatus: 'Verified',
    reliabilityScore: 100,
    rating: 5.0,
    reviewCount: 0
  });

  const tariq = await User.create({
    name: 'Tariqul Islam',
    email: 'tariq@serva.com.bd',
    password: 'password123',
    role: 'user',
    phone: '+880 1819 123456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Certified master electrician with 8+ years experience in Dhaka. Specializes in distribution boards, inverter AC repairs, and full residential rewiring.',
    location: 'Dhaka - Dhanmondi',
    skills: ['Electrical Wiring', 'Appliance Repair', 'AC Servicing', 'Circuit Breakers', 'Generator Maintenance'],
    servicesOffered: ['Electrical Work', 'Repairs and Maintenance'],
    hourlyRate: 500,
    isAvailableNow: true,
    verificationStatus: 'Verified',
    verificationDetails: {
      nidNumber: '1991261548000192',
      submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      reviewerNotes: 'Verified with National ID Database and Bangladesh Technical Board certificate.'
    },
    rating: 4.9,
    reviewCount: 38,
    completedJobsCount: 42,
    reliabilityScore: 98
  });

  const nasreen = await User.create({
    name: 'Nasreen Akhter',
    email: 'nasreen@serva.com.bd',
    password: 'password123',
    role: 'user',
    phone: '+880 1912 654321',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    bio: 'Professional residential organizer and deep cleaning specialist. Equipped with industrial steam sanitizers and eco-friendly supplies.',
    location: 'Dhaka - Banani',
    skills: ['Deep Cleaning', 'Kitchen Degreasing', 'Bathroom Sanitation', 'Post-Tenancy Clean', 'Furniture Shifting'],
    servicesOffered: ['Cleaning', 'Moving and Shifting'],
    hourlyRate: 400,
    isAvailableNow: true,
    verificationStatus: 'Verified',
    verificationDetails: {
      nidNumber: '1994269871000451',
      submittedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      reviewerNotes: 'Identity confirmed via Smart NID card.'
    },
    rating: 4.8,
    reviewCount: 29,
    completedJobsCount: 34,
    reliabilityScore: 96
  });

  const karim = await User.create({
    name: 'Karim Ullah',
    email: 'karim@serva.com.bd',
    password: 'password123',
    role: 'user',
    phone: '+880 1611 789012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Reliable moving crew lead and carpenter based in Chattogram. Pickup vans, packing supplies, and careful furniture disassembly.',
    location: 'Chattogram - Agrabad',
    skills: ['Furniture Assembly', 'Heavy Lifting', 'Packing & Moving', 'Carpentry Repairs'],
    servicesOffered: ['Moving and Shifting', 'Repairs and Maintenance'],
    hourlyRate: 450,
    isAvailableNow: false,
    verificationStatus: 'Verified',
    rating: 4.7,
    reviewCount: 16,
    completedJobsCount: 19,
    reliabilityScore: 92
  });

  const rahim = await User.create({
    name: 'Rahim Chowdhury',
    email: 'rahim@serva.com.bd',
    password: 'password123',
    role: 'user',
    phone: '+880 1715 998877',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Apartment owner and software developer in Dhaka. Active community member on SERVA.',
    location: 'Dhaka - Dhanmondi',
    verificationStatus: 'Verified',
    rating: 5.0,
    reviewCount: 8,
    completedJobsCount: 12,
    reliabilityScore: 99
  });

  // 2. Sample Jobs
  const jobCleaning = await Job.create({
    title: 'Post-Renovation Apartment Deep Cleaning (3 BHK)',
    description: 'We just completed painting and minor tiling work in our 1800 sq ft apartment. Need an experienced 2-person cleaning team to thoroughly vacuum paint dust, polish floor tiles, clean window grills, and sanitize both bathrooms.',
    category: 'Cleaning',
    location: 'Dhaka - Dhanmondi',
    budget: 3500,
    paymentType: 'Fixed',
    workDate: 'Tomorrow, 9:00 AM',
    startTime: '09:00 AM',
    expectedDuration: '1 Day (approx 6-7 hours)',
    workersNeeded: 2,
    requiredSkills: ['Deep Cleaning', 'Tile Polishing', 'Window Grills', 'Sanitization'],
    requirements: [
      'Scrub paint spots from porcelain floor tiles without scratching',
      'Wipe down all glass windows and balcony sliding frames',
      'Sanitize master and guest bathrooms with chemical descaler',
      'SERVA ProofBox required with before-and-after photos'
    ],
    urgency: 'Urgent',
    contactPreference: 'In-App Chat',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
    ],
    poster: rahim._id,
    status: STATUS.JOB.IN_PROGRESS,
    assignedTo: nasreen._id,
    applicationsCount: 3
  });

  const jobPlumbing = await Job.create({
    title: 'Emergency Concealed Pipe Leak Detection & Fitting Repair',
    description: 'Water seepage noticed on bedroom wall adjacent to master bath. Requires experienced plumber with moisture/acoustic pipe detector to locate leak and replace faulty elbow fitting without damaging unnecessary tiles.',
    category: 'Plumbing',
    location: 'Dhaka - Gulshan',
    budget: 2800,
    paymentType: 'Fixed',
    workDate: 'Immediate',
    startTime: 'Morning',
    expectedDuration: '3-4 Hours',
    workersNeeded: 1,
    requiredSkills: ['Pipe Fitting', 'Leak Detection', 'PPR Pipe Welding'],
    requirements: ['Accurate acoustic/pressure check', 'Minimum tile breakage', 'Pressure test after replacement'],
    urgency: 'Urgent',
    poster: admin._id,
    status: STATUS.JOB.OPEN,
    applicationsCount: 2
  });

  const jobGardening = await Job.create({
    title: 'Rooftop Garden Care, Pruning & Drip Irrigation Setup',
    description: 'Looking for a knowledgeable plant enthusiast to prune fruit trees (mango, guava, lemon), repot 15 flowering plants with organic vermicompost, and check micro-drip irrigation pipes.',
    category: 'Gardening',
    location: 'Dhaka - Uttara',
    budget: 2200,
    paymentType: 'Fixed',
    workDate: 'This Weekend (Friday)',
    expectedDuration: 'Half Day',
    requiredSkills: ['Pruning', 'Vermicompost', 'Drip Irrigation', 'Pest Control'],
    poster: rahim._id,
    status: STATUS.JOB.OPEN,
    applicationsCount: 1
  });

  const jobMoving = await Job.create({
    title: 'Move Heavy Teakwood Dining Table and Wardrobe across City',
    description: 'Need careful disassembly, blanket wrapping, and transport of 1 solid teak dining table (6 chairs) and 1 3-door wardrobe from Agrabad to Panchlaish.',
    category: 'Moving and Shifting',
    location: 'Chattogram - Agrabad',
    budget: 4500,
    paymentType: 'Fixed',
    workDate: 'Next Tuesday',
    workersNeeded: 3,
    requiredSkills: ['Furniture Disassembly', 'Heavy Lifting', 'Truck Loading'],
    poster: rahim._id,
    status: STATUS.JOB.OPEN,
    applicationsCount: 1
  });

  const jobElectrical = await Job.create({
    title: 'Main DB Board Circuit Breaker Upgrade & Earth Inspection',
    description: 'Occasional tripping in AC sub-circuit. Need a licensed electrician to inspect breaker ratings (MCB/RCCB), test grounding resistance, and balance phase load.',
    category: 'Electrical Work',
    location: 'Dhaka - Banani',
    budget: 2500,
    paymentType: 'Fixed',
    workDate: 'Flexible within 3 days',
    requiredSkills: ['Circuit Breakers', 'Earth Testing', 'Phase Balancing'],
    poster: rahim._id,
    status: STATUS.JOB.OPEN,
    applicationsCount: 0
  });

  // 3. Signature Feature Seed: ProofBox Record for jobCleaning
  const proofBoxCleaning = await ProofRecord.create({
    job: jobCleaning._id,
    provider: nasreen._id,
    client: rahim._id,
    status: STATUS.PROOFBOX.IN_PROGRESS,
    startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    completionReportId: 'SRV-PB-260109',
    checklist: [
      {
        title: 'Initial room-by-room inspection and safety briefing',
        description: 'Check surfaces, inspect delicate fixtures, confirm client instructions',
        isRequired: true,
        isCompleted: true,
        completedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        completedBy: nasreen._id
      },
      {
        title: 'Pre-cleaning photographic evidence capture (Before photos)',
        description: 'Document paint splatters on floors and bathroom limescale',
        isRequired: true,
        isCompleted: true,
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        completedBy: nasreen._id
      },
      {
        title: 'Vacuuming all walls, ceiling fans, and window tracks',
        description: 'HEPA filtered industrial vacuum pass',
        isRequired: true,
        isCompleted: true,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedBy: nasreen._id
      },
      {
        title: 'Tile floor scrubbing & paint residue removal',
        description: 'Non-acidic scrubbing compound used on porcelain tiles',
        isRequired: true,
        isCompleted: false
      },
      {
        title: 'Full bathroom sanitization and chrome polishing',
        description: 'Descaling taps, mirrors, and shower enclosure',
        isRequired: true,
        isCompleted: false
      },
      {
        title: 'Final walkthrough & post-work photo capture (After photos)',
        description: 'Submit to client for sign-off',
        isRequired: true,
        isCompleted: false
      }
    ],
    beforeImages: [
      {
        url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
        note: 'Living room floor covered in plaster dust and paint droppings after renovation.',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        note: 'Guest bathroom tiles with water staining and grout residue.',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ],
    afterImages: [
      {
        url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
        note: 'Living room floors buffed and clear of dust. Windows streak-free.',
        uploadedAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ],
    progressUpdates: [
      {
        text: 'Arrived on site with 2 team members, HEPA vacuums, and eco chemicals.',
        imageUrl: '',
        timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000)
      },
      {
        text: 'Finished ceiling, fan blades, and bedroom windows. Moving to bathroom descaling.',
        imageUrl: '',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
      }
    ],
    approvalHistory: []
  });

  // 4. Sample Services
  await Service.create({
    title: 'Certified Electrical Wiring, AC & DB Board Diagnostics',
    description: 'Expert residential electrical support by certified technician. From short-circuit troubleshooting to inverter air conditioner diagnostics and concealed conduit rewiring across Dhaka.',
    category: 'Electrical Work',
    startingPrice: 600,
    pricingModel: 'Hourly',
    location: 'Dhaka - Dhanmondi',
    availability: 'Sat - Thu (9:00 AM - 8:00 PM)',
    skills: ['Circuit Breakers', 'AC Servicing', 'Concealed Wiring', 'Earth Testing'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80'
    ],
    packages: [
      {
        name: 'Basic Diagnosis & Switch/Socket Fix',
        description: 'Inspection of faulty sockets, switches, or light fixtures (up to 3 points)',
        price: 600,
        deliveryTime: 'Same Day (1-2 Hours)',
        features: ['Digital multimeter test', 'Earthing check', '14-day service warranty']
      },
      {
        name: 'Comprehensive DB Box & Sub-Circuit Servicing',
        description: 'Complete inspection of main distribution box, phase load balancing, and MCB replacement',
        price: 1800,
        deliveryTime: 'Same Day (3-4 Hours)',
        features: ['Phase load analysis', 'Loose contact retightening', 'Earth leakage check', '30-day service warranty']
      }
    ],
    provider: tariq._id,
    rating: 4.9,
    reviewCount: 38
  });

  await Service.create({
    title: 'Residential Deep Cleaning & Sanitization Services',
    description: 'Professional residential cleaning with modern machines, hospital-grade disinfectants, and trained staff. We make apartments fresh, spotless, and allergen-free.',
    category: 'Cleaning',
    startingPrice: 1500,
    pricingModel: 'Fixed Package',
    location: 'Dhaka - Banani',
    availability: 'Daily (8:00 AM - 6:00 PM)',
    skills: ['Deep Cleaning', 'Sanitization', 'Window Polishing', 'Kitchen Degreasing'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80'
    ],
    packages: [
      {
        name: 'Kitchen & Bathroom Duo Refresh',
        description: 'Heavy grease removal on tiles, chimney filter wash, toilet descaling, and tap shine',
        price: 2200,
        deliveryTime: '1 Day (3-4 Hours)',
        features: ['Steam degreaser', 'Grout scrub', 'Odour elimination']
      },
      {
        name: 'Full Apartment Deep Clean (up to 1500 sq ft)',
        description: 'All rooms, floor scrub, dust removal from grills and ceilings, kitchen & 2 bathrooms',
        price: 4500,
        deliveryTime: '1 Day (6-7 Hours)',
        features: ['3-member trained crew', 'HEPA vacuum', 'SERVA ProofBox report included']
      }
    ],
    provider: nasreen._id,
    rating: 4.8,
    reviewCount: 29
  });

  await Service.create({
    title: 'Hassle-Free Home Shifting, Heavy Packing & Van Transport',
    description: 'Reliable moving crew in Chattogram. We handle bubble-wrapping, foam corners, truck transport, and safe unloading for apartments and offices.',
    category: 'Moving and Shifting',
    startingPrice: 3000,
    pricingModel: 'Per Job',
    location: 'Chattogram - Agrabad',
    availability: 'All days with 24h prior booking',
    skills: ['Heavy Lifting', 'Packing Materials', 'Truck Loading'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80'
    ],
    packages: [
      {
        name: 'Single Room / Student Relocation',
        description: 'Transport of bed, study desk, 4-5 cartons within city limits',
        price: 3200,
        deliveryTime: 'Half Day',
        features: ['1 pickup van', '2 helpers', 'Careful handling']
      }
    ],
    provider: karim._id,
    rating: 4.7,
    reviewCount: 16
  });

  // 5. Sample Marketplace Products
  await Product.create({
    title: 'Bosch Professional Cordless Hammer Drill (18V) with Extra Battery',
    description: 'Original Bosch GSB 180-LI cordless drill set. Includes 2x 2.0Ah Li-ion batteries, quick charger, and heavy duty carry case. Used for light home DIY only, condition 9/10.',
    category: 'Tools & Hardware',
    price: 6800,
    condition: 'Like New',
    location: 'Dhaka - Dhanmondi',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80'
    ],
    seller: tariq._id,
    status: STATUS.PRODUCT.AVAILABLE
  });

  await Product.create({
    title: 'Ergonomic Mesh High-Back Office Chair with Lumbar Support',
    description: 'Imported breathable mesh ergonomic chair. Multi-lock tilt mechanism, 3D adjustable armrests, smooth nylon casters. Clean and in perfect mechanical shape.',
    category: 'Home & Furniture',
    price: 4500,
    condition: 'Gently Used',
    location: 'Dhaka - Gulshan',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c9fa7921a22a?auto=format&fit=crop&w=600&q=80'
    ],
    seller: rahim._id,
    status: STATUS.PRODUCT.AVAILABLE
  });

  await Product.create({
    title: 'Sony WH-1000XM4 Noise Cancelling Wireless Headphones',
    description: 'Black edition Sony XM4 with active noise cancellation. 30 hours battery life, touch sensor controls, original cable and carrying case included.',
    category: 'Electronics & Gadgets',
    price: 18500,
    condition: 'Like New',
    location: 'Dhaka - Banani',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    ],
    seller: rahim._id,
    status: STATUS.PRODUCT.AVAILABLE
  });

  // 6. Sample Free Stuff Items (Community Giveaways)
  await FreeItem.create({
    title: 'Solid Wood 2-Tier Coffee Table (Free Pickup)',
    description: 'Sturdy dark wood coffee table with minor surface marks from coffee mugs. Still very solid and great for a student apartment or living room. Giving away for free as we are redecorating.',
    category: 'Furniture',
    condition: 'Good',
    location: 'Dhaka - Dhanmondi',
    pickupInstructions: 'Ground floor apartment pickup. Please bring your own CNG or vehicle.',
    availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80'
    ],
    giver: rahim._id,
    status: STATUS.FREE_ITEM.AVAILABLE
  });

  await FreeItem.create({
    title: 'Complete HSC Science Books & Engineering Admission Test Question Banks',
    description: 'Physics, Chemistry, Higher Math (Class 11-12) textbooks along with BUET / Medical admission test solved papers from last 5 years. Clean, pages intact.',
    category: 'Books & Study Materials',
    condition: 'Good',
    location: 'Dhaka - Mirpur',
    pickupInstructions: 'Available for student pickup from Mirpur 10 circle.',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
    ],
    giver: tariq._id,
    status: STATUS.FREE_ITEM.AVAILABLE
  });

  await FreeItem.create({
    title: 'Vintage Panasonic 20L Microwave Oven (Working Condition)',
    description: 'Heats food and drinks reliably. The digital timer works, glass turntable plate is present. Replacing with built-in convection oven.',
    category: 'Kitchen & Household',
    condition: 'Fair',
    location: 'Chattogram - Nasirabad',
    pickupInstructions: 'Pickup from Nasirabad Housing Society, Friday afternoon.',
    images: [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&q=80'
    ],
    giver: karim._id,
    status: STATUS.FREE_ITEM.AVAILABLE
  });

  // 7. Sample Reviews
  await Review.create({
    reviewer: rahim._id,
    reviewee: tariq._id,
    rating: 5,
    comment: 'Tariq bhai is an exceptional electrician. Diagnosed our tripping circuit breaker within 15 minutes and explained everything clearly. Verified ProofBox report was generated cleanly!'
  });

  await Review.create({
    reviewer: rahim._id,
    reviewee: nasreen._id,
    rating: 5,
    comment: 'Nasreen and her team did wonders with our apartment cleaning. Punctual, meticulous, and left the bathrooms looking brand new.'
  });

  // 8. Sample Notifications
  await Notification.create({
    recipient: nasreen._id,
    sender: rahim._id,
    type: 'job_status',
    title: 'ProofBox Active: Post-Renovation Cleaning',
    message: 'Work is currently in progress. Checklist items and before-photos have been recorded.',
    link: `/dashboard/proofbox/${jobCleaning._id}`,
    isRead: false
  });

  await Notification.create({
    recipient: rahim._id,
    sender: tariq._id,
    type: 'system',
    title: 'Welcome to SERVA',
    message: 'Your account is verified! You can discover local work, request services, and exchange items safely.',
    link: '/dashboard',
    isRead: true
  });

  // 9. Sample Payments (bKash / Nagad / Cards / Escrow)
  await Payment.create({
    payer: rahim._id,
    receiver: nasreen._id,
    amount: 3200,
    currency: 'BDT',
    paymentMethod: 'bKash',
    status: 'In Escrow',
    transactionId: 'SRV-BKA-982143',
    purpose: 'Job Escrow',
    relatedJob: jobCleaning._id,
    paymentDetails: {
      payerPhone: '+880 1712 345678',
      notes: 'Escrow deposit for 3-Room Apartment Deep Cleaning'
    }
  });

  await Payment.create({
    payer: rahim._id,
    receiver: tariq._id,
    amount: 1800,
    currency: 'BDT',
    paymentMethod: 'Nagad',
    status: 'Completed',
    transactionId: 'SRV-NAG-654120',
    purpose: 'Service Booking',
    paymentDetails: {
      payerPhone: '+880 1712 345678',
      notes: 'Emergency Electrical DB Box Fix'
    }
  });

  await Payment.create({
    payer: rahim._id,
    amount: 4500,
    currency: 'BDT',
    paymentMethod: 'SSLCommerz',
    status: 'Completed',
    transactionId: 'SRV-SSL-773190',
    purpose: 'Marketplace Purchase',
    paymentDetails: {
      payerPhone: '+880 1712 345678',
      notes: 'Purchase of Ergonomic Office Chair'
    }
  });

  console.log('[Seed] Development data seeded successfully!');
  console.log('----------------------------------------------------');
  console.log('Admin Account: admin@serva.com.bd | password123');
  console.log('Provider Account: tariq@serva.com.bd | password123');
  console.log('Provider Account: nasreen@serva.com.bd | password123');
  console.log('Client Account: rahim@serva.com.bd | password123');
  console.log('----------------------------------------------------');
};

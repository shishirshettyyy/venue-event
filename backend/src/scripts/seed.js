/**
 * Seed script — populates MongoDB with:
 *   - 1 admin user
 *   - 1 organizer user
 *   - 1 attendee user
 *   - All 8 events from the frontend mock data
 *   - Team members from about.js
 *
 * Run: npm run seed (from the server/ directory)
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('../config/db')
const User = require('../models/User')
const Event = require('../models/Event')
const TeamMember = require('../models/TeamMember')

const HASH = async (pw) => bcrypt.hash(pw, 12)

const seedUsers = async () => {
  const users = [
    {
      name: 'Admin User',
      email: 'admin@venue.app',
      passwordHash: await HASH('admin123'),
      role: 'admin',
      isVerified: true,
    },
    {
      name: 'Arun Organizer',
      email: 'organizer@venue.app',
      passwordHash: await HASH('organizer123'),
      role: 'organizer',
      isVerified: true,
    },
    {
      name: 'Priya Attendee',
      email: 'attendee@venue.app',
      passwordHash: await HASH('attendee123'),
      role: 'attendee',
      isVerified: true,
    },
  ]

  await User.deleteMany({})
  const created = await User.insertMany(users)
  console.log(`✅ ${created.length} users seeded`)
  return created
}

const seedEvents = async (organizer) => {
  const events = [
    {
      title: 'React & the Modern Web — Full-Day Workshop',
      category: 'Workshop',
      city: 'Ahmedabad',
      state: 'Gujarat',
      venue: 'GIFT City Convention Hall',
      dateTime: new Date('2026-08-14T10:00:00+05:30'),
      price: 499,
      totalSeats: 120,
      seatsBooked: 78,
      organizer: organizer._id,
      status: 'published',
      description:
        'A hands-on day building real interfaces with React, covering component architecture, state management, and deployment. Bring a laptop; all skill levels welcome.',
      bannerImage: 'workshop',
    },
    {
      title: 'Startup Founders Meetup',
      category: 'Meetup',
      city: 'Bengaluru',
      state: 'Karnataka',
      venue: 'Koramangala Innovation Hub',
      dateTime: new Date('2026-08-02T18:30:00+05:30'),
      price: 0,
      totalSeats: 80,
      seatsBooked: 65,
      organizer: organizer._id,
      status: 'published',
      description:
        'An informal evening of lightning pitches, product feedback, and networking for early-stage founders and builders.',
      bannerImage: 'meetup',
    },
    {
      title: 'Prithvi Theatre Presents: Ek Ruka Hua Faisla',
      category: 'Show',
      city: 'Mumbai',
      state: 'Maharashtra',
      venue: 'Prithvi Theatre',
      dateTime: new Date('2026-08-09T19:00:00+05:30'),
      price: 650,
      totalSeats: 200,
      seatsBooked: 192,
      organizer: organizer._id,
      status: 'published',
      description:
        'A gripping stage adaptation of the courtroom classic, performed by a celebrated ensemble cast.',
      bannerImage: 'show',
    },
    {
      title: 'Indie Music Night — Live Acoustic Sets',
      category: 'Concert',
      city: 'Udaipur',
      state: 'Rajasthan',
      venue: 'The Courtyard, Fatehsagar',
      dateTime: new Date('2026-08-22T20:00:00+05:30'),
      price: 349,
      totalSeats: 150,
      seatsBooked: 90,
      organizer: organizer._id,
      status: 'published',
      description:
        'Three independent acts, one open-air courtyard, and a night of unplugged music under the stars.',
      bannerImage: 'concert',
    },
    {
      title: 'DataConf India 2026',
      category: 'Conference',
      city: 'Hyderabad',
      state: 'Telangana',
      venue: 'HITEC City Convention Centre',
      dateTime: new Date('2026-09-05T09:00:00+05:30'),
      price: 1999,
      totalSeats: 600,
      seatsBooked: 390,
      organizer: organizer._id,
      status: 'published',
      description:
        'Two tracks covering applied ML, data engineering, and analytics leadership, with speakers from across the industry.',
      bannerImage: 'conference',
    },
    {
      title: 'Digital Electronics Bootcamp',
      category: 'Workshop',
      city: 'Jaipur',
      state: 'Rajasthan',
      venue: 'MNIT Jaipur, Seminar Block',
      dateTime: new Date('2026-08-18T11:00:00+05:30'),
      price: 299,
      totalSeats: 60,
      seatsBooked: 55,
      organizer: organizer._id,
      status: 'published',
      description:
        'From logic gates to microcontrollers — a practical bootcamp for students building their first embedded project.',
      bannerImage: 'workshop',
    },
    {
      title: 'Product Design Meetup: Portfolio Teardown',
      category: 'Meetup',
      city: 'Pune',
      state: 'Maharashtra',
      venue: 'Koregaon Park Studio',
      dateTime: new Date('2026-08-11T17:00:00+05:30'),
      price: 0,
      totalSeats: 50,
      seatsBooked: 28,
      organizer: organizer._id,
      status: 'published',
      description:
        'Bring your portfolio for live feedback from senior product designers, followed by open networking.',
      bannerImage: 'meetup',
    },
    {
      title: 'Carnatic Fusion Live',
      category: 'Concert',
      city: 'Chennai',
      state: 'Tamil Nadu',
      venue: 'Music Academy Auditorium',
      dateTime: new Date('2026-09-01T19:30:00+05:30'),
      price: 799,
      totalSeats: 400,
      seatsBooked: 305,
      organizer: organizer._id,
      status: 'published',
      description:
        'A genre-bending evening pairing classical Carnatic vocals with contemporary jazz instrumentation.',
      bannerImage: 'concert',
    },
  ]

  await Event.deleteMany({})
  const created = await Event.insertMany(events)
  console.log(`✅ ${created.length} events seeded`)
}

const seedTeam = async () => {
  const members = [
    {
      name: 'Rahul Mehta',
      role: 'Product & User Experience',
      bio: 'Designs the event discovery flow and the component system.',
      photo: '',
      links: { github: 'https://github.com', linkedin: 'https://linkedin.com', portfolio: '' },
      order: 1,
    },
    {
      name: 'Sneha Iyer',
      role: 'Backend & Database',
      bio: 'Builds the API, seat-inventory logic, and keeps the data consistent.',
      photo: '',
      links: { github: 'https://github.com', linkedin: 'https://linkedin.com', portfolio: '' },
      order: 2,
    },
    {
      name: 'Kiran Rao',
      role: 'Operations & Organizer Tools',
      bio: 'Owns the organizer dashboard and event publishing workflows.',
      photo: '',
      links: { github: 'https://github.com', linkedin: 'https://linkedin.com', portfolio: '' },
      order: 3,
    },
  ]

  await TeamMember.deleteMany({})
  const created = await TeamMember.insertMany(members)
  console.log(`✅ ${created.length} team members seeded`)
}

async function seed() {
  await connectDB()
  const users = await seedUsers()
  const organizer = users.find((u) => u.role === 'organizer')
  await seedEvents(organizer)
  await seedTeam()

  console.log('\n🎉 Database seeded successfully!')
  console.log('   admin@venue.app      / admin123')
  console.log('   organizer@venue.app  / organizer123')
  console.log('   attendee@venue.app   / attendee123')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

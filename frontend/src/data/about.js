// Structured content for the About page. Kept as plain data so it can
// later be swapped for a fetch to a CMS/backend endpoint without
// touching the page component.

export const mission = {
  eyebrow: 'About the platform',
  heading: 'Built to make finding an event effortless',
  body: 'Venue brings workshops, meetups, shows and conferences from across the country onto one platform — so discovering and booking a seat takes minutes, not tabs.',
}

export const stats = [
  { label: 'Cities covered', value: '9+' },
  { label: 'Categories', value: '5' },
  { label: 'Avg. booking time', value: '< 2 min' },
]

export const departments = [
  {
    name: 'Product & user experience',
    detail: 'Event discovery, booking flow, and the design system that ties every screen together.',
  },
  {
    name: 'Platform & data',
    detail: 'Event listings, seat availability, and the APIs that power search and filtering.',
  },
  {
    name: 'Operations & organizer tools',
    detail: 'The dashboard organizers use to publish events and manage bookings.',
  },
]

export const values = [
  { title: 'Clarity first', body: 'Pricing, seat availability, and event details are shown upfront — no surprises at checkout.' },
  { title: 'Built for scale', body: 'The same platform works for a free meetup or a ticketed conference of a thousand people.' },
  { title: 'Fast to book', body: 'From landing on an event to a confirmed ticket in three steps, no account required to browse.' },
]

export const techStack = ['React.js', 'Vite', 'Tailwind CSS', 'React Router', 'Node.js', 'Express.js', 'MongoDB']

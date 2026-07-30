/**
 * Seed script — populates the database with sample events for development.
 * Run with: npx ts-node prisma/seed.ts
 */
import { PrismaClient, EventType } from '@prisma/client'

const prisma = new PrismaClient()

const SEEDS: { eventType: EventType; message: string }[] = [
  { eventType: 'ENTRY',  message: 'Visitor entered the main building' },
  { eventType: 'LOGIN',  message: 'Admin signed in to the console' },
  { eventType: 'ALERT',  message: 'Multiple failed login attempts detected' },
  { eventType: 'SYSTEM', message: 'Monitoring agent restarted' },
  { eventType: 'ENTRY',  message: 'Badge scan at west wing entrance' },
  { eventType: 'LOGIN',  message: 'User authenticated via SSO' },
  { eventType: 'ALERT',  message: 'Unusual access pattern flagged' },
  { eventType: 'SYSTEM', message: 'Configuration profile updated' },
]

async function main() {
  console.log('🌱 Seeding database...')

  for (const seed of SEEDS) {
    const event = await prisma.event.create({ data: seed })
    await prisma.notification.create({
      data: { eventId: event.id, channel: 'IN_APP', status: 'SENT' },
    })
    console.log(`  ✓ Created ${seed.eventType}: ${seed.message}`)
  }

  console.log('✅ Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

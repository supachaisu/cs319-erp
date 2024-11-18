# Back-end

The back-end is built with Express and Prisma.

## Setup

1. Install dependencies: `npm install`
2. Setup Prisma: `npx prisma generate`
3. Create/sync database: `npx prisma migrate deploy`
4. Seed database: `npx prisma db seed`

## Production

1. Build: `npm run build`
2. Start server: `npm run start`

## Development

1. Start server: `npm run dev`

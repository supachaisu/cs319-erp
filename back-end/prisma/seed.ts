import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const transactionData: Prisma.TransactionCreateInput[] = [
  {
    description: "Tour Package Payment - Phuket 3D2N",
    amount: 15000,
    type: "INCOME",
    category: "Tour Package",
  },
  {
    description: "Hotel Booking Commission - Hilton",
    amount: 2500,
    type: "INCOME",
    category: "Commission",
  },
  {
    description: "Guide Fee - Bangkok City Tour",
    amount: 3000,
    type: "EXPENSE",
    category: "Guide Fee",
  },
  {
    description: "Van Rental - Airport Transfer",
    amount: 1800,
    type: "EXPENSE",
    category: "Transportation",
  },
  {
    description: "Restaurant Booking - Group Dinner",
    amount: 12000,
    type: "EXPENSE",
    category: "Food and Beverage",
  },
  {
    description: "Flight Ticket Commission - BKK-CNX",
    amount: 1200,
    type: "INCOME",
    category: "Commission",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const t of transactionData) {
    const transaction = await prisma.transaction.create({
      data: t,
    });
    console.log(`Created transaction with id: ${transaction.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: "Tour Package",
    type: "INCOME",
  },
  {
    name: "Commission",
    type: "INCOME",
  },
  {
    name: "Guide Fee",
    type: "EXPENSE",
  },
  {
    name: "Service Fee",
    type: "INCOME",
  },
  {
    name: "Marketing",
    type: "EXPENSE",
  },
  {
    name: "Transportation",
    type: "EXPENSE",
  },
  {
    name: "Equipment",
    type: "EXPENSE",
  },
  {
    name: "Office",
    type: "EXPENSE",
  },
  {
    name: "Insurance",
    type: "EXPENSE",
  },
  {
    name: "Salary",
    type: "EXPENSE",
  },
  {
    name: "Training",
    type: "EXPENSE",
  },
  {
    name: "Rent",
    type: "EXPENSE",
  },
  {
    name: "Partnership",
    type: "INCOME",
  },
];

const transactionData: Prisma.TransactionCreateInput[] = [
  // March 2024
  {
    description: "Tour Package - Phuket Premium",
    amount: 45000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2024-03-15"),
  },
  {
    description: "Daily Office Expenses",
    amount: 500,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Office"
      }
    },
    date: new Date("2024-03-15"),
  },
  {
    description: "Hotel Commission - Marriott",
    amount: 3500,
    type: "INCOME",
    category: {
      connect: {
        name: "Commission"
      }
    },
    date: new Date("2024-03-14"),
  },
  {
    description: "Staff Transportation",
    amount: 600,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Transportation"
      }
    },
    date: new Date("2024-03-14"),
  },
  {
    description: "Group Tour - Temples",
    amount: 25000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2024-03-13"),
  },
  {
    description: "Guide Payments",
    amount: 2000,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Guide Fee"
      }
    },
    date: new Date("2024-03-13"),
  },
  {
    description: "Visa Processing",
    amount: 4500,
    type: "INCOME",
    category: {
      connect: {
        name: "Service Fee"
      }
    },
    date: new Date("2024-03-12"),
  },
  {
    description: "Marketing Materials",
    amount: 1500,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Marketing"
      }
    },
    date: new Date("2024-03-12"),
  },

  // February 2024 (adding more daily entries)
  {
    description: "Luxury Tour Package",
    amount: 75000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2024-02-28"),
  },
  {
    description: "Vehicle Maintenance",
    amount: 3000,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Transportation"
      }
    },
    date: new Date("2024-02-28"),
  },
  {
    description: "Hotel Bookings",
    amount: 35000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2024-02-27"),
  },
  {
    description: "Office Supplies",
    amount: 800,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Office"
      }
    },
    date: new Date("2024-02-27"),
  },
  {
    description: "Adventure Tour",
    amount: 28000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2024-02-26"),
  },
  {
    description: "Equipment Rental",
    amount: 5000,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Equipment"
      }
    },
    date: new Date("2024-02-26"),
  },
  {
    description: "Flight Commissions",
    amount: 12000,
    type: "INCOME",
    category: {
      connect: {
        name: "Commission"
      }
    },
    date: new Date("2024-02-25"),
  },
  {
    description: "Staff Training",
    amount: 3500,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Training"
      }
    },
    date: new Date("2024-02-25"),
  },

  // January 2024 (weekly entries for variation)
  {
    description: "New Year Special Tour",
    amount: 85000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2024-01-28"),
  },
  {
    description: "Monthly Rent",
    amount: 15000,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Rent"
      }
    },
    date: new Date("2024-01-28"),
  },
  {
    description: "Island Hopping Tour",
    amount: 45000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2024-01-21"),
  },
  {
    description: "Boat Rental",
    amount: 12000,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Transportation"
      }
    },
    date: new Date("2024-01-21"),
  },
  {
    description: "Cultural Tour Package",
    amount: 32000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2024-01-14"),
  },
  {
    description: "Local Guide Fees",
    amount: 4500,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Guide Fee"
      }
    },
    date: new Date("2024-01-14"),
  },
  {
    description: "Hotel Partnership Revenue",
    amount: 25000,
    type: "INCOME",
    category: {
      connect: {
        name: "Partnership"
      }
    },
    date: new Date("2024-01-07"),
  },
  {
    description: "Insurance Payments",
    amount: 8000,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Insurance"
      }
    },
    date: new Date("2024-01-07"),
  },

  // December 2023 (weekly entries)
  {
    description: "Christmas Special Tour",
    amount: 95000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2023-12-28"),
  },
  {
    description: "Year-end Bonuses",
    amount: 45000,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Salary"
      }
    },
    date: new Date("2023-12-28"),
  },
  {
    description: "Winter Package Tours",
    amount: 65000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2023-12-21"),
  },
  {
    description: "Marketing Campaign",
    amount: 15000,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Marketing"
      }
    },
    date: new Date("2023-12-21"),
  },
  {
    description: "City Tours Bundle",
    amount: 38000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2023-12-14"),
  },
  {
    description: "Vehicle Fleet Service",
    amount: 9500,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Transportation"
      }
    },
    date: new Date("2023-12-14"),
  },
  {
    description: "Early Bird Bookings",
    amount: 42000,
    type: "INCOME",
    category: {
      connect: {
        name: "Tour Package"
      }
    },
    date: new Date("2023-12-07"),
  },
  {
    description: "Office Maintenance",
    amount: 6500,
    type: "EXPENSE",
    category: {
      connect: {
        name: "Office"
      }
    },
    date: new Date("2023-12-07"),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  
  // First create a map of categories after seeding them
  const categoryMap = new Map();
  for (const c of categoryData) {
    const category = await prisma.category.create({ data: c });
    categoryMap.set(c.name, category.id);
    console.log(`Created category with id: ${category.id}`);
  }

  // Validate and filter transactions
  const validTransactions = transactionData.filter(t => {
    const categoryExists = categoryMap.has(t.category.connect!.name);
    if (!categoryExists) {
      console.warn(`Skipping transaction with invalid category: ${t.category.connect!.name}`);
    }
    return categoryExists;
  });

  // Then use the IDs in transactions
  const transactionDataWithIds = validTransactions.map(t => ({
    ...t,
    category: { connect: { id: categoryMap.get(t.category.connect!.name) } }
  }));

  // Seed transactions with the modified data
  for (const t of transactionDataWithIds) {
    const transaction = await prisma.transaction.create({ data: t });
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

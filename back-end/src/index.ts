import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const VALID_TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const;
const VALID_TRANSACTION_STATUSES = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
] as const;

const validateTransactionType = (
  type: unknown,
  res: express.Response
): boolean => {
  if (
    !VALID_TRANSACTION_TYPES.includes(
      type as (typeof VALID_TRANSACTION_TYPES)[number]
    )
  ) {
    res.status(400).json({
      error: `Invalid transaction type: ${type}. Must be one of: ${VALID_TRANSACTION_TYPES.join(
        ", "
      )}`,
    });
    return false;
  }
  return true;
};

const validateTransactionStatus = (
  status: unknown,
  res: express.Response
): boolean => {
  if (
    !VALID_TRANSACTION_STATUSES.includes(
      status as (typeof VALID_TRANSACTION_STATUSES)[number]
    )
  ) {
    res.status(400).json({
      error: `Invalid status: ${status}. Must be one of: ${VALID_TRANSACTION_STATUSES.join(
        ", "
      )}`,
    });
    return false;
  }
  return true;
};

app.post(`/transaction`, async (req, res) => {
  const { description, amount, type, category } = req.body;

  if (!description || !amount || !type || !category) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!validateTransactionType(type, res)) return;

  try {
    const result = await prisma.transaction.create({
      data: {
        description,
        amount,
        type,
        category,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Invalid transaction data" });
  }
});

app.get("/transactions", async (req, res) => {
  const { type, category, skip, take } = req.query;

  const where: Prisma.TransactionWhereInput = {
    ...(type && { type: type as string }),
    ...(category && { category: category as string }),
  };

  try {
    const transactions = await prisma.transaction.findMany({
      where,
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        date: "desc",
      },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.get("/transaction/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!transaction) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

app.put("/transaction/:id", async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category, status } = req.body;

  if (type && !validateTransactionType(type, res)) return;

  if (status && !validateTransactionStatus(status, res)) return;

  try {
    const transaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        description,
        amount,
        type,
        category,
        status,
      },
    });
    res.json(transaction);
  } catch (error) {
    res.status(400).json({
      error: `Transaction with ID ${id} does not exist or data is invalid`,
    });
  }
});

app.delete("/transaction/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Transaction with ID ${id} does not exist` });
  }
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
`)
);

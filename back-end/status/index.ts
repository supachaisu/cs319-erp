import { Router } from "express";
import { PrismaClient } from "@prisma/client";

export const router = Router();
const prisma = new PrismaClient();

// Get all statuses
router.get("/", async (req, res) => {
  try {
    const statuses = await prisma.status.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statuses" });
  }
});

// Get status by ID
router.get("/:id", async (req, res) => {
  try {
    const status = await prisma.status.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!status) res.status(404).json({ error: "Status not found" });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// Create status
router.post("/", async (req, res) => {
  try {
    const status = await prisma.status.create({
      data: req.body,
    });
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to create status" });
  }
});

// Update status
router.put("/:id", async (req, res) => {
  try {
    const status = await prisma.status.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Delete status
router.delete("/:id", async (req, res) => {
  try {
    await prisma.status.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete status" });
  }
});

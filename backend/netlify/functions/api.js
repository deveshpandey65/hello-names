const express = require('express');
const app = express();
const serverless = require('serverless-http');
const connectDB = require('../../connections/db');
const cors = require('cors')
const mongoose=require('mongoose')
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)


connectDB()
const nameSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

const Name = mongoose.models.Name || mongoose.model("Name", nameSchema)
app.use(express.json());
app.get("/api/names", async (req, res) => {
    try {
        const names = await Name.find().sort({ created_at: -1 })
        res.json(names)
    } catch (error) {
        console.error("[v0] Error fetching names:", error)
        res.status(500).json({ error: "Failed to fetch names" })
    }
})

// Add a new name
app.post("/api/names", async (req, res) => {
    body = JSON.parse(req.body || "{}");
    const { name } = body
    if (!name) return res.status(400).json({ error: "Name is required" })

    try {
        const newName = await Name.create({ name })
        res.status(201).json(newName)
    } catch (error) {
        console.error("Error adding name:", error)
        res.status(500).json({ error: "Failed to add name" })
    }
})

module.exports.handler = serverless(app, { callbackWaitsForEmptyEventLoop: false });

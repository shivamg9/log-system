const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Use the promise-based fs module
const path = require('path');

const app = express();
const PORT = 3001; // Choose a port for your backend

const DB_PATH = path.join(__dirname, 'db.json');

// --- Middleware ---
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Parse JSON request bodies

// --- "Database" Helper Functions ---
const readDb = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, create it with an empty structure
        if (error.code === 'ENOENT') {
            await writeDb({ logs: [] });
            return { logs: [] };
        }
        throw error;
    }
};

const writeDb = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// --- Routes ---
// TODO: Add POST /logs and GET /logs endpoints here

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// POST /logs - Ingest a single log entry
app.post('/logs', async (req, res) => {
    try {
        const newLog = req.body;

        // Basic validation (as per the "Exceeds Expectations" rubric)
        const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
        for (const field of requiredFields) {
            if (!newLog.hasOwnProperty(field)) {
                return res.status(400).json({ error: `Bad Request: Missing field '${field}'` });
            }
        }
        // You could add more specific validation here (e.g., ISO 8601 format for timestamp)

        const db = await readDb();
        db.logs.push(newLog);
        await writeDb(db);

        // Per spec, return 201 Created and the object
        res.status(201).json(newLog);

    } catch (error) {
        console.error('Error ingesting log:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /logs - Retrieve and filter log entries
app.get('/logs', async (req, res) => {
    try {
        const db = await readDb();
        let filteredLogs = [...db.logs];

        // Apply all filters from query parameters (AND logic)
        const { level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit } = req.query;

        if (level) {
            filteredLogs = filteredLogs.filter(log => log.level === level);
        }
        if (message) {
            filteredLogs = filteredLogs.filter(log => log.message.toLowerCase().includes(message.toLowerCase()));
        }
        if (resourceId) {
            filteredLogs = filteredLogs.filter(log => log.resourceId === resourceId);
        }
        if (traceId) {
            filteredLogs = filteredLogs.filter(log => log.traceId === traceId);
        }
        if (spanId) {
            filteredLogs = filteredLogs.filter(log => log.spanId === spanId);
        }
        if (commit) {
            filteredLogs = filteredLogs.filter(log => log.commit === commit);
        }
        if (timestamp_start) {
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(timestamp_start));
        }
        if (timestamp_end) {
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(timestamp_end));
        }

        // Sort by timestamp in reverse-chronological order (most recent first)
        filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        res.status(200).json(filteredLogs);

    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Log Ingestion & Query System
This is a full-stack log management tool built for a technical assessment. It features a Node.js/Express backend API for ingesting logs and a React frontend for querying and viewing them in a clean, filterable interface.

## Tech Stack
Backend: Node.js, Express.js
Frontend: React (bootstrapped with Vite), Axios
Persistence: A single db.json file, managed via Node's fs module.

## Key Features
Log Ingestion: A POST /logs endpoint to accept and store new log entries.
Log Querying: A GET /logs endpoint that supports filtering by multiple combined criteria.
Dynamic UI: A responsive interface to view and filter logs.
- Full-text search on log messages.
- Filter by log level (error, warn, info, etc.).
- Filter by resourceId.
- Filter by a timestamp date range.
Visual Cues: Log entries are color-coded based on their severity level for quick identification.

## Getting Started
Follow these instructions to get the project running locally.

## Prerequisites
You need to have Node.js and npm installed on your machine.

## Installation
1. Clone the repository to your local machine:
git clone <your-repo-url>
cd log-system-assessment

2. Install backend dependencies:
cd backend
npm install

3. Install frontend dependencies:
cd ../frontend
npm install

## Running the Application
You'll need to run the backend and frontend servers in two separate terminals.

1. Run the Backend Server:
In one terminal, navigate to the backend directory and run:
node index.js

The API server will start on http://localhost:3001.

2. Run the Frontend Client:
In a second terminal, navigate to the frontend directory and run:
npm run dev

The React development server will start, typically on http://localhost:5173.

3. View the Application:
Open your browser and navigate to http://localhost:5173.

## How to Add Logs
To test the system, you can send POST requests to the ingestor endpoint. Here are a few examples using curl:
Create an error log:
curl -X POST http://localhost:3001/logs -H "Content-Type: application/json" -d '{ "level": "error", "message": "Failed to connect to database.", "resourceId": "server-1234", "timestamp": "2023-10-26T10:00:00Z", "traceId": "abc-xyz-123", "spanId": "span-456", "commit": "5e5342f", "metadata": { "parentResourceId": "server-5678" } }'

Create an info log:
curl -X POST http://localhost:3001/logs -H "Content-Type: application/json" -d '{ "level": "info", "message": "User login successful.", "resourceId": "server-5678", "timestamp": "2023-10-26T10:05:00Z", "traceId": "def-uvw-456", "spanId": "span-457", "commit": "5e5342f", "metadata": {} }'

## Approach & Design Notes
A few notes on the decisions made during development:

- Data Persistence: As required, the app uses a db.json file for storage. All filtering and sorting logic is handled directly in Node.js using standard array methods. This was a good exercise in data manipulation. For a production system, I'd migrate to a proper database like PostgreSQL or a document store like MongoDB to handle race conditions and improve query performance.

- State Management: I stuck with React's built-in hooks (useState, useEffect, useCallback) for managing state. For an app of this size, a global state library like Redux felt like overkill. The main filter and log state lives in the App.jsx component and is passed down to children.

- API Performance: To avoid overwhelming the API with requests while the user is typing in a search field, I implemented a simple debounce function. This ensures that API calls are only made after the user has paused typing, making the UI feel more responsive and reducing backend load.
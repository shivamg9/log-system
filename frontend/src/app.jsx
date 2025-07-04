import React, { useState, useEffect, useCallback } from 'react';
import { fetchLogs } from './api';
import FilterBar from './components/FilterBar';
import LogList from './components/LogList';
import './App.css'; // We'll add some CSS later

function App() {
    const [logs, setLogs] = useState([]);
    const [filters, setFilters] = useState({
        level: '',
        message: '',
        resourceId: '',
        timestamp_start: '',
        timestamp_end: '',
        traceId: '',
        spanId: '',
        commit: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use useCallback to prevent re-creating the function on every render
    const loadLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchLogs(filters);
            setLogs(data);
        } catch (err) {
            setError('Failed to fetch logs. Is the backend server running?');
        } finally {
            setLoading(false);
        }
    }, [filters]); // Dependency: re-run only if 'filters' object changes

    // Initial load and subsequent re-loads when filters change
    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    return (
        <div className="app-container">
            <h1>Log Query Interface</h1>
            <FilterBar filters={filters} setFilters={setFilters} />
            {loading && <p>Loading logs...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && <LogList logs={logs} />}
        </div>
    );
}

export default App;
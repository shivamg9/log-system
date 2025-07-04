// frontend/src/components/LogItem.jsx
import React from 'react';

const LogItem = ({ log }) => {
    // Dynamically set a class based on the log level for styling
    const levelClass = `log-item log-item--${log.level}`;

    return (
        <div className={levelClass}>
            <div className="log-header">
                <span className="log-level">{log.level.toUpperCase()}</span>
                <span className="log-timestamp">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            <div className="log-message">{log.message}</div>
            <div className="log-meta">
                <span><strong>Resource:</strong> {log.resourceId}</span>
                <span><strong>Trace ID:</strong> {log.traceId}</span>
            </div>
        </div>
    );
};

export default LogItem;
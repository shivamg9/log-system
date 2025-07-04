// frontend/src/components/LogList.jsx
import React from 'react';
import LogItem from './LogItem';

const LogList = ({ logs }) => {
    if (logs.length === 0) {
        return <p>No logs found for the selected filters.</p>;
    }

    return (
        <div className="log-list">
            {logs.map((log, index) => (
                <LogItem key={`${log.traceId}-${index}`} log={log} />
            ))}
        </div>
    );
};

export default LogList;
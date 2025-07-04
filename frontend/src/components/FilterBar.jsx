// frontend/src/components/FilterBar.jsx
import React from 'react';

// A simple debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const FilterBar = ({ filters, setFilters }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };
    
    // Debounce the text inputs to avoid excessive API calls
    const debouncedSetFilters = debounce(handleInputChange, 500);

    return (
        <div className="filter-bar">
            {/* We'll use debounced handler for text inputs */}
            <input type="text" name="message" placeholder="Search message..." onChange={debouncedSetFilters} />
            <select name="level" value={filters.level} onChange={handleInputChange}>
                <option value="">All Levels</option>
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
            </select>
            <input type="text" name="resourceId" placeholder="Resource ID..." onChange={debouncedSetFilters} />
            <input type="datetime-local" name="timestamp_start" onChange={handleInputChange} />
            <input type="datetime-local" name="timestamp_end" onChange={handleInputChange} />
            {/* Add other filters as needed */}
        </div>
    );
};

export default FilterBar;
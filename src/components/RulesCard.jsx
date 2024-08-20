import React, { useEffect, useState } from 'react';
import axios from 'axios';

// API Base URL and Credentials
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'rule';
const USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

// Base64 Encode credentials
const credentials = btoa(`${USERNAME}:${PASSWORD}`);
const AUTH_HEADER = `Basic ${credentials}`;

const RulesCard = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                // Fetch rules from the API using Axios
                const response = await axios.get(API_BASE_URL, {
                    headers: {
                        'Authorization': AUTH_HEADER,
                    },
                });

                // Log the response data for debugging
                console.log('API Response:', response.data);

                setRules(response.data);
            } catch (err) {
                // Log the full error for debugging
                console.error('Error fetching rules:', err);
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="font-semibold text-lg mb-2">Rules</h2>
            {rules.length === 0 ? (
                <p>No rules available</p>
            ) : (
                rules.map((rule) => (
                    <div key={rule.id} className="mb-4 p-4 border rounded-lg bg-white shadow-md">
                        <h3 className="font-semibold text-md">{rule.title.rendered}</h3>
                        <div dangerouslySetInnerHTML={{ __html: rule.content.rendered }} />
                    </div>
                ))
            )}
        </div>
    );
};

export default RulesCard;

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API Base URLs and Credentials
const ANNOUNCEMENT_API_URL = import.meta.env.VITE_API_BASE_URL + 'announcement';
const RULES_API_URL = import.meta.env.VITE_API_BASE_URL + 'rule';
const USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

// Base64 Encode credentials
const credentials = btoa(`${USERNAME}:${PASSWORD}`);
const AUTH_HEADER = `Basic ${credentials}`;

// Create the Announcement Context
const AnnouncementContext = createContext();

export const useAnnouncements = () => useContext(AnnouncementContext);

export const AnnouncementProvider = ({ children }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(ANNOUNCEMENT_API_URL, {
                    headers: {
                        'Authorization': AUTH_HEADER,
                    },
                });
                console.log('Announcements API Response:', response.data);

                if (response.data.length !== announcements.length) {
                    setAnnouncements(response.data);
                }
            } catch (err) {
                console.error('Error fetching announcements:', err);
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        const fetchRules = async () => {
            try {
                const response = await axios.get(RULES_API_URL, {
                    headers: {
                        'Authorization': AUTH_HEADER,
                    },
                });
                console.log('Rules API Response:', response.data);

                setRules(response.data);
            } catch (err) {
                console.error('Error fetching rules:', err);
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch and set up interval for subsequent fetches
        fetchAnnouncements();
        fetchRules();

        const intervalId = setInterval(() => {
            fetchAnnouncements();
            fetchRules();
        }, 1000);

        // Cleanup the interval on unmount
        return () => clearInterval(intervalId);
    }, [announcements.length]);

    return (
        <AnnouncementContext.Provider value={{ announcements, rules, loading, error }}>
            {children}
        </AnnouncementContext.Provider>
    );
};

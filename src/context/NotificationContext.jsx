import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API Base URLs and Credentials
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

// Base64 Encode credentials
const credentials = btoa(`${USERNAME}:${PASSWORD}`);
const AUTH_HEADER = `Basic ${credentials}`;

// Create the Notification Context
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [rules, setRules] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // Track number of new unread notifications
    const [seenPostIds, setSeenPostIds] = useState(new Set()); // Track seen post IDs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}users/me`, {
                    headers: {
                        'Authorization': AUTH_HEADER,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchData = async () => {
            try {
                // Fetch announcements and rules
                const [announcementsResponse, rulesResponse] = await Promise.all([
                    axios.get(`${BASE_URL}announcement`, { headers: { 'Authorization': AUTH_HEADER } }),
                    axios.get(`${BASE_URL}rule`, { headers: { 'Authorization': AUTH_HEADER } }),
                ]);

                // Process announcements
                const fetchedAnnouncements = announcementsResponse.data;
                setAnnouncements(fetchedAnnouncements);

                // Process rules
                const fetchedRules = rulesResponse.data;
                setRules(fetchedRules);

                // Filter new notifications
                const newRules = fetchedRules.filter(rule => !seenPostIds.has(`rule-${rule.id}`))
                    .map(rule => {
                        seenPostIds.add(`rule-${rule.id}`);
                        return {
                            id: `rule-${rule.id}`,
                            description: `New rule: ${rule.title.rendered}`,
                            date: rule.date,
                            time: rule.date,
                        };
                    });

                const newAnnouncements = fetchedAnnouncements.filter(announcement => !seenPostIds.has(`announcement-${announcement.id}`))
                    .map(announcement => {
                        seenPostIds.add(`announcement-${announcement.id}`);
                        return {
                            id: `announcement-${announcement.id}`,
                            description: `New announcement: ${announcement.title.rendered}`,
                            date: announcement.date,
                            time: announcement.date,
                        };
                    });

                const newNotifications = [...newRules, ...newAnnouncements];

                if (newNotifications.length > 0) {
                    setNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
                    setUnreadCount(prevCount => prevCount + newNotifications.length);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchData();

        // Polling for new notifications every 1 second
        const id = setInterval(fetchData, 1000);

        // Cleanup the interval on unmount
        return () => clearInterval(id);
    }, [seenPostIds]);

    const markAllAsRead = () => {
        setUnreadCount(0); // Reset unread count to zero when all notifications are marked as read
    };

    return (
        <NotificationContext.Provider value={{ user, announcements, rules, notifications, unreadCount, markAllAsRead, loading, error }}>
            {children}
        </NotificationContext.Provider>
    );
};

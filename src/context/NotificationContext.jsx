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
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [rules, setRules] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [seenPostIds, setSeenPostIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        const saved = localStorage.getItem('notificationsEnabled');
        return saved !== null ? JSON.parse(saved) : true;
    }); // Notification preference

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}users/me`, {
                    headers: {
                        'Authorization': AUTH_HEADER,
                    },
                });
                setUser(response.data);

                if (response.data?.acf?.user_profile) {
                    const mediaResponse = await axios.get(`${BASE_URL}media/${response.data.acf.user_profile}`, {
                        headers: {
                            'Authorization': AUTH_HEADER,
                        },
                    });
                    setProfileImageUrl(mediaResponse.data.source_url);
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            }
        };

        const fetchData = async () => {
            if (!notificationsEnabled) return; // Skip fetching if notifications are disabled

            try {
                const [announcementsResponse, rulesResponse] = await Promise.all([
                    axios.get(`${BASE_URL}announcement`, { headers: { 'Authorization': AUTH_HEADER } }),
                    axios.get(`${BASE_URL}rule`, { headers: { 'Authorization': AUTH_HEADER } }),
                ]);

                const fetchedAnnouncements = announcementsResponse.data;
                setAnnouncements(fetchedAnnouncements);

                const fetchedRules = rulesResponse.data;
                setRules(fetchedRules);

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

        const id = setInterval(fetchData, 600000);

        return () => clearInterval(id);
    }, [seenPostIds, notificationsEnabled]);

    useEffect(() => {
        localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
    }, [notificationsEnabled]);

    const markAllAsRead = () => {
        setUnreadCount(0);
    };

    const toggleNotifications = () => {
        setNotificationsEnabled(prev => !prev);
    };

    return (
        <NotificationContext.Provider value={{ user, profileImageUrl, announcements, rules, notifications, unreadCount, markAllAsRead, loading, error, notificationsEnabled, toggleNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // Track number of new unread notifications
    const [seenPostIds, setSeenPostIds] = useState(new Set()); // Track seen post IDs
    const [intervalId, setIntervalId] = useState(null); // Store the interval ID for clearing

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}users/me`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchNotifications = async () => {
            try {
                const [rulesResponse, announcementsResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}rule`, {
                        headers: {
                            'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
                        },
                    }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}announcement`, {
                        headers: {
                            'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
                        },
                    }),
                ]);

                const newRules = rulesResponse.data.filter(rule => !seenPostIds.has(`rule-${rule.id}`))
                    .map(rule => {
                        seenPostIds.add(`rule-${rule.id}`);
                        return {
                            id: `rule-${rule.id}`,
                            description: `New rule: ${rule.title.rendered}`,
                            date: new Date().toLocaleDateString(),
                            time: new Date().toLocaleTimeString(),
                        };
                    });

                const newAnnouncements = announcementsResponse.data.filter(announcement => !seenPostIds.has(`announcement-${announcement.id}`))
                    .map(announcement => {
                        seenPostIds.add(`announcement-${announcement.id}`);
                        return {
                            id: `announcement-${announcement.id}`,
                            description: `New announcement: ${announcement.title.rendered}`,
                            date: new Date().toLocaleDateString(),
                            time: new Date().toLocaleTimeString(),
                        };
                    });

                const newNotifications = [...newRules, ...newAnnouncements];

                if (newNotifications.length > 0) {
                    setNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
                    setUnreadCount(prevCount => prevCount + newNotifications.length); // Increment the unread count by the number of new notifications
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchUserData();
        fetchNotifications();

        // Polling for new notifications every 1 second
        const id = setInterval(fetchNotifications, 1000);
        setIntervalId(id);

        return () => clearInterval(id);
    }, [seenPostIds]);

    const markAllAsRead = () => {
        setUnreadCount(0); // Reset unread count to zero when all notifications are marked as read
    };

    return (
        <NotificationContext.Provider value={{ user, notifications, unreadCount, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

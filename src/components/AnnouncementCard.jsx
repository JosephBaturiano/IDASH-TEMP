import React, { useEffect, useState } from 'react';

// API Base URL and Credentials
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'announcement';
const USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

// Base64 Encode credentials
const credentials = btoa(`${USERNAME}:${PASSWORD}`);
const AUTH_HEADER = `Basic ${credentials}`;

const AnnouncementCard = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(API_BASE_URL, {
                    headers: {
                        'Authorization': AUTH_HEADER,
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                // Log the response data for debugging
                console.log('API Response:', data);

                setAnnouncements(data);
            } catch (err) {
                // Log the full error for debugging
                console.error('Error fetching announcements:', err);
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="font-semibold text-lg mb-2">Announcements</h2>
            {announcements.length === 0 ? (
                <p>No announcements available</p>
            ) : (
                announcements.map((announcement) => (
                    <div key={announcement.id} className="mb-4 p-4 border rounded-lg bg-gray-100">
                        <h2 className="font-semibold text-lg">{announcement.title.rendered}</h2>
                        <div dangerouslySetInnerHTML={{ __html: announcement.content.rendered }} />
                    </div>
                ))
            )}
        </div>
    );
};

export default AnnouncementCard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'announcement';

const AnnouncementCard = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                // Replace with your WordPress REST API endpoint for 'announcements' post type
                const response = await axios.get(`${API_BASE_URL}`);
                setAnnouncements(response.data);
            } catch (err) {
                setError(err.message);
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
